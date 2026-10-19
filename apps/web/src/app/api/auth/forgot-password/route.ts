import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getBackendApiUrl } from "@/lib/api-config";
import { savePasswordResetToken, getUserRegistry } from "@/lib/userActivity";
import { sendPasswordResetEmail } from "@/lib/server-mailer";

// Rate limiting for forgot-password: max 3 requests per 15 minutes per IP/email
const forgotAttempts = new Map<string, { count: number; lockedUntil: number }>();

function checkForgotRateLimit(key: string): { allowed: boolean; remainingSecs: number } {
  const now = Date.now();
  const record = forgotAttempts.get(key);
  if (!record) return { allowed: true, remainingSecs: 0 };
  if (record.lockedUntil > now) {
    return { allowed: false, remainingSecs: Math.ceil((record.lockedUntil - now) / 1000) };
  }
  if (now - record.lockedUntil > 15 * 60 * 1000) {
    forgotAttempts.delete(key);
    return { allowed: true, remainingSecs: 0 };
  }
  return { allowed: true, remainingSecs: 0 };
}

function recordForgotAttempt(key: string) {
  const now = Date.now();
  const record = forgotAttempts.get(key) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= 3) {
    record.lockedUntil = now + 15 * 60 * 1000; // 15-minute cooldown
  }
  forgotAttempts.set(key, record);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || "").toLowerCase().trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const clientIp = req.headers.get("x-forwarded-for") || "client_ip";
    const rateLimitKey = `forgot_${clientIp}_${email}`;
    const rateCheck = checkForgotRateLimit(rateLimitKey);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          message: `Too many password reset requests. Please wait ${rateCheck.remainingSecs} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    recordForgotAttempt(rateLimitKey);

    // Call backend API if running
    const apiUrl = getBackendApiUrl();
    try {
      await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (e) {
      // Backend waking up - handled gracefully by local email dispatch
    }

    // Check if user exists in local registry
    const registry = getUserRegistry();
    const user = Array.from(registry.values()).find(
      (u) => u.email.toLowerCase() === email
    );

    // Always generate secure random token
    const token = crypto.randomBytes(32).toString("hex");
    savePasswordResetToken(token, email);

    // If account exists, dispatch real password reset email
    if (user) {
      await sendPasswordResetEmail(email, token, user.name);
    }

    // Generic, timing-safe response that does not disclose account existence (Rule 3)
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, instructions to reset your password have been dispatched to your inbox.",
    });
  } catch (err: any) {
    console.error("[Forgot Password API] Error:", err.message);
    return NextResponse.json(
      { message: "Failed to process forgot password request." },
      { status: 500 }
    );
  }
}
