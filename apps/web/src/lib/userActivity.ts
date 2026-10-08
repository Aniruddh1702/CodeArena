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

  // Default seed accounts
  const seedUsers: PlatformUserRecord[] = [
    {
      id: "usr_alex_chen",
      username: "alex.chen",
      email: "alex.chen@gmail.com",
      name: "Alex Chen",
      role: "STUDENT",
      college: "Stanford University",
      score: 1850,
      problemsSolved: 42,
      lastLoginAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      registeredAt: "2026-09-01T00:00:00.000Z",
      status: "ONLINE",
    },
    {
      id: "usr_priya_patel",
      username: "priya.patel",
      email: "priya.patel@gmail.com",
      name: "Priya Patel",
      role: "STUDENT",
      college: "IIT Bombay",
      score: 1720,
      problemsSolved: 38,
      lastLoginAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      registeredAt: "2026-09-05T00:00:00.000Z",
      status: "ONLINE",
    },
    {
      id: "usr_rahul_sharma",
      username: "rahul.sharma",
      email: "rahul.sharma@gmail.com",
      name: "Rahul Sharma",
      role: "STUDENT",
      college: "BITS Pilani",
      score: 1640,
      problemsSolved: 29,
      lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      registeredAt: "2026-09-10T00:00:00.000Z",
      status: "ACTIVE",
    },
  ];

  seedUsers.forEach((u) => global.__codearena_global_users!.set(u.username.toLowerCase(), u));
}

export function getUserRegistry(): Map<string, PlatformUserRecord> {
  return global.__codearena_global_users!;
}

export function recordUserLoginEvent(user: Partial<PlatformUserRecord> & { username: string; email?: string }): PlatformUserRecord {
  const map = global.__codearena_global_users!;
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
