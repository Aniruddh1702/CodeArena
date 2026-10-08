export interface PlatformUserRecord {
  id: string;
  username: string;
  email: string;
  name: string;
  role: "STUDENT" | "SUPER_ADMIN" | "ADMIN" | "INSTRUCTOR";
  college?: string;
  score: number;
  problemsSolved: number;
  lastLoginAt: string;
  registeredAt: string;
  status: "ACTIVE" | "ONLINE" | "SUSPENDED";
}

// Global server-side registry of all students and admins who have logged in or registered
declare global {
  var __codearena_global_users: Map<string, PlatformUserRecord> | undefined;
}

if (!global.__codearena_global_users) {
  global.__codearena_global_users = new Map<string, PlatformUserRecord>();
}

export function getUserRegistry(): Map<string, PlatformUserRecord> {
  if (!global.__codearena_global_users) {
    global.__codearena_global_users = new Map<string, PlatformUserRecord>();
  }
  return global.__codearena_global_users;
}

export function clearUserRegistry(): void {
  if (global.__codearena_global_users) {
    global.__codearena_global_users.clear();
  }
}

export function recordUserLoginEvent(user: Partial<PlatformUserRecord> & { username: string; email?: string }): PlatformUserRecord {
  const map = getUserRegistry();
  const key = user.username.toLowerCase();
  const existing = map.get(key);

  const updated: PlatformUserRecord = {
    id: user.id || existing?.id || `usr_${Date.now()}`,
    username: user.username,
    email: user.email || existing?.email || `${user.username}@codearena.dev`,
    name: user.name || (user as any).firstName ? `${(user as any).firstName || ""} ${(user as any).lastName || ""}`.trim() : existing?.name || user.username,
    role: (user.role as any) || existing?.role || "STUDENT",
    college: user.college || existing?.college || "CodeArena Academy",
    score: user.score !== undefined ? user.score : (existing?.score || 1450),
    problemsSolved: user.problemsSolved !== undefined ? user.problemsSolved : (existing?.problemsSolved || 0),
    lastLoginAt: new Date().toISOString(),
    registeredAt: existing?.registeredAt || new Date().toISOString(),
    status: "ONLINE",
  };

  map.set(key, updated);
  return updated;
}
