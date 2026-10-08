import { saveNotification, checkContest1HourReminders } from "./notifications";

export interface ContestProblem {
  problemSlug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  points: number;
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
  status: "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR";
  score: number;
  penaltyMinutes: number;
  submittedAt: string;
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
      { problemSlug: "two-sum", title: "Two Sum", difficulty: "EASY", points: 100 },
      { problemSlug: "container-with-most-water", title: "Container With Most Water", difficulty: "MEDIUM", points: 200 },
      { problemSlug: "coin-change", title: "Coin Change", difficulty: "MEDIUM", points: 300 },
      { problemSlug: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "HARD", points: 500 }
    ],
    participantsCount: 42,
    registeredUsers: ["admin@codearena.io", "alex.dev@gmail.com"],
    isRated: true,
    rules: [
      "No external AI coding assistance during the live window.",
      "Each incorrect submission incurs a 5-minute time penalty upon solving.",
      "Rankings are decided by total score, then lowest penalty time."
    ],
    createdAt: new Date().toISOString()
  }
];

export function getContests(): Contest[] {
  if (typeof window === "undefined") return DEFAULT_CONTESTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let contests: Contest[];
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTESTS));
      contests = DEFAULT_CONTESTS;
    } else {
      contests = JSON.parse(raw);
    }

    // Auto update status based on current time
    const now = Date.now();
    let updated = false;
    contests.forEach(c => {
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

      if (c.status !== newStatus && c.status !== "ENDED") {
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
    return DEFAULT_CONTESTS;
  }
}

export function getContestById(id: string): Contest | null {
  const contests = getContests();
  return contests.find(c => c.id === id) || null;
}

export function saveContest(contest: Contest): void {
  if (typeof window === "undefined") return;
  try {
    const contests = getContests();
    const idx = contests.findIndex(c => c.id === contest.id);
    const isNew = idx < 0;

    if (idx >= 0) {
      contests[idx] = contest;
    } else {
      contests.unshift(contest);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contests));
    window.dispatchEvent(new CustomEvent("codearena_contests_updated", { detail: contest }));

    // Send notifications if scheduled
    if (isNew) {
      const now = Date.now();
      const startTime = new Date(contest.startTime).getTime();
      const diffMins = (startTime - now) / (1000 * 60);

      if (contest.status === "LIVE" || diffMins <= 0) {
        saveNotification({
          title: "🟢 Contest is LIVE Now!",
          message: `'${contest.title}' is now live! Enter the arena and start solving challenges.`,
          type: "CONTEST_LIVE",
          contestId: contest.id,
          contestTitle: contest.title,
          actionUrl: `/contests/${contest.id}`
        });
      } else if (diffMins <= 60) {
        saveNotification({
          title: "⏰ Upcoming Contest: 1 Hour Alert!",
          message: `'${contest.title}' is scheduled to start in ${Math.round(diffMins)} minutes! Prepare your workspace.`,
          type: "CONTEST_1HOUR_ALERT",
          contestId: contest.id,
          contestTitle: contest.title,
          actionUrl: `/contests/${contest.id}`
        });
      } else {
        const startFormatted = new Date(contest.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        saveNotification({
          title: "📅 New Contest Scheduled",
          message: `'${contest.title}' scheduled for ${new Date(contest.startTime).toLocaleDateString()} at ${startFormatted}. You'll be notified 1 hour before it begins! Check your Gmail for confirmation.`,
          type: "CONTEST_SCHEDULED",
          contestId: contest.id,
          contestTitle: contest.title,
          actionUrl: `/contests`
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

            if (Array.isArray(contest.registeredUsers)) {
              contest.registeredUsers.forEach((email: string) => {
                if (email && email.includes("@") && !recipientMap.has(email)) {
                  recipientMap.set(email, email.split("@")[0]);
                }
              });
            }

            const recipients = Array.from(recipientMap.entries()).map(([email, name]) => ({ email, name }));
            const mailType = diffMins <= 60 && diffMins > 0 ? "CONTEST_1HOUR_REMINDER" : "CONTEST_SCHEDULED";
            dispatchContestEmail(mailType, contest, recipients);
          });
        });
      } catch (mailErr) {
        console.error("Failed to dispatch scheduled contest emails:", mailErr);
      }
    }
  } catch (e) {
    console.error("Failed to save contest:", e);
  }
}

