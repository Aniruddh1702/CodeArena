import crypto from "crypto";
import { NextRequest } from "next/server";

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || process.env.JWT_SECRET || "codearena_secure_admin_key_2026";

export function signAdminToken(): string {
  const payload = `admin_${Date.now()}`;
  const hmac = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

export function verifyAdminToken(token?: string | null): boolean {
  if (!token || !token.includes(".")) return false;
  try {
    const [payload, sig] = token.split(".");
    const expected = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch (e) {
    return false;
  }
}

const VALID_ADMIN_PASSCODES = [
  "Aniruddh#1702",
  "Admin@123!",
  "codearena-admin-2026",
  "admin123",
];

export function checkAdminAuth(req: NextRequest): boolean {
  const cookieToken = req.cookies.get("codearena_admin_token")?.value;
  const headerToken = req.headers.get("x-admin-token") || req.headers.get("authorization")?.replace("Bearer ", "");
  if (verifyAdminToken(cookieToken) || verifyAdminToken(headerToken)) {
    return true;
  }

  // Fallback 1: check admin passcode header
  const headerPass = req.headers.get("x-admin-passcode");
  if (headerPass && VALID_ADMIN_PASSCODES.includes(headerPass)) {
    return true;
  }

  // Fallback 2: check admin authorization cookie or header
  const cookieAuth = req.cookies.get("codearena_admin_auth")?.value;
  const headerAuth = req.headers.get("x-admin-auth");
  if (cookieAuth === "true" || headerAuth === "true") {
    return true;
  }

  return false;
}
