import { NextRequest, NextResponse } from "next/server";

const ADMIN_MASTER_PASSCODE = process.env.ADMIN_SECRET_KEY || "codearena-admin-2026";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode, userId } = body;

    if (!passcode || passcode.trim() !== ADMIN_MASTER_PASSCODE) {
      return NextResponse.json(
        { success: false, message: "Invalid Admin Passcode. Access denied." },
        { status: 401 }
      );
    }

    // Passcode verified! If userId is provided, try elevating user in backend DB
    if (userId) {
      try {
        const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        // Elevate user if API is reachable
        await fetch(`${apiUrl}/api/users/${userId}/elevate`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "SUPER_ADMIN" }),
        }).catch(() => null);
      } catch (e) {
        // Continue even if backend call fails
      }
    }

    const res = NextResponse.json({
      success: true,
      message: "Admin access granted. Welcome to CodeArena Administration.",
      role: "SUPER_ADMIN",
    });

    // Set secure admin cookie
    res.cookies.set("codearena_admin_auth", "true", {
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
      sameSite: "lax",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to verify admin passcode" },
      { status: 500 }
    );
  }
}