export function clearAllContests(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent("codearena_contests_updated", { detail: { cleared: true } }));
  } catch (e) {
    console.error("Failed to clear contests:", e);
  }
}

export function deleteContest(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    let contests = getContests();
    const initialLen = contests.length;
    contests = contests.filter(c => c.id !== id);
    if (contests.length !== initialLen) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contests));
      window.dispatchEvent(new CustomEvent("codearena_contests_updated", { detail: { id, deleted: true } }));
      return true;
    }
  } catch (e) {
    console.error("Failed to delete contest:", e);
  }
  return false;
}

export function startContestNow(id: string): Contest | null {
  const contest = getContestById(id);
  if (!contest) return null;

  const now = new Date();
  const endTime = new Date(now.getTime() + contest.durationMinutes * 60 * 1000);

  contest.startTime = now.toISOString();
  contest.endTime = endTime.toISOString();
  contest.status = "LIVE";

  saveContest(contest);
  return contest;
}

export function endContestNow(id: string): Contest | null {
  const contest = getContestById(id);
  if (!contest) return null;

  contest.endTime = new Date().toISOString();
  contest.status = "ENDED";

  saveContest(contest);
  return contest;
}

export function registerUserForContest(contestId: string, email: string): boolean {
  const contest = getContestById(contestId);
  if (!contest) return false;

  if (!contest.registeredUsers.includes(email)) {
    contest.registeredUsers.push(email);
    contest.participantsCount = Math.max(contest.participantsCount + 1, contest.registeredUsers.length);
    saveContest(contest);
    return true;
  }
  return false;
}

export function getContestSubmissions(contestId: string): ContestSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${SUBMISSIONS_PREFIX}${contestId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to get contest submissions:", e);
    return [];
  }
}

export function recordContestSubmission(submission: ContestSubmission): void {
  if (typeof window === "undefined") return;
  try {
    const key = `${SUBMISSIONS_PREFIX}${submission.contestId}`;
    const subs = getContestSubmissions(submission.contestId);
    subs.push(submission);
    localStorage.setItem(key, JSON.stringify(subs));
    window.dispatchEvent(new CustomEvent("codearena_contest_submission", { detail: submission }));
  } catch (e) {
    console.error("Failed to record contest submission:", e);
  }
}

export function getContestStandings(contestId: string): ContestStanding[] {
  const contest = getContestById(contestId);
  if (!contest) return [];

  const submissions = getContestSubmissions(contestId);
  const startTimeMs = new Date(contest.startTime).getTime();

  // Map of email -> Standing
  const userMap: Record<string, ContestStanding> = {};

  // Initialize with registered users if any
  contest.registeredUsers.forEach(email => {
    userMap[email] = {
      rank: 1,
      userEmail: email,
      userName: email.split("@")[0],
      score: 0,
      penaltyMinutes: 0,
      problemsSolved: 0,
      problemResults: {}
    };
  });

  // Seed with realistic demo contestants for lively contest feel
  const demoContestants = [
    { email: "alex.dev@gmail.com", name: "AlexDev", score: 800, penalty: 42, solved: 3 },
    { email: "sarah.coder@outlook.com", name: "SarahK", score: 600, penalty: 35, solved: 2 },
    { email: "vikram.singh@iit.ac.in", name: "VikramAlgo", score: 600, penalty: 48, solved: 2 },
    { email: "elena.rostova@yandex.ru", name: "ElenaR", score: 300, penalty: 18, solved: 1 },
  ];

  demoContestants.forEach(dc => {
    if (!userMap[dc.email]) {
      userMap[dc.email] = {
        rank: 1,
        userEmail: dc.email,
        userName: dc.name,
        score: dc.score,
        penaltyMinutes: dc.penalty,
        problemsSolved: dc.solved,
        problemResults: {}
      };
    }
  });

  // Process real submissions
  submissions.forEach(sub => {
    if (!userMap[sub.userEmail]) {
      userMap[sub.userEmail] = {
        rank: 1,
        userEmail: sub.userEmail,
        userName: sub.userName || sub.userEmail.split("@")[0],
        score: 0,
        penaltyMinutes: 0,
        problemsSolved: 0,
        problemResults: {}
      };
    }

    const u = userMap[sub.userEmail];
    if (!u.problemResults[sub.problemSlug]) {
      u.problemResults[sub.problemSlug] = {
        solved: false,
        attempts: 0,
        points: 0,
        timeMinutes: 0
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
