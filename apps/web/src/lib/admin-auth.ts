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

export function checkAdminAuth(req: NextRequest): boolean {
  const cookieToken = req.cookies.get("codearena_admin_token")?.value;
  const headerToken = req.headers.get("x-admin-token") || req.headers.get("authorization")?.replace("Bearer ", "");
  return verifyAdminToken(cookieToken) || verifyAdminToken(headerToken);
}
