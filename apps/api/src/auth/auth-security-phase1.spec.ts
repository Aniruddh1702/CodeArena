import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuditService } from '../audit/audit.service';
import { EmailService } from '../email/email.service';
import {
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

describe('Auth Security Phase 1 — Specification & Verification Suite', () => {
  let authService: AuthService;
  let mockPrisma: any;
  let mockJwt: any;
  let mockConfig: any;
  let mockAudit: any;
  let mockEmailService: any;

  // Mock in-memory user table
  let usersDb: Map<string, any>;
  let refreshTokensDb: Map<string, any>;

  beforeEach(async () => {
    usersDb = new Map();
    refreshTokensDb = new Map();

    mockPrisma = {
      user: {
        findUnique: jest.fn(async ({ where }: any) => {
          if (where.email) {
            for (const u of usersDb.values()) {
              if (u.email.toLowerCase() === where.email.toLowerCase()) return { ...u };
            }
          }
          if (where.username) {
            for (const u of usersDb.values()) {
              if (u.username.toLowerCase() === where.username.toLowerCase()) return { ...u };
            }
          }
          if (where.id) {
            return usersDb.get(where.id) ? { ...usersDb.get(where.id) } : null;
          }
          if (where.emailVerifyToken) {
            for (const u of usersDb.values()) {
              if (u.emailVerifyToken === where.emailVerifyToken) return { ...u };
            }
          }
          if (where.resetToken) {
            for (const u of usersDb.values()) {
              if (u.resetToken === where.resetToken) return { ...u };
            }
          }
          return null;
        }),
        findFirst: jest.fn(async ({ where }: any) => {
          if (where.OR) {
            for (const cond of where.OR) {
              if (cond.email) {
                for (const u of usersDb.values()) {
                  if (u.email.toLowerCase() === cond.email.toLowerCase()) return { ...u };
                }
              }
              if (cond.username) {
                for (const u of usersDb.values()) {
                  if (u.username.toLowerCase() === cond.username.toLowerCase()) return { ...u };
                }
              }
            }
          }
          return null;
        }),
        create: jest.fn(async ({ data }: any) => {
          const id = `usr_${Date.now()}_${Math.random()}`;
          const record = { id, createdAt: new Date(), updatedAt: new Date(), ...data };
          usersDb.set(id, record);
          return { ...record };
        }),
        update: jest.fn(async ({ where, data }: any) => {
          const user = usersDb.get(where.id);
          if (!user) throw new Error('User not found');
          const updated = { ...user, ...data, updatedAt: new Date() };
          usersDb.set(where.id, updated);
          return { ...updated };
        }),
      },
      rating: {
        create: jest.fn().mockResolvedValue({ id: 'rating-1' }),
      },
      refreshToken: {
        create: jest.fn(async ({ data }: any) => {
          const id = `ref_${Date.now()}_${Math.random()}`;
          const record = { id, ...data };
          refreshTokensDb.set(data.token, record);
          return record;
        }),
        findUnique: jest.fn(async ({ where }: any) => {
          return refreshTokensDb.get(where.token) || null;
        }),
        update: jest.fn(async ({ where, data }: any) => {
          for (const [t, record] of refreshTokensDb.entries()) {
            if (record.id === where.id) {
              const updated = { ...record, ...data };
              refreshTokensDb.set(t, updated);
              return updated;
            }
          }
          return null;
        }),
        updateMany: jest.fn(async ({ where, data }: any) => {
          let count = 0;
          for (const [t, record] of refreshTokensDb.entries()) {
            if (record.userId === where.userId) {
              record.revoked = data.revoked ?? true;
              count++;
            }
          }
          return { count };
        }),
      },
    };

    mockJwt = {
      sign: jest.fn().mockReturnValue('mocked.jwt.access_token'),
    };

    mockConfig = {
      get: jest.fn((key: string, defaultValue?: any) => {
        if (key === 'BCRYPT_SALT_ROUNDS') return 10;
        if (key === 'JWT_REFRESH_EXPIRATION') return '30d';
        if (key === 'WEB_URL') return 'https://codearena.dev';
        return defaultValue;
      }),
    };

    mockAudit = {
      log: jest.fn().mockResolvedValue(true),
    };

    // MOCKED EMAIL DELIVERY: We clearly mock the email provider transport for automated verification
    mockEmailService = {
      isConfigured: jest.fn().mockReturnValue(true),
      sendVerificationEmail: jest.fn().mockResolvedValue({ success: true, delivered: true, messageId: 'msg_1' }),
      sendPasswordResetEmail: jest.fn().mockResolvedValue({ success: true, delivered: true, messageId: 'msg_2' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
        { provide: AuditService, useValue: mockAudit },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  // ─────────────────────────────────────────────
  // 1. REGISTRATION & EMAIL VERIFICATION
  // ─────────────────────────────────────────────
  describe('Feature 1: Registration and Verification Workflow', () => {
    it('should register student with PENDING_VERIFICATION and dispatch verification email without session tokens', async () => {
      const res = await authService.register({
        email: 'alice@example.com',
        username: 'alice_coder',
        password: 'ValidSecurePass@2026',
        firstName: 'Alice',
        lastName: 'Smith',
      });

      expect(res.user.email).toBe('alice@example.com');
      expect(res.user.role).toBe(UserRole.STUDENT);
      expect(res.emailVerified).toBe(false);
      // Critical Rule 1: No access token or refresh token on unverified registration
      expect((res as any).accessToken).toBeUndefined();
      expect((res as any).refreshToken).toBeUndefined();

      // Email service dispatched
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
        'alice@example.com',
        expect.any(String),
        'Alice',
      );
    });

    it('should reject duplicate email registration with ConflictException', async () => {
      await authService.register({
        email: 'bob@example.com',
        username: 'bob1',
        password: 'ValidSecurePass@2026',
        firstName: 'Bob',
        lastName: 'A',
      });

      await expect(
        authService.register({
          email: 'bob@example.com',
          username: 'bob2',
          password: 'ValidSecurePass@2026',
          firstName: 'Bob',
          lastName: 'B',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should reject duplicate username registration with ConflictException', async () => {
      await authService.register({
        email: 'user1@example.com',
        username: 'unique_coder',
        password: 'ValidSecurePass@2026',
        firstName: 'User',
        lastName: 'One',
      });

      await expect(
        authService.register({
          email: 'user2@example.com',
          username: 'unique_coder',
          password: 'ValidSecurePass@2026',
          firstName: 'User',
          lastName: 'Two',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should reject known compromised passwords', async () => {
      await expect(
        authService.register({
          email: 'weak@example.com',
          username: 'weak_user',
          password: 'password123',
          firstName: 'Weak',
          lastName: 'Pass',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully verify email and transition account status to ACTIVE', async () => {
      await authService.register({
        email: 'charlie@example.com',
        username: 'charlie',
        password: 'ValidSecurePass@2026',
        firstName: 'Charlie',
        lastName: 'C',
      });

      const token = mockEmailService.sendVerificationEmail.mock.calls[0][1];
      const verifyRes = await authService.verifyEmail(token);

      expect(verifyRes.message).toContain('Email verified successfully');

      // Verify DB record updated
      const user = await mockPrisma.user.findUnique({ where: { email: 'charlie@example.com' } });
      expect(user.emailVerified).toBe(true);
      expect(user.status).toBe('ACTIVE');
      expect(user.emailVerifyToken).toBeNull();
    });

    it('should reject expired verification tokens', async () => {
      const expiredDate = new Date(Date.now() - 1000 * 60);
      usersDb.set('usr-expired', {
        id: 'usr-expired',
        email: 'expired@test.com',
        emailVerifyToken: 'expired-token-123',
        emailVerifyExpires: expiredDate,
        emailVerified: false,
        status: 'PENDING_VERIFICATION',
      });

      await expect(authService.verifyEmail('expired-token-123')).rejects.toThrow(BadRequestException);
    });

    it('should reject reused or nonexistent verification tokens', async () => {
      await expect(authService.verifyEmail('already-used-or-fake-token')).rejects.toThrow(BadRequestException);
    });

    it('should enforce 60s cooldown on resending verification email', async () => {
      // Create user with recent verification request
      usersDb.set('usr-recent', {
        id: 'usr-recent',
        email: 'recent@test.com',
        emailVerified: false,
        status: 'PENDING_VERIFICATION',
        emailVerifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Issued right now
      });

      await expect(authService.resendVerification('recent@test.com')).rejects.toThrow(BadRequestException);
    });
  });

  // ─────────────────────────────────────────────
  // 2. SECURE LOGIN & CREDENTIAL VERIFICATION
  // ─────────────────────────────────────────────
  describe('Feature 2: Secure Login Verification', () => {
    beforeEach(async () => {
      const passwordHash = await bcrypt.hash('CorrectPassword@2026', 10);
      usersDb.set('verified-user', {
        id: 'verified-user',
        email: 'student@example.com',
        username: 'student_pro',
        passwordHash,
        role: UserRole.STUDENT,
        status: 'ACTIVE',
        emailVerified: true,
      });

      usersDb.set('unverified-user', {
        id: 'unverified-user',
        email: 'unverified@example.com',
        username: 'unverified_kid',
        passwordHash,
        role: UserRole.STUDENT,
        status: 'PENDING_VERIFICATION',
        emailVerified: false,
      });
    });

    it('should successfully log in with valid credentials on a verified account', async () => {
      const res = await authService.login({
        email: 'student@example.com',
        password: 'CorrectPassword@2026',
      });

      expect(res.user.email).toBe('student@example.com');
      expect(res.accessToken).toBe('mocked.jwt.access_token');
      expect(res.refreshToken).toBeDefined();
    });

    it('should reject nonexistent accounts with generic UnauthorizedException', async () => {
      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'CorrectPassword@2026',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject incorrect passwords with generic UnauthorizedException', async () => {
      await expect(
        authService.login({
          email: 'student@example.com',
          password: 'WrongPassword123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should strictly reject login for unverified accounts', async () => {
      await expect(
        authService.login({
          email: 'unverified@example.com',
          password: 'CorrectPassword@2026',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject suspended accounts', async () => {
      const passwordHash = await bcrypt.hash('CorrectPassword@2026', 10);
      usersDb.set('suspended-user', {
        id: 'suspended-user',
        email: 'suspended@example.com',
        username: 'suspended_user',
        passwordHash,
        role: UserRole.STUDENT,
        status: 'SUSPENDED',
        emailVerified: true,
      });

      await expect(
        authService.login({
          email: 'suspended@example.com',
          password: 'CorrectPassword@2026',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─────────────────────────────────────────────
  // 3. FORGOT PASSWORD & PASSWORD RESET
  // ─────────────────────────────────────────────
  describe('Feature 3: Forgot Password & Password Reset Flow', () => {
    let oldPasswordHash: string;

    beforeEach(async () => {
      oldPasswordHash = await bcrypt.hash('OldPassword@123', 10);
      usersDb.set('user-reset', {
        id: 'user-reset',
        email: 'resetme@example.com',
        username: 'resetme',
        firstName: 'ResetUser',
        passwordHash: oldPasswordHash,
        role: UserRole.STUDENT,
        status: 'ACTIVE',
        emailVerified: true,
      });
    });

    it('should process forgot password and send reset email without disclosing account existence', async () => {
      const res = await authService.forgotPassword('resetme@example.com');
      expect(res.message).toContain('If an account with that email exists');

      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'resetme@example.com',
        expect.any(String),
        expect.anything(),
      );

      // Verify nonexistent email returns identical message (timing-safe privacy)
      const nonExistentRes = await authService.forgotPassword('nobody@example.com');
      expect(nonExistentRes.message).toBe(res.message);
    });

    it('should reset password with valid token and revoke all active sessions', async () => {
      await authService.forgotPassword('resetme@example.com');
      const resetToken = mockEmailService.sendPasswordResetEmail.mock.calls[0][1];

      // Add a mock active refresh token
      refreshTokensDb.set('active-refresh-token', {
        id: 'ref-1',
        token: 'active-refresh-token',
        userId: 'user-reset',
        revoked: false,
        expiresAt: new Date(Date.now() + 100000),
      });

      const resetRes = await authService.resetPassword(resetToken, 'NewBrandSecurePass@2026');
      expect(resetRes.message).toContain('Password reset successfully');

      // Verify sessions revoked
      const refToken = refreshTokensDb.get('active-refresh-token');
      expect(refToken.revoked).toBe(true);

      // Verify old password is now rejected
      await expect(
        authService.login({ email: 'resetme@example.com', password: 'OldPassword@123' }),
      ).rejects.toThrow(UnauthorizedException);

      // Verify new password is now accepted
      const loginRes = await authService.login({
        email: 'resetme@example.com',
        password: 'NewBrandSecurePass@2026',
      });
      expect(loginRes.accessToken).toBeDefined();
    });

    it('should reject reused reset tokens', async () => {
      await authService.forgotPassword('resetme@example.com');
      const resetToken = mockEmailService.sendPasswordResetEmail.mock.calls[0][1];

      // First reset succeeds
      await authService.resetPassword(resetToken, 'NewBrandPass@2026_1');

      // Second reset with same token fails immediately (single-use token enforcement)
      await expect(
        authService.resetPassword(resetToken, 'NewBrandPass@2026_2'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject setting the exact same password on reset', async () => {
      await authService.forgotPassword('resetme@example.com');
      const resetToken = mockEmailService.sendPasswordResetEmail.mock.calls[0][1];

      await expect(
        authService.resetPassword(resetToken, 'OldPassword@123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─────────────────────────────────────────────
  // 4. SESSION MANAGEMENT & REFRESH TOKEN ROTATION
  // ─────────────────────────────────────────────
  describe('Feature 4: Session Management & Revocation', () => {
    it('should reject refresh when refresh token is revoked', async () => {
      refreshTokensDb.set('revoked-token', {
        id: 'ref-revoked',
        token: 'revoked-token',
        userId: 'user-1',
        revoked: true,
        expiresAt: new Date(Date.now() + 100000),
      });

      await expect(authService.refreshAccessToken('revoked-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should reject refresh when refresh token is expired', async () => {
      refreshTokensDb.set('expired-token', {
        id: 'ref-expired',
        token: 'expired-token',
        userId: 'user-1',
        revoked: false,
        expiresAt: new Date(Date.now() - 10000),
      });

      await expect(authService.refreshAccessToken('expired-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should preserve user role in JWT payload during session creation', async () => {
      usersDb.set('admin-user', {
        id: 'admin-user',
        email: 'admin@codearena.dev',
        username: 'superadmin',
        passwordHash: await bcrypt.hash('AdminPass@2026', 10),
        role: UserRole.SUPER_ADMIN,
        status: 'ACTIVE',
        emailVerified: true,
      });

      const res = await authService.login({
        email: 'admin@codearena.dev',
        password: 'AdminPass@2026',
      });

      expect(res.user.role).toBe(UserRole.SUPER_ADMIN);
      expect(mockJwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.SUPER_ADMIN }),
      );
    });
  });
});
