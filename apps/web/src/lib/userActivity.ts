import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

export interface PlatformUserRecord {
  id: string;
  username: string;
  email: string;
  name: string;
  passwordHash?: string;
  role: "STUDENT" | "SUPER_ADMIN" | "ADMIN" | "INSTRUCTOR";
  college?: string;
  score: number;
  problemsSolved: number;
  lastLoginAt: string;
  registeredAt: string;
  status: "ACTIVE" | "ONLINE" | "SUSPENDED" | "PENDING_VERIFICATION";
  emailVerified?: boolean;
}

const REGISTRY_FILE = path.join(os.tmpdir(), "codearena_platform_users.json");

/**
 * Secure password hashing using Node crypto scrypt with random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Timing-safe password verification
 */
export function verifyPassword(password: string, storedHash?: string): boolean {
  if (!password || !storedHash) return false;
  try {
    if (storedHash.includes(":")) {
      const [salt, originalHash] = storedHash.split(":");
      const calculated = crypto.scryptSync(password, salt, 64).toString("hex");
      return crypto.timingSafeEqual(Buffer.from(originalHash), Buffer.from(calculated));
    }
    // Fallback comparison for legacy unhashed entries (auto-upgrades on next login)
    return crypto.timingSafeEqual(
      Buffer.from(password.padEnd(32)),
      Buffer.from(storedHash.padEnd(32))
    );
  } catch (e) {
    return false;
  }
}

// In-memory cache
declare global {
  var __codearena_global_users: Map<string, PlatformUserRecord> | undefined;
}

