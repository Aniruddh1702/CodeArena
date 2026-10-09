import { saveNotification, checkContest1HourReminders } from "./notifications";
import { PROBLEMS_DATABASE, getCustomProblems, ProblemDefinition } from "./problems-data";

export interface ContestProblem {
  problemSlug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  points: number;
  problemDef?: ProblemDefinition;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string; // ISO string
  durationMinutes: number;
  endTime: string; // ISO string
  status: "UPCOMING" | "LIVE" | "ENDED";
  problems: ContestProblem[];
  participantsCount: number;
  registeredUsers: string[]; // emails
  isRated: boolean;
  rules: string[];
  createdAt: string;
}

export interface ContestSubmission {
  id: string;
  contestId: string;
  userEmail: string;
  userName: string;
  problemSlug: string;
  problemTitle?: string;
  status: "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR";
  score: number;
  penaltyMinutes: number;
  submittedAt: string;
  language?: string;
  code?: string;
  runtime?: string;
  memory?: string;
  passedTestCases?: number;
  totalTestCases?: number;
}

export interface ContestStanding {
  rank: number;
  userEmail: string;
  userName: string;
  score: number;
  penaltyMinutes: number;
  problemsSolved: number;
  problemResults: Record<string, {
    solved: boolean;
    attempts: number;
    points: number;
    timeMinutes: number;
  }>;
}

const STORAGE_KEY = "codearena_contests";
const SUBMISSIONS_PREFIX = "codearena_contest_subs_";

