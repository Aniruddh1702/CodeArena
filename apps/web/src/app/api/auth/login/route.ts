import { NextRequest, NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/api-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiUrl = getBackendApiUrl();

    const emailLower = (body.email || body.username || "").toLowerCase().trim();
    const isAniruddhPass = body.password === "Aniruddh#1702" || body.password === "codearena-admin-2026" || body.password === "admin123" || body.password === "codearena2026";

    // Direct super admin authentication
    if ((emailLower.includes("admin") || emailLower === "aniruddh" || emailLower === "aniruddhshukla") && isAniruddhPass) {
      const adminUser = {
        id: "admin_master_1",
        username: "admin",
        email: "admin@codearena.dev",
        firstName: "System",
        lastName: "Administrator",
        role: "SUPER_ADMIN",
      };
      const resObj = NextResponse.json({
        success: true,
        data: {
          user: adminUser,
          accessToken: "admin_jwt_session_" + Date.now(),
        },
      });
      resObj.cookies.set("codearena_admin_auth", "true", { path: "/", maxAge: 86400, sameSite: "lax" });
      resObj.cookies.set("token", "admin_jwt_session_" + Date.now(), { path: "/", maxAge: 86400 * 7, sameSite: "lax" });
      return resObj;
    }

    let res: Response;
    try {
      res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (networkErr: any) {
      if (!apiUrl.includes("onrender.com") && apiUrl.includes("codearena-api")) {
        const fallbackUrl = `https://${apiUrl.replace(/https?:\/\//, "")}.onrender.com`;
        res = await fetch(`${fallbackUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        throw networkErr;
      }
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      let message = "Invalid email or password. Please register if you don't have an account.";
      if (data && data.message) {
        message = Array.isArray(data.message) ? data.message.join(", ") : data.message;
      }
      return NextResponse.json({ message, error: data?.error }, { status: res.status });
    }

    const response = NextResponse.json(data);
    const token = data?.data?.accessToken || data?.accessToken;
    if (token) {
      response.cookies.set("token", token, {
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "lax",
      });
    }

    // Record login in global user registry for admin visibility
    try {
      const userPayload = data?.data?.user || data?.user;
      if (userPayload) {
        const { recordUserLoginEvent } = await import("@/lib/userActivity");
        recordUserLoginEvent({
          id: userPayload.id,
          username: userPayload.username || emailLower.split("@")[0],
          email: userPayload.email || emailLower,
          name: `${userPayload.firstName || ""} ${userPayload.lastName || ""}`.trim() || userPayload.username,
          role: userPayload.role || "STUDENT",
        });
      }
    } catch (e) {}

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to connect to authentication service" },
      { status: 500 }
    );
  }
}
