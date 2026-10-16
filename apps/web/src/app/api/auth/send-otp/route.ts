import { NextRequest, NextResponse } from "next/server";
import { createOtp } from "@/lib/otp-store";
import { sendOtpEmail } from "@/lib/server-mailer";
import { getUserRegistry } from "@/lib/userActivity";
import { getBackendApiUrl } from "@/lib/api-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || "").toLowerCase().trim();
    const firstName = (body.firstName || "").trim();
    const username = (body.username || "").trim().toLowerCase();

    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Check if email or username is already registered in local user registry
    const registry = getUserRegistry();
    const existingByEmail = Array.from(registry.values()).find(
      (u) => u.email.toLowerCase() === email
    );
    if (existingByEmail) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    if (username) {
      const existingByUsername = registry.get(username);
      if (existingByUsername) {
        return NextResponse.json(
          { success: false, message: "This username is already taken. Please choose another username." },
          { status: 409 }
        );
      }
    }

    // Also check with backend API if accessible
    try {
      const apiUrl = getBackendApiUrl();
      const checkRes = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username: username || "test_check", password: "Password123!" }),
      });
      const checkData = await checkRes.json().catch(() => null);
      if (checkRes.status === 409 || (checkData && checkData.message && String(checkData.message).toLowerCase().includes("already exists"))) {
        return NextResponse.json(
          { success: false, message: "An account with this email or username already exists. Please sign in instead." },
          { status: 409 }
        );
      }
    } catch (e) {
      // Backend check optional if waking up
    }

    // Create OTP
    const otpRes = createOtp(email, firstName);
    if (!otpRes.success) {
      return NextResponse.json(
        {
          success: false,
          message: otpRes.message || "Please wait before requesting another code.",
          cooldownRemaining: otpRes.cooldownRemaining,
        },
        { status: 429 }
      );
    }

    // Send the email via Nodemailer / Gmail SMTP
    const emailRes = await sendOtpEmail({
      recipient: email,
      otp: otpRes.code,
      firstName,
    });

    return NextResponse.json({
      success: true,
      message: emailRes.delivered
        ? `A 6-digit verification code has been dispatched to ${email}.`
        : `Verification code generated for ${email}.`,
      delivered: emailRes.delivered,
      demoMode: emailRes.demoMode,
      demoOtp: emailRes.demoMode ? otpRes.code : undefined,
      expiresAt: otpRes.expiresAt,
    });
  } catch (err: any) {
    console.error("[Send OTP API] Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to process verification code." },
      { status: 500 }
    );
  }
}
