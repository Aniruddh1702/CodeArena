import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const res = await fetch(`${apiUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

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

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to connect to authentication service" },
      { status: 500 }
    );
  }
}