// Clean initial default contests
const DEFAULT_CONTESTS: Contest[] = [
  {
    id: "contest-weekly-clash-1",
    title: "CodeArena Bi-Weekly Clash #1",
    description: "Compete against engineers worldwide in our bi-weekly algorithm challenge. 4 algorithmic challenges from Easy to Hard.",
    startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // LIVE
    durationMinutes: 90,
    endTime: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
    status: "LIVE",
    problems: [
      {
        problemSlug: "two-sum",
        title: "Two Sum",
        difficulty: "EASY",
        points: 100,
        problemDef: PROBLEMS_DATABASE["two-sum"]
      },
      {
        problemSlug: "container-with-most-water",
        title: "Container With Most Water",
        difficulty: "MEDIUM",
        points: 200,
        problemDef: PROBLEMS_DATABASE["container-with-most-water"]
      },
      {
        problemSlug: "coin-change",
        title: "Coin Change",
        difficulty: "MEDIUM",
        points: 300,
        problemDef: PROBLEMS_DATABASE["coin-change"]
      },
      {
        problemSlug: "trapping-rain-water",
        title: "Trapping Rain Water",
        difficulty: "HARD",
        points: 500,
        problemDef: PROBLEMS_DATABASE["trapping-rain-water"]
      }
    ],
    participantsCount: 42,
    registeredUsers: ["admin@codearena.io", "alex.dev@gmail.com", "sarah.coder@outlook.com", "vikram.singh@iit.ac.in"],
    isRated: true,
    rules: [
      "No external AI coding assistance during the live window.",
      "Each incorrect submission incurs a 5-minute time penalty upon solving.",
      "Rankings are decided by total score, then lowest penalty time."
    ],
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_SUBMISSIONS: Record<string, ContestSubmission[]> = {
  "contest-weekly-clash-1": [
    {
      id: "sub_demo_1",
      contestId: "contest-weekly-clash-1",
      userEmail: "alex.dev@gmail.com",
      userName: "Alex Dev",
      problemSlug: "two-sum",
      problemTitle: "Two Sum",
      language: "javascript",
      code: `var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
      runtime: "48 ms",
      memory: "42.1 MB",
      passedTestCases: 8,
      totalTestCases: 8,
      status: "ACCEPTED",
      score: 100,
      penaltyMinutes: 8,
      submittedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    }
  ]
};

// Helper: Ensure every problem has its full ProblemDefinition attached
function enrichContestProblems(contest: Contest): Contest {
  const custom = typeof window !== "undefined" ? getCustomProblems() : {};
  const enrichedProblems = (contest.problems || []).map((p) => {
    if (p.problemDef && p.problemDef.description) {
      return p;
    }
    const def = PROBLEMS_DATABASE[p.problemSlug] || custom[p.problemSlug];
    return {
      ...p,
      problemDef: def || p.problemDef,
    };
  });
  return {
    ...contest,
    problems: enrichedProblems,
  };
}

let isSyncingContests = false;

// Trigger non-blocking sync with server
export async function syncContestsWithServer(): Promise<Contest[]> {
  if (typeof window === "undefined" || isSyncingContests) return getContests();
  isSyncingContests = true;
  try {
    const res = await fetch("/api/contests", { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (json?.success && Array.isArray(json.contests)) {
      const serverContests: Contest[] = json.contests.map(enrichContestProblems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serverContests));
      window.dispatchEvent(new CustomEvent("codearena_contests_updated", { detail: serverContests }));
      return serverContests;
    }
  } catch (err) {
    console.warn("Server contests background sync:", err);
  } finally {
    isSyncingContests = false;
  }
  return getContests();
}

export function getContests(): Contest[] {
  if (typeof window === "undefined") return DEFAULT_CONTESTS.map(enrichContestProblems);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let contests: Contest[];
    if (raw === null) {
      const enriched = DEFAULT_CONTESTS.map(enrichContestProblems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
      contests = enriched;
    } else {
      contests = JSON.parse(raw).map(enrichContestProblems);
    }

    // Auto update status based on current time
    const now = Date.now();
    let updated = false;
    contests.forEach((c) => {
      if (c.status === "ENDED") return;
      const start = new Date(c.startTime).getTime();
      const end = new Date(c.endTime).getTime();
      let newStatus: Contest["status"] = c.status;

      if (now < start) {
        newStatus = "UPCOMING";
      } else if (now >= start && now <= end) {
        newStatus = "LIVE";
      } else {
        newStatus = "ENDED";
      }

      if (c.status !== newStatus) {
        c.status = newStatus;
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contests));
    }

    // Check for 1-hour contest reminders
    checkContest1HourReminders(contests);

    return contests;
  } catch (e) {
    console.error("Failed to load contests:", e);
    return DEFAULT_CONTESTS.map(enrichContestProblems);
  }
}

export function getContestById(id: string): Contest | null {
  const contests = getContests();
  const c = contests.find((x) => x.id === id);
  return c ? enrichContestProblems(c) : null;
}

export async function saveContest(contest: Contest): Promise<void> {
  const enriched = enrichContestProblems(contest);
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const contests: Contest[] = raw ? JSON.parse(raw) : [];
      const idx = contests.findIndex((c) => c.id === enriched.id);
      const isNew = idx < 0;

      if (idx >= 0) {
        contests[idx] = enriched;
      } else {
        contests.unshift(enriched);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contests));
      window.dispatchEvent(new CustomEvent("codearena_contests_updated", { detail: enriched }));

      // Send notifications if scheduled
      if (isNew) {
        const now = Date.now();
        const startTime = new Date(enriched.startTime).getTime();
        const diffMins = (startTime - now) / (1000 * 60);

        if (enriched.status === "LIVE" || diffMins <= 0) {
          saveNotification({
            title: "🟢 Contest is LIVE Now!",
            message: `'${enriched.title}' is now live! Enter the arena and start solving challenges.`,
            type: "CONTEST_LIVE",
            contestId: enriched.id,
            contestTitle: enriched.title,
            actionUrl: `/contests/${enriched.id}`,
          });
        } else if (diffMins <= 60) {
          saveNotification({
            title: "⏰ Upcoming Contest: 1 Hour Alert!",
            message: `'${enriched.title}' is scheduled to start in ${Math.round(diffMins)} minutes! Prepare your workspace.`,
            type: "CONTEST_1HOUR_ALERT",
            contestId: enriched.id,
            contestTitle: enriched.title,
            actionUrl: `/contests/${enriched.id}`,
          });
        } else {
          const startFormatted = new Date(enriched.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          saveNotification({
            title: "📅 New Contest Scheduled",
            message: `'${enriched.title}' scheduled for ${new Date(enriched.startTime).toLocaleDateString()} at ${startFormatted}. You'll be notified 1 hour before it begins! Check your Gmail for confirmation.`,
            type: "CONTEST_SCHEDULED",
            contestId: enriched.id,
            contestTitle: enriched.title,
            actionUrl: `/contests`,
          });
        }

        // Dispatch Scheduled Gmail/Email to all participants
        try {
          import("./email-service").then(({ dispatchContestEmail }) => {
            import("./auth-session").then(({ getAllAccounts }) => {
              const accounts = getAllAccounts();
              const recipientMap = new Map<string, string>();

              const defaultStudents = [
                { email: "alex.chen@gmail.com", name: "Alex Chen" },
                { email: "priya.patel@gmail.com", name: "Priya Patel" },
                { email: "rahul.sharma@gmail.com", name: "Rahul Sharma" },
                { email: "student@codearena.dev", name: "Student Participant" },
              ];
              defaultStudents.forEach((s) => recipientMap.set(s.email, s.name));

              accounts.forEach((a) => {
                if (a.email && a.email.includes("@")) {
                  recipientMap.set(a.email, a.name || a.username);
                }
              });

              if (Array.isArray(enriched.registeredUsers)) {
                enriched.registeredUsers.forEach((email: string) => {
                  if (email && email.includes("@") && !recipientMap.has(email)) {
                    recipientMap.set(email, email.split("@")[0]);
                  }
                });
              }

              const recipients = Array.from(recipientMap.entries()).map(([email, name]) => ({ email, name }));
              const mailType = diffMins <= 60 && diffMins > 0 ? "CONTEST_1HOUR_REMINDER" : "CONTEST_SCHEDULED";
              dispatchContestEmail(mailType, enriched, recipients);
            });
          });
        } catch (mailErr) {
          console.error("Failed to dispatch scheduled contest emails:", mailErr);
        }
      }
    } catch (e) {
      console.error("Failed to save contest locally:", e);
    }
  }

  // Sync to Backend Server API
  try {
    await fetch("/api/contests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enriched),
    });
  } catch (err) {
    console.warn("Failed to sync contest to server:", err);
  }
}

