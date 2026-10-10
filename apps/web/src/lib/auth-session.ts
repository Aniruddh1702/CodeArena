// Multi-Account Session & Data Isolation Manager
// Ensures every user account maintains its own isolated real-time progress,
// solved problems, ratings, activities, and submissions.

export interface UserAccount {
  id: string;
  email: string;
  username: string;
  name: string;
  password?: string;
  role: string;
  avatarUrl?: string;
  token: string;
  college?: string;
  branch?: string;
  year?: string;
  bio?: string;
  github?: string;
  joinedDate?: string;
  lastActiveAt?: string;
}

export interface UserStats {
  solvedProblems: any[];
  problemsSolved: number;
  dsaRating: number;
  recentActivity: any[];
}

const ACCOUNTS_KEY = "codearena_accounts";
const ACTIVE_ACCOUNT_ID_KEY = "codearena_active_account_id";

/**
 * Get all accounts currently logged in on this browser
 */
export function getAllAccounts(): UserAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) {
      // Check legacy single-account migration
      const legacyUser = localStorage.getItem("user");
      const legacyToken = localStorage.getItem("token");
      const legacyProfile = localStorage.getItem("userProfile");

      if (legacyUser || legacyProfile) {
        let u: any = {};
        if (legacyUser) {
          try { u = JSON.parse(legacyUser); } catch {}
        }
        let prof: any = {};
        if (legacyProfile) {
          try { prof = JSON.parse(legacyProfile); } catch {}
        }

        const migrated: UserAccount = {
          id: u.id || u.username || u.email || prof.username || "student",
          email: u.email || prof.email || "student@codearena.dev",
          username: u.username || prof.username || "student",
          name: prof.name || (u.firstName ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "") || u.username || "CodeArena Student",
          role: u.role || "STUDENT",
          token: legacyToken || "session_token_default",
          college: prof.college || prof.organization || "CodeArena Academy",
          branch: prof.branch || "Computer Science",
          year: prof.year || "3rd Year",
          bio: prof.bio || "Competitive Programmer & DSA Enthusiast",
          github: prof.github || u.username || "student",
          lastActiveAt: new Date().toISOString(),
        };
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([migrated]));
        localStorage.setItem(ACTIVE_ACCOUNT_ID_KEY, migrated.id);
        return [migrated];
      }

      // First-time visitor has no active accounts until they log in
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    console.error("Failed to read accounts:", e);
    return [];
  }
}

/**
 * Update active account properties (name, bio, college, github, etc.)
 */
export function updateActiveAccount(updates: Partial<UserAccount>): UserAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const active = getActiveAccount();
    if (!active) return null;

    const updated = { ...active, ...updates, lastActiveAt: new Date().toISOString() };
    saveAccount(updated, true);
    return updated;
  } catch (e) {
    console.error("Failed to update active account:", e);
    return null;
  }
}

/**
 * Get the currently active account session
 */
export function getActiveAccount(): UserAccount | null {
  if (typeof window === "undefined") return null;
  const activeId = localStorage.getItem(ACTIVE_ACCOUNT_ID_KEY);
  if (!activeId) return null;

  const accounts = getAllAccounts();
  if (accounts.length === 0) return null;

  const found = accounts.find((a) => a.id === activeId || a.username === activeId || a.email === activeId);
  return found || null;
}

/**
 * Save an account session (adds or updates)
 */
export function saveAccount(account: UserAccount, setAsActive: boolean = true): void {
  if (typeof window === "undefined") return;
  try {
    const accounts = getAllAccounts();
    const existingIndex = accounts.findIndex(
      (a) => a.id === account.id || a.username.toLowerCase() === (account.username || "").toLowerCase() || a.email.toLowerCase() === (account.email || "").toLowerCase()
    );
    const existing = existingIndex >= 0 ? accounts[existingIndex] : undefined;
    const updatedAccount: UserAccount = {
      ...existing,
      ...account,
      id: account.id || existing?.id || account.username || account.email,
      password: account.password || existing?.password,
      lastActiveAt: new Date().toISOString(),
    };

    let updatedList: UserAccount[];
    if (existingIndex >= 0) {
      updatedList = [...accounts];
      updatedList[existingIndex] = updatedAccount;
    } else {
      updatedList = [updatedAccount, ...accounts];
    }

    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedList));

    if (setAsActive) {
      setActiveAccount(updatedAccount.id);
    }
  } catch (e) {
    console.error("Failed to save account:", e);
  }
}

