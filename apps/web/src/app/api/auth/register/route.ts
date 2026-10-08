import { NextRequest, NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/api-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiUrl = getBackendApiUrl();

    let res: Response;
    try {
      res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (networkErr: any) {
      // If primary API url fails with network error, try standard Render public domain
      if (!apiUrl.includes("onrender.com") && apiUrl.includes("codearena-api")) {
        const fallbackUrl = `https://${apiUrl.replace(/https?:\/\//, "")}.onrender.com`;
        res = await fetch(`${fallbackUrl}/api/auth/register`, {
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
      let message = "Registration failed";
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

    // Record registration in global user registry for admin visibility
    try {
      const userPayload = data?.data?.user || data?.user;
      const { recordUserLoginEvent } = await import("@/lib/userActivity");
      recordUserLoginEvent({
        id: userPayload?.id,
        username: userPayload?.username || body.username || body.email?.split("@")[0],
        email: userPayload?.email || body.email,
        name: `${userPayload?.firstName || body.firstName || ""} ${userPayload?.lastName || body.lastName || ""}`.trim() || body.username,
        role: userPayload?.role || "STUDENT",
        college: body.college,
      });
    } catch (e) {}

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to connect to authentication service" },
      { status: 500 }
    );
  }
}