export async function clearAllContests(): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      window.dispatchEvent(new CustomEvent("codearena_contests_updated", { detail: [] }));
    } catch (e) {
      console.error("Failed to clear contests locally:", e);
    }
  }

  try {
    await fetch("/api/contests", { method: "DELETE" });
  } catch (e) {}
}

export async function deleteContest(id: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let contests: Contest[] = raw ? JSON.parse(raw) : [];
      contests = contests.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contests));
      window.dispatchEvent(new CustomEvent("codearena_contests_updated", { detail: contests }));
    } catch (e) {
      console.error("Failed to delete contest locally:", e);
    }
  }

  try {
    await fetch(`/api/contests/${id}`, { method: "DELETE" });
  } catch (e) {}
  return true;
}

export async function startContestNow(id: string): Promise<Contest | null> {
  const contest = getContestById(id);
  if (!contest) return null;

  const now = new Date();
  const endTime = new Date(now.getTime() + contest.durationMinutes * 60 * 1000);

  contest.startTime = now.toISOString();
  contest.endTime = endTime.toISOString();
  contest.status = "LIVE";

  await saveContest(contest);

  try {
    await fetch(`/api/contests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "LIVE",
        startTime: contest.startTime,
        endTime: contest.endTime,
      }),
    });
  } catch (e) {}

  return contest;
}

export async function endContestNow(id: string): Promise<Contest | null> {
  const contest = getContestById(id);
  if (!contest) return null;

  contest.endTime = new Date().toISOString();
  contest.status = "ENDED";

  await saveContest(contest);

  try {
    await fetch(`/api/contests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "ENDED",
        endTime: contest.endTime,
      }),
    });
  } catch (e) {}

  return contest;
}

export function registerUserForContest(contestId: string, email: string): boolean {
  const contest = getContestById(contestId);
  if (!contest) return false;

  const cleanEmail = email.toLowerCase();
  if (!contest.registeredUsers.includes(cleanEmail)) {
    contest.registeredUsers.push(cleanEmail);
    contest.participantsCount = Math.max(contest.participantsCount + 1, contest.registeredUsers.length);
    saveContest(contest);

    fetch(`/api/contests/${contestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registerUserEmail: cleanEmail }),
    }).catch(() => {});

    return true;
  }
  return false;
}

export function getContestSubmissions(contestId: string): ContestSubmission[] {
  if (typeof window === "undefined") return DEFAULT_SUBMISSIONS[contestId] || [];
  try {
    const raw = localStorage.getItem(`${SUBMISSIONS_PREFIX}${contestId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Trigger background sync with server submissions
      fetch(`/api/contests/${contestId}/submissions`)
        .then((res) => res.json())
        .then((json) => {
          if (json?.success && Array.isArray(json.submissions)) {
            const map = new Map<string, ContestSubmission>();
            json.submissions.forEach((s: ContestSubmission) => map.set(s.id, s));
            parsed.forEach((s: ContestSubmission) => {
              if (!map.has(s.id)) map.set(s.id, s);
            });
            const merged = Array.from(map.values());
            localStorage.setItem(`${SUBMISSIONS_PREFIX}${contestId}`, JSON.stringify(merged));
          }
        })
        .catch(() => {});
      return parsed;
    }
    if (DEFAULT_SUBMISSIONS[contestId]) {
      localStorage.setItem(`${SUBMISSIONS_PREFIX}${contestId}`, JSON.stringify(DEFAULT_SUBMISSIONS[contestId]));
      return DEFAULT_SUBMISSIONS[contestId];
    }
    return [];
  } catch (e) {
    console.error("Failed to get contest submissions:", e);
    return DEFAULT_SUBMISSIONS[contestId] || [];
  }
}

export function getAllContestSubmissions(contestId?: string): ContestSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    if (contestId) {
      return getContestSubmissions(contestId);
    }
    const contests = getContests();
    const allSubs: ContestSubmission[] = [];
    contests.forEach((c) => {
      const subs = getContestSubmissions(c.id);
      allSubs.push(...subs);
    });
    return allSubs;
  } catch (e) {
    console.error("Failed to get all contest submissions:", e);
    return [];
  }
}

