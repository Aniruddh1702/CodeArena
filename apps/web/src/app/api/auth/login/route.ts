import { NextRequest, NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/api-config";
import { getUserRegistry, recordUserLoginEvent, verifyPassword } from "@/lib/userActivity";

// In-memory rate limiter for login brute force protection (5 failed attempts per 15 minutes)
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function checkRateLimit(identifier: string): { allowed: boolean; remainingSecs: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);
  if (!record) return { allowed: true, remainingSecs: 0 };
  if (record.lockedUntil > now) {
    return { allowed: false, remainingSecs: Math.ceil((record.lockedUntil - now) / 1000) };
  }
  if (now - record.lockedUntil > 15 * 60 * 1000) {
    loginAttempts.delete(identifier);
    return { allowed: true, remainingSecs: 0 };
  }
  return { allowed: true, remainingSecs: 0 };
}

function recordFailedAttempt(identifier: string) {
  const now = Date.now();
  const record = loginAttempts.get(identifier) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000; // Lock for 15 minutes
  }
  loginAttempts.set(identifier, record);
}

function clearFailedAttempts(identifier: string) {
  loginAttempts.delete(identifier);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const emailLower = (body.email || body.username || "").toLowerCase().trim();
    const password = body.password || "";

    if (!emailLower || !password) {
      return NextResponse.json(
        { message: "Email/username and password are required." },
        { status: 400 }
      );
    }

    // Rate limiting check
    const clientIp = req.headers.get("x-forwarded-for") || "client_ip";
    const rateLimitKey = `${clientIp}_${emailLower}`;
    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          message: `Too many failed login attempts. Please wait ${rateCheck.remainingSecs} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const apiUrl = getBackendApiUrl();
    let res: Response | null = null;
    let data: any = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      data = await res.json().catch(() => null);
    } catch (networkErr: any) {
      // Backend waking up or offline
    }

    if (res && res.ok && data) {
      clearFailedAttempts(rateLimitKey);
      const response = NextResponse.json(data);
      const token = data?.data?.accessToken || data?.accessToken;
      if (token) {
        response.cookies.set("token", token, {
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }

      // Record login in global user registry
      try {
        const userPayload = data?.data?.user || data?.user;
        if (userPayload) {
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
    }

    // Check if user is registered in the platform registry
    const registry = getUserRegistry();
    const registeredUser = registry.get(emailLower) || Array.from(registry.values()).find(
      (u) => u.email.toLowerCase() === emailLower || u.username.toLowerCase() === emailLower
    );

    if (registeredUser) {
      // Strictly enforce secure timing-safe password verification
      const isValid = verifyPassword(password, registeredUser.passwordHash);
      if (!isValid) {
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json(
          { message: "Invalid email or password. Please check your credentials and try again." },
          { status: 401 }
        );
      }

      clearFailedAttempts(rateLimitKey);

      // Generate secure session token
      const crypto = await import("crypto");
      const token = `token_jwt_${crypto.randomBytes(24).toString("hex")}`;
      const recorded = recordUserLoginEvent({
        id: registeredUser.id,
        username: registeredUser.username,
        email: registeredUser.email,
        name: registeredUser.name,
        role: registeredUser.role,
        college: registeredUser.college,
        score: registeredUser.score,
        problemsSolved: registeredUser.problemsSolved,
        status: "ONLINE",
      });

      // Strip sensitive password hash before returning
      const safeUser: any = { ...recorded };
      delete safeUser.password;
      delete safeUser.passwordHash;

      const response = NextResponse.json({
        success: true,
        data: {
          user: safeUser,
          accessToken: token,
        },
      });

      response.cookies.set("token", token, {
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return response;
    }

    recordFailedAttempt(rateLimitKey);
    let message = "Invalid email or password. Please register if you don't have an account.";
    if (data && data.message) {
      message = Array.isArray(data.message) ? data.message.join(", ") : data.message;
    }

    return NextResponse.json({ message, error: data?.error }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to sign in" },
      { status: 500 }
    );
  }
}
