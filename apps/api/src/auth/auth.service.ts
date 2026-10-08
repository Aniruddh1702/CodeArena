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
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private audit: AuditService,
  ) {}

  // ── Register (Students only via public registration) ──
  async register(dto: RegisterDto, ip?: string, userAgent?: string) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const normalizedUsername = dto.username.trim();

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

    // Generate email verification token
    const emailVerifyToken = uuidv4();
    const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Create user (always STUDENT for public registration, ACTIVE status)
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        passwordHash,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        role: UserRole.STUDENT,
        status: 'ACTIVE',
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

    // Audit log
    await this.audit.log({
      userId: user.id,
      action: 'auth.register',
      entity: 'user',
      entityId: user.id,
      ipAddress: ip,
      userAgent,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
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
    const user = await this.prisma.user.findUnique({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.emailVerifyExpires && user.emailVerifyExpires < new Date()) {
      throw new BadRequestException('Verification token has expired');
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

    return { message: 'Email verified successfully' };
  }

  // ── Forgot Password ──
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists
    if (!user) {
      return { message: 'If an account with that email exists, a reset link has been sent.' };
    }

    const resetToken = uuidv4();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires },
    });

    // TODO: Send reset email via email provider
    if (this.config.get('EMAIL_PROVIDER') === 'console') {
      console.log(`\n📧 Password reset for ${email}:`);
      console.log(`   Token: ${resetToken}`);
      console.log(`   URL: ${this.config.get('WEB_URL')}/reset-password?token=${resetToken}\n`);
    }

    await this.audit.log({
      userId: user.id,
      action: 'auth.forgot_password',
      entity: 'user',
      entityId: user.id,
    });

    return { message: 'If an account with that email exists, a reset link has been sent.' };
  }

  // ── Reset Password ──
  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    if (user.resetTokenExpires && user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    const saltRounds = this.config.get<number>('BCRYPT_SALT_ROUNDS', 12);
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    // Revoke all refresh tokens
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

    return { message: 'Password reset successfully' };
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
