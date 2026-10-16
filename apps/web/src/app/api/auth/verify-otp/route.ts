import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || "").toLowerCase().trim();
    const otp = (body.otp || "").toString().trim();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and verification OTP are required." },
        { status: 400 }
      );
    }

    const result = verifyOtp(email, otp);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: result.message,
          attemptsRemaining: result.attemptsRemaining,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Email verified successfully. You may now complete account registration.",
    });
  } catch (err: any) {
    console.error("[Verify OTP API] Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to verify code." },
      { status: 500 }
    );
  }
}
