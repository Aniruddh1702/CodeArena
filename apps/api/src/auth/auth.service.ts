import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

const COMPROMISED_PASSWORDS = new Set([
  'password',
  'password123',
  'password123!',
  'admin123',
  'admin123!',
  '12345678',
  'qwerty123',
  'letmein123',
  'welcome123',
  'codearena123',
  'test1234',
  'iloveyou123',
  'secret123',
  'pass1234',
  'master123',
  'dragon123',
]);

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private audit: AuditService,
    private emailService: EmailService,
  ) {}

  // ── Register (Students only via public registration) ──
  async register(dto: RegisterDto, ip?: string, userAgent?: string) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const normalizedUsername = dto.username.trim();

    // Check compromised password list
    if (COMPROMISED_PASSWORDS.has(dto.password.toLowerCase())) {
      throw new BadRequestException(
        'This password is known to be compromised and easily guessed. Please choose a more secure password.',
      );
    }

    // Check if email already exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingEmail) {
      throw new ConflictException('An account with this email already exists');
    }

    // Check if username already exists
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: normalizedUsername },
    });
    if (existingUsername) {
      throw new ConflictException('This username is already taken');
    }

    // Hash password with safe integer salt rounds
    const rawSalt = this.config.get('BCRYPT_SALT_ROUNDS', 10);
    const saltRounds = typeof rawSalt === 'number' ? rawSalt : parseInt(String(rawSalt), 10) || 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    // Generate cryptographically secure email verification token
    const emailVerifyToken = uuidv4();
    const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Create user (PENDING_VERIFICATION status, emailVerified: false)
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        passwordHash,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        role: UserRole.STUDENT,
        status: 'PENDING_VERIFICATION',
        emailVerified: false,
        emailVerifyToken,
        emailVerifyExpires,
      },
    });

    // Create initial rating safely
    try {
      await this.prisma.rating.create({
        data: { userId: user.id },
      });
    } catch (e) {
      // Ignore if rating table already has row
    }

    // Dispatch real verification email
    await this.emailService.sendVerificationEmail(user.email, emailVerifyToken, user.firstName);

    // Audit log
    await this.audit.log({
      userId: user.id,
      action: 'auth.register',
      entity: 'user',
      entityId: user.id,
      ipAddress: ip,
      userAgent,
    });

    // Do NOT issue access/refresh tokens until email is verified (Rule 1)
    return {
      user: this.sanitizeUser(user),
      emailVerified: false,
      message: 'Account registered successfully. Please verify your email before logging in.',
    };
  }

  // ── Login ──
  async login(dto: LoginDto, ip?: string, userAgent?: string) {
    const identifier = dto.email.trim();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Your account has been suspended');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Enforce email verification (Rule 2)
    if (!user.emailVerified || user.status === 'PENDING_VERIFICATION') {
      throw new UnauthorizedException(
        'Your account has not been verified yet. Please check your email for the verification link or request a new one.',
      );
    }

    // Update login info
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
    });

    // Audit log
    await this.audit.log({
      userId: user.id,
      action: 'auth.login',
      entity: 'user',
      entityId: user.id,
      ipAddress: ip,
      userAgent,
    });

    const tokens = await this.generateTokens(user.id, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // ── Logout ──
  async logout(userId: string, refreshToken?: string, ip?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { token: refreshToken, userId },
        data: { revoked: true },
      });
    }

    await this.audit.log({
      userId,
      action: 'auth.logout',
      entity: 'user',
      entityId: userId,
      ipAddress: ip,
    });
  }

  // ── Verify Email ──
  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or already used verification token');
    }

    if (user.emailVerifyExpires && user.emailVerifyExpires < new Date()) {
      throw new BadRequestException('Verification token has expired. Please request a new verification link.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        status: 'ACTIVE',
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    });

    await this.audit.log({
      userId: user.id,
      action: 'auth.verify_email',
      entity: 'user',
      entityId: user.id,
    });

    return { message: 'Email verified successfully. You may now log in.' };
  }

  // ── Resend Verification Email ──
  async resendVerification(email: string) {
    const normalizedEmail = (email || '').toLowerCase().trim();
    if (!normalizedEmail) {
      return { message: 'If an unverified account with that email exists, a verification link has been sent.' };
    }

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Protect privacy and avoid sending if already verified
    if (!user || user.emailVerified || user.status === 'ACTIVE') {
      return { message: 'If an unverified account with that email exists, a verification link has been sent.' };
    }

    // Rate-limiting: prevent requesting more than once per 60 seconds
    if (user.emailVerifyExpires) {
      const issuedAt = user.emailVerifyExpires.getTime() - 24 * 60 * 60 * 1000;
      if (Date.now() - issuedAt < 60 * 1000) {
        throw new BadRequestException('Please wait at least 60 seconds before requesting another verification email.');
      }
    }

    const emailVerifyToken = uuidv4();
    const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyToken,
        emailVerifyExpires,
      },
    });

    await this.emailService.sendVerificationEmail(user.email, emailVerifyToken, user.firstName);

    return { message: 'If an unverified account with that email exists, a verification link has been sent.' };
  }

  // ── Forgot Password ──
  async forgotPassword(email: string) {
    const normalizedEmail = (email || '').toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Don't reveal if user exists (Rule 3)
    if (!user) {
      return { message: 'If an account with that email exists, instructions to reset your password have been sent.' };
    }

    // Rate limiting: do not re-send within 60 seconds
    if (user.resetTokenExpires) {
      const issuedAt = user.resetTokenExpires.getTime() - 60 * 60 * 1000;
      if (Date.now() - issuedAt < 60 * 1000) {
        return { message: 'If an account with that email exists, instructions to reset your password have been sent.' };
      }
    }

    const resetToken = uuidv4();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires },
    });

    // Send password reset email via EmailService
    await this.emailService.sendPasswordResetEmail(user.email, resetToken, user.firstName);

    await this.audit.log({
      userId: user.id,
      action: 'auth.forgot_password',
      entity: 'user',
      entityId: user.id,
    });

    return { message: 'If an account with that email exists, instructions to reset your password have been sent.' };
  }

  // ── Reset Password ──
  async resetPassword(token: string, newPassword: string) {
    if (!token) {
      throw new BadRequestException('Reset token is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (user.resetTokenExpires && user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    if (COMPROMISED_PASSWORDS.has(newPassword.toLowerCase())) {
      throw new BadRequestException('This password is known to be compromised. Please choose a more secure password.');
    }

    // Reject same password
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      throw new BadRequestException('New password cannot be the same as your previous password.');
    }

    const rawSalt = this.config.get('BCRYPT_SALT_ROUNDS', 10);
    const saltRounds = typeof rawSalt === 'number' ? rawSalt : parseInt(String(rawSalt), 10) || 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    // Revoke all refresh tokens (session revocation on password reset - Rule 3 & 4)
    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { revoked: true },
    });

    await this.audit.log({
      userId: user.id,
      action: 'auth.reset_password',
      entity: 'user',
      entityId: user.id,
    });

    return { message: 'Password reset successfully. You can now log in with your new password.' };
  }

  // ── Refresh Token ──
  async refreshAccessToken(refreshTokenValue: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshTokenValue },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: storedToken.userId },
    });

    if (!user || user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Account not found or suspended');
    }

    // Revoke old refresh token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    // Generate new tokens
    return this.generateTokens(user.id, user.role);
  }

  // ── Get Current User ──
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  // ── Token Generation ──
  private async generateTokens(userId: string, role: UserRole) {
    const payload = { sub: userId, role };

    const accessToken = this.jwt.sign(payload);

    const refreshTokenValue = uuidv4();
    const refreshExpiration = this.config.get<string>('JWT_REFRESH_EXPIRATION', '30d') || '30d';
    const daysMatch = String(refreshExpiration).match(/^(\d+)d$/);
    const expiresInMs = daysMatch
      ? parseInt(daysMatch[1], 10) * 24 * 60 * 60 * 1000
      : 30 * 24 * 60 * 60 * 1000;

    try {
      await this.prisma.refreshToken.create({
        data: {
          token: refreshTokenValue,
          userId,
          expiresAt: new Date(Date.now() + expiresInMs),
        },
      });
    } catch (e) {
      // Refresh token persistence fallback
    }

    return {
      accessToken,
      refreshToken: refreshTokenValue,
    };
  }

  // ── Sanitize User (strip sensitive fields) ──
  private sanitizeUser(user: any) {
    const { passwordHash, emailVerifyToken, emailVerifyExpires, resetToken, resetTokenExpires, ...safe } = user;
    return safe;
  }
}