/**
 * Set an account as the active session
 */
export function setActiveAccount(accountId: string): UserAccount | null {
  if (typeof window === "undefined") return null;
  const accounts = getAllAccounts();
  const target = accounts.find(
    (a) => a.id === accountId || a.username.toLowerCase() === accountId.toLowerCase() || a.email.toLowerCase() === accountId.toLowerCase()
  );

  if (!target) return null;

  localStorage.setItem(ACTIVE_ACCOUNT_ID_KEY, target.id);
  localStorage.setItem("token", target.token);
  localStorage.setItem("user", JSON.stringify(target));
  localStorage.setItem(
    "userProfile",
    JSON.stringify({
      name: target.name,
      username: target.username,
      email: target.email,
      role: target.role === "STUDENT" ? "Student" : target.role,
      college: target.college || "CodeArena University",
      year: target.year || "3rd Year",
      branch: target.branch || "Computer Science",
      bio: target.bio || "Competitive Programmer & DSA Enthusiast",
      github: target.github || target.username,
    })
  );

  // Synchronize target user's authentic isolated stats to active storage
  // (For a new user, this sets solvedProblems=[], problemsSolved=0, dsaRating=1450, recentActivity=[])
  const targetStats = getUserStats(target.id);
  localStorage.setItem("solvedProblems", JSON.stringify(targetStats.solvedProblems));
  localStorage.setItem("problemsSolved", targetStats.problemsSolved.toString());
  localStorage.setItem("dsaRating", targetStats.dsaRating.toString());
  localStorage.setItem("recentActivity", JSON.stringify(targetStats.recentActivity));

  // Purge any unscoped old submitted code caches so new users start completely fresh
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith("submissions_") && !k.startsWith("codearena_")) {
        localStorage.removeItem(k);
      }
    }
  } catch (e) {}

  // Sync session cookie
  document.cookie = `token=${target.token}; path=/; max-age=604800; SameSite=Lax`;

  // Dispatch custom window event for multi-tab / dynamic reactivity
  window.dispatchEvent(new CustomEvent("codearena_account_changed", { detail: target }));

  return target;
}

/**
 * Switch to another saved account
 */
export function switchAccount(accountId: string): UserAccount | null {
  const result = setActiveAccount(accountId);
  return result;
}

/**
 * Log out a specific account
 */
export function logoutAccount(accountId: string): void {
  if (typeof window === "undefined") return;
  const accounts = getAllAccounts();
  const filtered = accounts.filter(
    (a) => a.id !== accountId && a.username.toLowerCase() !== accountId.toLowerCase() && a.email.toLowerCase() !== accountId.toLowerCase()
  );

  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(filtered));

  const activeId = localStorage.getItem(ACTIVE_ACCOUNT_ID_KEY);
  if (activeId === accountId || !filtered.some((a) => a.id === activeId)) {
    if (filtered.length > 0) {
      setActiveAccount(filtered[0].id);
    } else {
      logoutAll();
    }
  }
}

/**
 * Log out all accounts
 */
export function logoutAll(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCOUNTS_KEY);
  localStorage.removeItem(ACTIVE_ACCOUNT_ID_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userProfile");
  localStorage.removeItem("solvedProblems");
  localStorage.removeItem("problemsSolved");
  localStorage.removeItem("dsaRating");
  localStorage.removeItem("recentActivity");

  // Wipe any unscoped or legacy submission data
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("submissions_") || k.startsWith("codearena_"))) {
        localStorage.removeItem(k);
      }
    }
  } catch (e) {}

  document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
  window.dispatchEvent(new CustomEvent("codearena_account_changed", { detail: null }));
}

/**
 * Get account-scoped storage key
 */
export function getUserScopedKey(userId: string, key: string): string {
  const safeId = (userId || "default").replace(/[^a-zA-Z0-9_-]/g, "_");
  return `codearena_${safeId}_${key}`;
}

/**
 * Get real-time stats for a specific user (isolated per account)
 */