function loadUsersFromFile(): Map<string, PlatformUserRecord> {
  const map = new Map<string, PlatformUserRecord>();
  try {
    if (fs.existsSync(REGISTRY_FILE)) {
      const raw = fs.readFileSync(REGISTRY_FILE, "utf-8");
      const list: PlatformUserRecord[] = JSON.parse(raw);
      if (Array.isArray(list)) {
        for (const u of list) {
          if (u && u.username) {
            // Auto-upgrade legacy plaintext passwords to hash
            if ((u as any).password && !u.passwordHash) {
              u.passwordHash = hashPassword((u as any).password);
              delete (u as any).password;
            }
            map.set(u.username.toLowerCase(), u);
            if (u.email) {
              map.set(u.email.toLowerCase(), u);
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Error reading registry file:", e);
  }
  return map;
}

function saveUsersToFile(map: Map<string, PlatformUserRecord>): void {
  try {
    const unique = Array.from(new Set(Array.from(map.values())));
    // Strip any residual raw password fields before saving
    const sanitized = unique.map((u) => {
      const copy: any = { ...u };
      delete copy.password;
      return copy;
    });
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(sanitized, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing registry file:", e);
  }
}

export function getUserRegistry(): Map<string, PlatformUserRecord> {
  if (!global.__codearena_global_users || global.__codearena_global_users.size === 0) {
    global.__codearena_global_users = loadUsersFromFile();
  }
  return global.__codearena_global_users;
}

export function clearUserRegistry(): void {
  if (global.__codearena_global_users) {
    global.__codearena_global_users.clear();
  }
  try {
    if (fs.existsSync(REGISTRY_FILE)) {
      fs.unlinkSync(REGISTRY_FILE);
    }
  } catch (e) {}
}

export function deleteUserFromRegistry(identifier: string): boolean {
  const map = getUserRegistry();
  const idLower = identifier.toLowerCase().trim();
  let found = false;

  for (const [k, u] of Array.from(map.entries())) {
    if (k === idLower || (u.username && u.username.toLowerCase() === idLower) || (u.email && u.email.toLowerCase() === idLower) || u.id === identifier) {
      map.delete(k);
      found = true;
    }
  }

  if (found) {
    saveUsersToFile(map);
  }
  return found;
}

export function recordUserLoginEvent(user: Partial<PlatformUserRecord> & { username: string; email?: string; password?: string }): PlatformUserRecord {
  const map = getUserRegistry();
  const unameKey = user.username.toLowerCase();
  const emailKey = (user.email || `${user.username}@codearena.dev`).toLowerCase();
  
  const existing = map.get(unameKey) || map.get(emailKey);

  let passwordHash = existing?.passwordHash;
  if (user.password) {
    passwordHash = hashPassword(user.password);
  } else if ((user as any).passwordHash) {
    passwordHash = (user as any).passwordHash;
  }

  const updated: PlatformUserRecord = {
    id: user.id || existing?.id || `usr_${Date.now()}`,
    username: user.username,
    email: user.email || existing?.email || `${user.username}@codearena.dev`,
    name: user.name || ((user as any).firstName ? `${(user as any).firstName || ""} ${(user as any).lastName || ""}`.trim() : existing?.name || user.username),
    passwordHash,
    role: (user.role as any) || existing?.role || "STUDENT",
    college: user.college || existing?.college || "CodeArena Academy",
    score: user.score !== undefined ? user.score : (existing?.score || 1450),
    problemsSolved: user.problemsSolved !== undefined ? user.problemsSolved : (existing?.problemsSolved || 0),
    lastLoginAt: new Date().toISOString(),
    registeredAt: existing?.registeredAt || new Date().toISOString(),
    status: user.status || existing?.status || "ONLINE",
    emailVerified: user.emailVerified !== undefined ? user.emailVerified : (existing?.emailVerified !== undefined ? existing.emailVerified : true),
  };

  map.set(unameKey, updated);
  map.set(emailKey, updated);
  
  saveUsersToFile(map);
  return updated;
}

const RESET_TOKENS_FILE = path.join(os.tmpdir(), "codearena_reset_tokens.json");

interface ResetTokenRecord {
  tokenHash: string;
  email: string;
  expiresAt: number;
}

function loadResetTokens(): Map<string, ResetTokenRecord> {
  const map = new Map<string, ResetTokenRecord>();
  try {
    if (fs.existsSync(RESET_TOKENS_FILE)) {
      const raw = fs.readFileSync(RESET_TOKENS_FILE, "utf-8");
      const list: ResetTokenRecord[] = JSON.parse(raw);
      if (Array.isArray(list)) {
        const now = Date.now();
        for (const item of list) {
          if (item && item.tokenHash && item.expiresAt > now) {
            map.set(item.tokenHash, item);
          }
        }
      }
    }
  } catch (e) {
    console.error("Error loading reset tokens:", e);
  }
  return map;
}

function saveResetTokens(map: Map<string, ResetTokenRecord>): void {
  try {
    const list = Array.from(map.values());
    fs.writeFileSync(RESET_TOKENS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving reset tokens:", e);
  }
}

export function savePasswordResetToken(token: string, email: string): void {
  const tokens = loadResetTokens();
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  tokens.set(tokenHash, {
    tokenHash,
    email: email.toLowerCase().trim(),
    expiresAt: Date.now() + 3600 * 1000, // 1 hour expiry
  });
  saveResetTokens(tokens);
}

export function verifyAndConsumeResetToken(token: string, newPassword: string): { success: boolean; email?: string } {
  const tokens = loadResetTokens();
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const record = tokens.get(tokenHash);
  if (!record || record.expiresAt < Date.now()) {
    return { success: false };
  }

  // Consume token
  tokens.delete(tokenHash);
  saveResetTokens(tokens);

  // Update password in user registry with secure hash
  const registry = getUserRegistry();
  const user = registry.get(record.email);
  if (user) {
    user.passwordHash = hashPassword(newPassword);
    delete (user as any).password;
    registry.set(user.username.toLowerCase(), user);
    registry.set(user.email.toLowerCase(), user);
    saveUsersToFile(registry);
  }

  return { success: true, email: record.email };
}
