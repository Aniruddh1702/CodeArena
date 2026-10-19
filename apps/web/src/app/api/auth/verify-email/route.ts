import { NextRequest, NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/api-config";
import { getUserRegistry } from "@/lib/userActivity";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = body.token || req.nextUrl.searchParams.get("token") || "";

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required." },
        { status: 400 }
      );
    }

    const apiUrl = getBackendApiUrl();
    let backendRes: Response | null = null;
    let backendData: any = null;

    try {
      backendRes = await fetch(`${apiUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      backendData = await backendRes.json().catch(() => null);
    } catch (e) {
      // Backend offline or cold start
    }

    if (backendRes && backendRes.ok) {
      return NextResponse.json({
        success: true,
        message: backendData?.message || "Email verified successfully. You can now log in.",
      });
    }

    // Check if token matches local registry
    const registry = getUserRegistry();
    let localVerified = false;

    for (const [key, user] of Array.from(registry.entries())) {
      if ((user as any).emailVerifyToken === token) {
        (user as any).emailVerified = true;
        (user as any).status = "ACTIVE";
        delete (user as any).emailVerifyToken;
        localVerified = true;
      }
    }

    if (localVerified) {
      return NextResponse.json({
        success: true,
        message: "Email verified successfully! You can now log in with your credentials.",
      });
    }

    let errMsg = "Invalid or expired verification token.";
    if (backendData?.message) {
      errMsg = Array.isArray(backendData.message) ? backendData.message.join(", ") : backendData.message;
    }

    return NextResponse.json(
      { message: errMsg },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to verify email." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
