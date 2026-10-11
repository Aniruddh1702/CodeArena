import fs from "fs";
import path from "path";
import os from "os";

export interface PlatformUserRecord {
  id: string;
  username: string;
  email: string;
  name: string;
  password?: string;
  role: "STUDENT" | "SUPER_ADMIN" | "ADMIN" | "INSTRUCTOR";
  college?: string;
  score: number;
  problemsSolved: number;
  lastLoginAt: string;
  registeredAt: string;
  status: "ACTIVE" | "ONLINE" | "SUSPENDED";
}

const REGISTRY_FILE = path.join(os.tmpdir(), "codearena_platform_users.json");

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
    // Unique list by id / username
    const unique = Array.from(new Set(Array.from(map.values())));
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(unique, null, 2), "utf-8");
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

export function recordUserLoginEvent(user: Partial<PlatformUserRecord> & { username: string; email?: string }): PlatformUserRecord {
  const map = getUserRegistry();
  const unameKey = user.username.toLowerCase();
  const emailKey = (user.email || `${user.username}@codearena.dev`).toLowerCase();
  
  const existing = map.get(unameKey) || map.get(emailKey);

  const updated: PlatformUserRecord = {
    id: user.id || existing?.id || `usr_${Date.now()}`,
    username: user.username,
    email: user.email || existing?.email || `${user.username}@codearena.dev`,
    name: user.name || (user as any).firstName ? `${(user as any).firstName || ""} ${(user as any).lastName || ""}`.trim() : existing?.name || user.username,
    password: user.password || existing?.password,
    role: (user.role as any) || existing?.role || "STUDENT",
    college: user.college || existing?.college || "CodeArena Academy",
    score: user.score !== undefined ? user.score : (existing?.score || 1450),
    problemsSolved: user.problemsSolved !== undefined ? user.problemsSolved : (existing?.problemsSolved || 0),
    lastLoginAt: new Date().toISOString(),
    registeredAt: existing?.registeredAt || new Date().toISOString(),
    status: "ONLINE",
  };

  map.set(unameKey, updated);
  map.set(emailKey, updated);
  
  saveUsersToFile(map);
  return updated;
}

const RESET_TOKENS_FILE = path.join(os.tmpdir(), "codearena_reset_tokens.json");

interface ResetTokenRecord {
  token: string;
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
          if (item && item.token && item.expiresAt > now) {
            map.set(item.token, item);
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
  tokens.set(token, {
    token,
    email: email.toLowerCase().trim(),
    expiresAt: Date.now() + 3600 * 1000, // 1 hour expiry
  });
  saveResetTokens(tokens);
}

export function verifyAndConsumeResetToken(token: string, newPassword: string): { success: boolean; email?: string } {
  const tokens = loadResetTokens();
  const record = tokens.get(token);
  if (!record || record.expiresAt < Date.now()) {
    return { success: false };
  }

  // Consume token
  tokens.delete(token);
  saveResetTokens(tokens);

  // Update password in user registry
  const registry = getUserRegistry();
  const user = registry.get(record.email);
  if (user) {
    user.password = newPassword;
    registry.set(user.username.toLowerCase(), user);
    registry.set(user.email.toLowerCase(), user);
    saveUsersToFile(registry);
  }

  return { success: true, email: record.email };
}
