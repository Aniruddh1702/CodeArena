import { NextRequest, NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/api-config";
import { verifyAndConsumeResetToken, getUserRegistry } from "@/lib/userActivity";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and new password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const apiUrl = getBackendApiUrl();
    let backendRes: Response | null = null;
    let backendData: any = null;

    try {
      backendRes = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      backendData = await backendRes.json().catch(() => null);
    } catch (e) {
      // Backend offline or cold start
    }

    // Try local token consumption and user password update
    const localResult = verifyAndConsumeResetToken(token, password);

    if ((backendRes && backendRes.ok) || localResult.success) {
      return NextResponse.json({
        success: true,
        message: "Your password has been successfully reset. You can now log in with your new password.",
      });
    }

    let errMsg = "Invalid or expired password reset token.";
    if (backendData?.message) {
      errMsg = Array.isArray(backendData.message) ? backendData.message.join(", ") : backendData.message;
    }

    return NextResponse.json(
      { message: errMsg },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to reset password." },
      { status: 500 }
    );
  }
}
