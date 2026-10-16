import crypto from "crypto";

export interface OtpRecord {
  code: string;
  email: string;
  firstName?: string;
  expiresAt: number; // timestamp in ms
  createdAt: number;
  attempts: number;
  verified: boolean;
  verifiedAt?: number;
}

// Global in-memory registry preserved across Next.js API requests
declare global {
  var __codearena_otp_store: Map<string, OtpRecord> | undefined;
}

function getStore(): Map<string, OtpRecord> {
  if (!global.__codearena_otp_store) {
    global.__codearena_otp_store = new Map<string, OtpRecord>();
  }
  return global.__codearena_otp_store;
}

const OTP_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
const MAX_VERIFICATION_ATTEMPTS = 5;

/**
 * Generates a cryptographically strong 6-digit numeric OTP code.
 */
export function generateOtpCode(): string {
  const num = crypto.randomInt(100000, 999999);
  return num.toString();
}

/**
 * Creates and stores a new OTP for an email address.
 */
export function createOtp(email: string, firstName?: string): {
  success: boolean;
  code: string;
  expiresAt: number;
  message?: string;
  cooldownRemaining?: number;
} {
  const cleanEmail = email.toLowerCase().trim();
  const store = getStore();

  const existing = store.get(cleanEmail);
  const now = Date.now();

  // Enforce resend cooldown if an active OTP was just sent
  if (existing && existing.createdAt && now - existing.createdAt < RESEND_COOLDOWN_MS) {
    const cooldownRemaining = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.createdAt)) / 1000);
    return {
      success: false,
      code: existing.code,
      expiresAt: existing.expiresAt,
      message: `Please wait ${cooldownRemaining}s before requesting a new verification code.`,
      cooldownRemaining,
    };
  }

  const code = generateOtpCode();
  const expiresAt = now + OTP_EXPIRATION_MS;

  const record: OtpRecord = {
    code,
    email: cleanEmail,
    firstName: firstName || "",
    expiresAt,
    createdAt: now,
    attempts: 0,
    verified: false,
  };

  store.set(cleanEmail, record);

  return {
    success: true,
    code,
    expiresAt,
  };
}

/**
 * Verifies a submitted OTP against the stored record for that email.
 */
export function verifyOtp(email: string, submittedCode: string): {
  success: boolean;
  message: string;
  attemptsRemaining?: number;
} {
  const cleanEmail = email.toLowerCase().trim();
  const cleanCode = (submittedCode || "").trim().replace(/\D/g, "");
  const store = getStore();

  const record = store.get(cleanEmail);
  const now = Date.now();

  if (!record) {
    return {
      success: false,
      message: "No verification code was requested for this email. Please click 'Send Code'.",
    };
  }

  if (now > record.expiresAt) {
    store.delete(cleanEmail);
    return {
      success: false,
      message: "Verification code has expired. Please request a new code.",
    };
  }

  if (record.attempts >= MAX_VERIFICATION_ATTEMPTS) {
    store.delete(cleanEmail);
    return {
      success: false,
      message: "Too many failed attempts. Please request a fresh verification code.",
    };
  }

  record.attempts++;

  if (record.code !== cleanCode) {
    const remaining = MAX_VERIFICATION_ATTEMPTS - record.attempts;
    return {
      success: false,
      message: `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
      attemptsRemaining: remaining,
    };
  }

  // Code is valid! Mark verified
  record.verified = true;
  record.verifiedAt = now;

  return {
    success: true,
    message: "Email successfully verified!",
  };
}

/**
 * Checks if an email is marked as verified (valid for 15 minutes after verification).
 */
export function isEmailVerified(email: string): boolean {
  const cleanEmail = email.toLowerCase().trim();
  const store = getStore();
  const record = store.get(cleanEmail);

  if (!record || !record.verified || !record.verifiedAt) {
    return false;
  }

  // Verification proof valid for 15 minutes
  if (Date.now() - record.verifiedAt > 15 * 60 * 1000) {
    store.delete(cleanEmail);
    return false;
  }

  return true;
}

/**
 * Consumes the verified status after successful account registration.
 */
export function consumeVerifiedEmail(email: string): void {
  const cleanEmail = email.toLowerCase().trim();
  const store = getStore();
  store.delete(cleanEmail);
}

/**
 * Returns active OTP record if needed for development/demo helper.
 */
export function getActiveOtp(email: string): OtpRecord | null {
  const cleanEmail = email.toLowerCase().trim();
  const store = getStore();
  const record = store.get(cleanEmail);
  if (!record || Date.now() > record.expiresAt) return null;
  return record;
}