export function getUserStats(userId: string): UserStats {
  if (typeof window === "undefined") {
    return { solvedProblems: [], problemsSolved: 0, dsaRating: 1450, recentActivity: [] };
  }

  const safeId = (userId || "default").replace(/[^a-zA-Z0-9_-]/g, "_");
  let solvedProblems: any[] = [];
  try {
    const raw = localStorage.getItem(getUserScopedKey(safeId, "solvedProblems"));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const seen = new Set<string>();
        solvedProblems = parsed.filter((p: any) => {
          if (!p || !p.slug || seen.has(p.slug)) return false;
          seen.add(p.slug);
          return true;
        });
      }
    }
  } catch (e) {
    console.error("Error reading scoped solvedProblems:", e);
  }

  const problemsSolved = solvedProblems.length;
  const expectedRating = 1450 + (problemsSolved * 15);
  let dsaRating = expectedRating;

  try {
    const storedRating = localStorage.getItem(getUserScopedKey(safeId, "dsaRating"));
    if (storedRating) {
      const parsed = parseInt(storedRating, 10);
      dsaRating = isNaN(parsed) ? expectedRating : Math.max(1450, parsed);
    }
  } catch (e) {
    console.error("Error reading scoped dsaRating:", e);
  }

  let recentActivity: any[] = [];
  try {
    const rawAct = localStorage.getItem(getUserScopedKey(safeId, "recentActivity"));
    if (rawAct) {
      const parsed = JSON.parse(rawAct);
      if (Array.isArray(parsed)) recentActivity = parsed;
    }
  } catch (e) {
    console.error("Error reading scoped recentActivity:", e);
  }

  return {
    solvedProblems,
    problemsSolved,
    dsaRating,
    recentActivity,
  };
}

/**
 * Record a solved problem specifically for the active user account
 */
