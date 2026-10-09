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

const DEFAULT_SERVER_CONTESTS: Contest[] = [
  {
    id: "contest-weekly-clash-1",
    title: "CodeArena Bi-Weekly Clash #1",
    description: "Compete against engineers worldwide in our bi-weekly algorithm challenge. 4 algorithmic challenges from Easy to Hard.",
    startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
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

const DEFAULT_SERVER_SUBMISSIONS: Record<string, ContestSubmission[]> = {
  "contest-weekly-clash-1": [
    {
      id: "sub_server_1",
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
    },
    {
      id: "sub_server_2",
      contestId: "contest-weekly-clash-1",
      userEmail: "alex.dev@gmail.com",
      userName: "Alex Dev",
      problemSlug: "container-with-most-water",
      problemTitle: "Container With Most Water",
      language: "javascript",
      code: `var maxArea = function(height) {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;
    while (left < right) {
        const currentWater = Math.min(height[left], height[right]) * (right - left);
        maxWater = Math.max(maxWater, currentWater);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxWater;
};`,
      runtime: "62 ms",
      memory: "49.3 MB",
      passedTestCases: 12,
      totalTestCases: 12,
      status: "ACCEPTED",
      score: 200,
      penaltyMinutes: 22,
      submittedAt: new Date(Date.now() - 32 * 60 * 1000).toISOString()
    }
  ]
};

export function getServerContests(): Contest[] {
  if (!global.__codearena_server_contests_initialized) {
    global.__codearena_server_contests = [...DEFAULT_SERVER_CONTESTS];
    global.__codearena_server_contests_initialized = true;
  }
  
  // Re-evaluate statuses dynamically while respecting forced "ENDED"
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
  if (!global.__codearena_server_contests_initialized) {
    global.__codearena_server_contests = [...DEFAULT_SERVER_CONTESTS];
    global.__codearena_server_contests_initialized = true;
  }
  const current = global.__codearena_server_contests || [];
  const existingIdx = current.findIndex((c) => c.id === contest.id);
  if (existingIdx >= 0) {
    current[existingIdx] = { ...current[existingIdx], ...contest };
  } else {
    current.unshift(contest);
  }
  global.__codearena_server_contests = current;
  return contest;
}

export function deleteServerContest(id: string): boolean {
  global.__codearena_server_contests_initialized = true;
  const current = getServerContests();
  const filtered = current.filter((c) => c.id !== id);
  global.__codearena_server_contests = filtered;
  if (global.__codearena_server_submissions) {
    delete global.__codearena_server_submissions[id];
  }
  return true;
}

export function clearAllServerContests(): void {
  global.__codearena_server_contests = [];
  global.__codearena_server_contests_initialized = true;
  global.__codearena_server_submissions = {};
}

export function getServerSubmissions(contestId: string): ContestSubmission[] {
  if (!global.__codearena_server_submissions) {
    global.__codearena_server_submissions = { ...DEFAULT_SERVER_SUBMISSIONS };
  }
  return global.__codearena_server_submissions[contestId] || [];
}

export function saveServerSubmission(sub: ContestSubmission): ContestSubmission {
  if (!global.__codearena_server_submissions) {
    global.__codearena_server_submissions = { ...DEFAULT_SERVER_SUBMISSIONS };
  }
  if (!global.__codearena_server_submissions[sub.contestId]) {
    global.__codearena_server_submissions[sub.contestId] = [];
  }
  global.__codearena_server_submissions[sub.contestId].unshift(sub);
  return sub;
}
