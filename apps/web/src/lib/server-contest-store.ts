import fs from "fs";
import path from "path";
import { ProblemDefinition, PROBLEMS_DATABASE } from "./problems-data";

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
  submittedUsers?: string[]; // emails of students whose contest has been submitted
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

// Global in-memory server state preserved across Next.js API requests
declare global {
  var __codearena_server_contests_initialized: boolean | undefined;
  var __codearena_server_contests: Contest[] | undefined;
  var __codearena_server_submissions: Record<string, ContestSubmission[]> | undefined;
}

// Contests are empty by default - only exist when created/scheduled by admin
const DEFAULT_SERVER_CONTESTS: Contest[] = [];

const DEFAULT_SERVER_SUBMISSIONS: Record<string, ContestSubmission[]> = {};

// File persistence helper
const STORAGE_FILE = path.join(process.cwd(), ".data_contests.json");

function readFromFile(): { contests: Contest[]; initialized: boolean } | null {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {}
  return null;
}

function writeToFile(contests: Contest[]) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify({ contests, initialized: true }), "utf-8");
  } catch (e) {}
}

export function getOfficialScheduledContest(): Contest {
  const now = new Date();
  const daysUntilSunday = (7 - now.getUTCDay()) % 7 || 7;
  const sunday = new Date(now.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);
  sunday.setUTCHours(14, 0, 0, 0);
  const end = new Date(sunday.getTime() + 90 * 60 * 1000);

  return {
    id: "weekly-contest-42",
    title: "CodeArena Weekly Championship 42",
    description: "Official weekly competitive programming arena. 4 algorithmic challenges across Arrays, Dynamic Programming, and Graph Theory.",
    startTime: sunday.toISOString(),
    durationMinutes: 90,
    endTime: end.toISOString(),
    status: "UPCOMING",
    problems: [
      { problemSlug: "two-sum", title: "Two Sum", difficulty: "EASY", points: 100 },
      { problemSlug: "reverse-linked-list", title: "Reverse Linked List", difficulty: "EASY", points: 200 },
      { problemSlug: "maximum-subarray", title: "Maximum Subarray", difficulty: "MEDIUM", points: 300 },
      { problemSlug: "number-of-islands", title: "Number of Islands", difficulty: "MEDIUM", points: 400 },
    ],
    participantsCount: 0,
    registeredUsers: [],
    isRated: true,
    rules: [
      "Standard competitive programming rules apply.",
      "Each problem has a 2000ms time limit.",
      "Penalties are 10 minutes per rejected submission.",
      "Scores are verified and locked server-side upon contest end."
    ],
    createdAt: new Date().toISOString(),
  };
}

export function getServerContests(): Contest[] {
  if (!global.__codearena_server_contests_initialized) {
    const fromFile = readFromFile();
    if (fromFile && fromFile.initialized && Array.isArray(fromFile.contests) && fromFile.contests.length > 0) {
      // Purge any legacy dummy contest
      global.__codearena_server_contests = fromFile.contests.filter((c) => c.id !== "contest-weekly-clash-1");
      global.__codearena_server_contests_initialized = true;
      writeToFile(global.__codearena_server_contests);
    } else {
      const defaultContest = getOfficialScheduledContest();
      global.__codearena_server_contests = [defaultContest];
      global.__codearena_server_contests_initialized = true;
      writeToFile([defaultContest]);
    }
  }

  // Ensure legacy contest-weekly-clash-1 is never returned and contests never remain empty
  if (global.__codearena_server_contests) {
    const prevLength = global.__codearena_server_contests.length;
    global.__codearena_server_contests = global.__codearena_server_contests.filter((c) => c.id !== "contest-weekly-clash-1");
    if (global.__codearena_server_contests.length === 0) {
      const defaultContest = getOfficialScheduledContest();
      global.__codearena_server_contests = [defaultContest];
      writeToFile([defaultContest]);
    } else if (global.__codearena_server_contests.length !== prevLength) {
      writeToFile(global.__codearena_server_contests);
    }
  }
  
  // Re-evaluate statuses dynamically while preserving "ENDED"
  const now = Date.now();
  global.__codearena_server_contests = (global.__codearena_server_contests || []).map((c) => {
    if (c.status === "ENDED") {
      return c;
    }
    const start = new Date(c.startTime).getTime();
    const end = new Date(c.endTime).getTime();
    let status: "UPCOMING" | "LIVE" | "ENDED" = c.status;
    if (now >= end) {
      status = "ENDED";
    } else if (now >= start) {
      status = "LIVE";
    } else {
      status = "UPCOMING";
    }
    return { ...c, status };
  });

  return global.__codearena_server_contests;
}

export function saveServerContest(contest: Contest): Contest {
  const current = getServerContests();
  const existingIdx = current.findIndex((c) => c.id === contest.id);
  if (existingIdx >= 0) {
    current[existingIdx] = { ...current[existingIdx], ...contest };
  } else {
    current.unshift(contest);
  }
  global.__codearena_server_contests = current;
  global.__codearena_server_contests_initialized = true;
  writeToFile(current);
  return contest;
}

const SUBMISSIONS_FILE = path.join(process.cwd(), ".data_contest_submissions.json");

function readSubmissionsFromFile(): Record<string, ContestSubmission[]> {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const raw = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {}
  return {};
}

function writeSubmissionsToFile(subs: Record<string, ContestSubmission[]>) {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(subs, null, 2), "utf-8");
  } catch (e) {}
}

export function deleteServerContest(id: string): boolean {
  const current = getServerContests();
  const filtered = current.filter((c) => c.id !== id);
  global.__codearena_server_contests = filtered;
  global.__codearena_server_contests_initialized = true;
  writeToFile(filtered);
  if (!global.__codearena_server_submissions) {
    global.__codearena_server_submissions = readSubmissionsFromFile();
  }
  if (global.__codearena_server_submissions[id]) {
    delete global.__codearena_server_submissions[id];
    writeSubmissionsToFile(global.__codearena_server_submissions);
  }
  return true;
}

export function clearAllServerContests(): void {
  global.__codearena_server_contests = [];
  global.__codearena_server_contests_initialized = true;
  global.__codearena_server_submissions = {};
  writeToFile([]);
  writeSubmissionsToFile({});
}

export function getServerSubmissions(contestId: string): ContestSubmission[] {
  if (!global.__codearena_server_submissions) {
    global.__codearena_server_submissions = readSubmissionsFromFile();
  }
  return global.__codearena_server_submissions[contestId] || [];
}

export function saveServerSubmission(sub: ContestSubmission): ContestSubmission {
  if (!global.__codearena_server_submissions) {
    global.__codearena_server_submissions = readSubmissionsFromFile();
  }
  if (!global.__codearena_server_submissions[sub.contestId]) {
    global.__codearena_server_submissions[sub.contestId] = [];
  }
  global.__codearena_server_submissions[sub.contestId] = [
    sub,
    ...global.__codearena_server_submissions[sub.contestId].filter((s) => s.id !== sub.id),
  ];
  writeSubmissionsToFile(global.__codearena_server_submissions);
  return sub;
}
