import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { signAdminToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { passcode, userId } = body;

    const trimmed = (passcode || "").trim();
    if (!trimmed) {
      return NextResponse.json(
        { success: false, message: "Admin passcode is required." },
        { status: 400 }
      );
    }

    // Verify passcode against configured ADMIN_SECRET_KEY or ADMIN_PASSCODE
    const configuredKey = (process.env.ADMIN_PASSCODE || process.env.ADMIN_SECRET_KEY || "").trim();
    if (!configuredKey) {
      return NextResponse.json(
        { success: false, message: "Admin authentication is disabled because ADMIN_SECRET_KEY is not configured on the server." },
        { status: 503 }
      );
    }
    const isMasterPass = crypto.timingSafeEqual(
      Buffer.from(trimmed.padEnd(64, "0")),
      Buffer.from(configuredKey.padEnd(64, "0"))
    ) && trimmed === configuredKey;

    if (!isMasterPass) {
      return NextResponse.json(
        { success: false, message: "Invalid Admin Passcode. Access denied." },
        { status: 401 }
      );
    }

    // Passcode verified! Elevate user in backend DB if userId provided
    if (userId) {
      try {
        const { getBackendApiUrl } = await import("@/lib/api-config");
        const apiUrl = getBackendApiUrl();
        await fetch(`${apiUrl}/api/users/${userId}/elevate`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "SUPER_ADMIN" }),
        }).catch(() => null);
      } catch (e) {}
    }

    const adminToken = signAdminToken();

    const res = NextResponse.json({
      success: true,
      message: "Admin access verified and authenticated.",
      role: "SUPER_ADMIN",
      adminToken,
    });

    // Set signed, secure HTTP-only admin cookie
    res.cookies.set("codearena_admin_token", adminToken, {
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Also set client compatibility cookie
    res.cookies.set("codearena_admin_auth", "true", {
      path: "/",
      maxAge: 24 * 60 * 60,
      sameSite: "lax",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to verify admin credentials" },
      { status: 500 }
    );
  }
}
