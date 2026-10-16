import { NextRequest, NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/api-config";

export async function GET(req: NextRequest) {
  try {
    const apiUrl = getBackendApiUrl();

    // Extract authorization header or token cookie
    let authHeader = req.headers.get("authorization");
    if (!authHeader) {
      const token = req.cookies.get("token")?.value;
      if (token) {
        authHeader = `Bearer ${token}`;
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${apiUrl}/api/analytics/student-dashboard`, {
      method: "GET",
      headers,
      signal: controller.signal,
      cache: "no-store",
    }).finally(() => clearTimeout(timeoutId));

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to fetch analytics" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    const isTimeout = err.name === "AbortError";
    return NextResponse.json(
      {
        message: isTimeout
          ? "Analytics service timed out (cold start in progress)"
          : err.message || "Failed to connect to analytics service",
        data: null,
      },
      { status: isTimeout ? 504 : 503 }
    );
  }
}