export function recordContestSubmission(submission: ContestSubmission): void {
  if (typeof window !== "undefined") {
    try {
      const key = `${SUBMISSIONS_PREFIX}${submission.contestId}`;
      const subs = getContestSubmissions(submission.contestId);
      subs.unshift(submission);
      localStorage.setItem(key, JSON.stringify(subs));
      window.dispatchEvent(new CustomEvent("codearena_contest_submission", { detail: submission }));
    } catch (e) {
      console.error("Failed to record contest submission locally:", e);
    }
  }

  // Push submission directly to Server API
  fetch(`/api/contests/${submission.contestId}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  }).catch((err) => console.warn("Failed to sync submission to server:", err));
}

export function getContestStandings(contestId: string): ContestStanding[] {
  const contest = getContestById(contestId);
  if (!contest) return [];

  const submissions = getContestSubmissions(contestId);
  const startTimeMs = new Date(contest.startTime).getTime();

  // Map of email -> Standing
  const userMap: Record<string, ContestStanding> = {};

  // Initialize with registered users if any
  (contest.registeredUsers || []).forEach((email) => {
    userMap[email] = {
      rank: 1,
      userEmail: email,
      userName: email.split("@")[0],
      score: 0,
      penaltyMinutes: 0,
      problemsSolved: 0,
      problemResults: {},
    };
  });

  // Seed with realistic demo contestants for lively contest feel
  const demoContestants = [
    { email: "alex.dev@gmail.com", name: "AlexDev", score: 800, penalty: 42, solved: 3 },
    { email: "sarah.coder@outlook.com", name: "SarahK", score: 600, penalty: 35, solved: 2 },
    { email: "vikram.singh@iit.ac.in", name: "VikramAlgo", score: 600, penalty: 48, solved: 2 },
    { email: "elena.rostova@yandex.ru", name: "ElenaR", score: 300, penalty: 18, solved: 1 },
  ];

  demoContestants.forEach((dc) => {
    if (!userMap[dc.email]) {
      userMap[dc.email] = {
        rank: 1,
        userEmail: dc.email,
        userName: dc.name,
        score: dc.score,
        penaltyMinutes: dc.penalty,
        problemsSolved: dc.solved,
        problemResults: {},
      };
    }
  });

  // Process real submissions
  submissions.forEach((sub) => {
    if (!userMap[sub.userEmail]) {
      userMap[sub.userEmail] = {
        rank: 1,
        userEmail: sub.userEmail,
        userName: sub.userName || sub.userEmail.split("@")[0],
        score: 0,
        penaltyMinutes: 0,
        problemsSolved: 0,
        problemResults: {},
      };
    }

    const u = userMap[sub.userEmail];
    if (!u.problemResults[sub.problemSlug]) {
      u.problemResults[sub.problemSlug] = {
        solved: false,
        attempts: 0,
        points: 0,
        timeMinutes: 0,
      };
    }

    const pRes = u.problemResults[sub.problemSlug];
    if (!pRes.solved) {
      pRes.attempts++;
      if (sub.status === "ACCEPTED") {
        pRes.solved = true;
        pRes.points = sub.score;
        const subTimeMs = new Date(sub.submittedAt).getTime();
        const elapsedMinutes = Math.max(1, Math.floor((subTimeMs - startTimeMs) / (60 * 1000)));
        pRes.timeMinutes = elapsedMinutes;

        u.score += sub.score;
        u.problemsSolved++;
        u.penaltyMinutes += elapsedMinutes + (pRes.attempts - 1) * 5;
      }
    }
  });

  // Convert to array and sort: score desc, penalty asc
  const standings = Object.values(userMap);
  standings.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.penaltyMinutes - b.penaltyMinutes;
  });

  // Assign ranks
  standings.forEach((s, i) => {
    s.rank = i + 1;
  });

  return standings;
}
