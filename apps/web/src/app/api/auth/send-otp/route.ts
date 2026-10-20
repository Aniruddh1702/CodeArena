import { NextRequest, NextResponse } from "next/server";
import { createOtp } from "@/lib/otp-store";
import { sendOtpEmail } from "@/lib/server-mailer";
import { getUserRegistry } from "@/lib/userActivity";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
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

    // Generate cryptographically secure OTP
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

    // Send the email directly via Nodemailer / Gmail SMTP
    const emailRes = await sendOtpEmail({
      recipient: email,
      otp: otpRes.code,
      firstName,
    });

    if (!emailRes.success && !emailRes.demoMode) {
      return NextResponse.json(
        {
          success: false,
          message: emailRes.message || "Failed to dispatch email. Please check your email address and try again.",
        },
        { status: 500 }
      );
    }

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
    console.error("[Send OTP API] Unexpected error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to process verification code." },
      { status: 500 }
    );
  }
}