export function recordUserSolve(
  userId: string,
  problem: { slug: string; title: string; difficulty: string },
  language: string = "JavaScript",
  runtime?: string,
  memory?: string
): { isNewSolve: boolean; newCount: number; newRating: number } {
  if (typeof window === "undefined") {
    return { isNewSolve: false, newCount: 0, newRating: 1450 };
  }

  const safeId = (userId || "default").replace(/[^a-zA-Z0-9_-]/g, "_");
  const stats = getUserStats(safeId);
  const alreadySolved = stats.solvedProblems.some((p: any) => p.slug === problem.slug);

  let updatedList = [...stats.solvedProblems];
  let newRating = stats.dsaRating;

  if (!alreadySolved) {
    updatedList.push({
      slug: problem.slug,
      title: problem.title,
      difficulty: problem.difficulty,
      solvedAt: new Date().toISOString(),
    });
    newRating = 1450 + (updatedList.length * 15);
  }

  // Deduplicate and save
  localStorage.setItem(getUserScopedKey(safeId, "solvedProblems"), JSON.stringify(updatedList));
  localStorage.setItem(getUserScopedKey(safeId, "problemsSolved"), updatedList.length.toString());
  localStorage.setItem(getUserScopedKey(safeId, "dsaRating"), newRating.toString());

  // Update activity log
  const updatedActivity = stats.recentActivity.filter((a: any) => a.slug !== problem.slug);
  updatedActivity.unshift({
    type: "SOLVED",
    title: problem.title,
    slug: problem.slug,
    difficulty: problem.difficulty,
    language,
    runtime: runtime || "64ms",
    memory: memory || "42.1MB",
    date: "Just now",
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(getUserScopedKey(safeId, "recentActivity"), JSON.stringify(updatedActivity.slice(0, 20)));

  // Also sync current active legacy keys for current active user
  const activeAcc = getActiveAccount();
  if (activeAcc && (activeAcc.id === userId || activeAcc.username === userId)) {
    localStorage.setItem("solvedProblems", JSON.stringify(updatedList));
    localStorage.setItem("problemsSolved", updatedList.length.toString());
    localStorage.setItem("dsaRating", newRating.toString());
    localStorage.setItem("recentActivity", JSON.stringify(updatedActivity.slice(0, 20)));
  }

  return {
    isNewSolve: !alreadySolved,
    newCount: updatedList.length,
    newRating,
  };
}

/**
 * Get submissions for a problem scoped to the user account
 */
export function getUserProblemSubmissions(userId: string, slug: string): any[] {
  if (typeof window === "undefined") return [];
  const safeId = (userId || "default").replace(/[^a-zA-Z0-9_-]/g, "_");
  try {
    const raw = localStorage.getItem(getUserScopedKey(safeId, `submissions_${slug}`));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

/**
 * Save submission scoped to the user account
 */
export function saveUserProblemSubmission(userId: string, slug: string, submission: any): void {
  if (typeof window === "undefined") return;
  const safeId = (userId || "default").replace(/[^a-zA-Z0-9_-]/g, "_");
  const existing = getUserProblemSubmissions(safeId, slug);
  const updated = [submission, ...existing].slice(0, 30);
  localStorage.setItem(getUserScopedKey(safeId, `submissions_${slug}`), JSON.stringify(updated));
}

/**
 * Update user rating directly (e.g. from battle victories or tournament results)
 * Ensures scoped isolation, activity logging, and real-time reactive event dispatch.
 */
export function updateUserRating(userId: string, newRating: number, activityItem?: any): number {
  if (typeof window === "undefined") return newRating;
  const safeId = (userId || "default").replace(/[^a-zA-Z0-9_-]/g, "_");
  const clampedRating = Math.max(1000, Math.round(newRating));

  localStorage.setItem(getUserScopedKey(safeId, "dsaRating"), clampedRating.toString());

  // If activity item is provided, append it to user's recentActivity
  if (activityItem) {
    const stats = getUserStats(safeId);
    const updatedActivity = [
      activityItem,
      ...stats.recentActivity.filter((a: any) => a.id && a.id !== activityItem.id)
    ].slice(0, 20);
    localStorage.setItem(getUserScopedKey(safeId, "recentActivity"), JSON.stringify(updatedActivity));
  }

  // Also sync current active legacy keys if matching active user
  const activeAcc = getActiveAccount();
  if (activeAcc && (activeAcc.id === userId || activeAcc.username === userId)) {
    localStorage.setItem("dsaRating", clampedRating.toString());
  }

  // Dispatch account change event so Dashboard, Profile, and Header reflect the new rating instantly
  window.dispatchEvent(new CustomEvent("codearena_account_changed", { detail: activeAcc }));

  return clampedRating;
}

export interface UserAssessmentRecord {
  id: string;
  testId: string;
  testTitle: string;
  score: number;
  totalPoints: number;
  status: string;
  timeTaken: number;
  date: string;
  submittedAt: string;
  language?: string;
  code?: string;
  passedTestCases?: number;
  totalTestCases?: number;
}

export function getUserAssessments(userId: string): UserAssessmentRecord[] {
  if (typeof window === "undefined") return [];
  const safeId = (userId || "default").replace(/[^a-zA-Z0-9_-]/g, "_");
  try {
    const raw = localStorage.getItem(getUserScopedKey(safeId, "assessments"));
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

export function saveUserAssessment(userId: string, record: UserAssessmentRecord): void {
  if (typeof window === "undefined") return;
  const safeId = (userId || "default").replace(/[^a-zA-Z0-9_-]/g, "_");
  try {
    const current = getUserAssessments(safeId);
    const updated = [record, ...current.filter((r) => r.id !== record.id)];
    localStorage.setItem(getUserScopedKey(safeId, "assessments"), JSON.stringify(updated));

    // Also append to user recentActivity
    const stats = getUserStats(safeId);
    const activityItem = {
      id: `act_${Date.now()}`,
      type: "ASSESSMENT_COMPLETED",
      title: `Completed Assessment: ${record.testTitle}`,
      score: `${record.score}/${record.totalPoints}`,
      date: "Just now",
      timestamp: new Date().toISOString(),
    };
    const updatedActivity = [activityItem, ...stats.recentActivity].slice(0, 20);
    localStorage.setItem(getUserScopedKey(safeId, "recentActivity"), JSON.stringify(updatedActivity));

    const activeAcc = getActiveAccount();
    window.dispatchEvent(new CustomEvent("codearena_account_changed", { detail: activeAcc }));
  } catch (e) {
    console.error("Failed to save user assessment:", e);
  }
}

