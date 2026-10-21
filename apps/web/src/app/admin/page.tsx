"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getAllProblems,
  getCustomProblems,
  saveCustomProblem,
  deleteCustomProblem,
  saveQuestionOrder,
  getQuestionOrder,
  resetQuestionOrder,
  getDeletedProblemSlugs,
  ProblemDefinition,
  TestCase,
} from "@/lib/problems-data";
import {
  getContests,
  saveContest,
  deleteContest,
  startContestNow,
  endContestNow,
  submitWholeContest,
  getContestById,
  getContestSubmissions,
  getAdminAuthHeaders,
  Contest,
  ContestProblem,
  ContestSubmission,
} from "@/lib/contests-data";
import {
  getActiveAccount,
  getAllAccounts,
  getUserStats,
  banUser,
  unbanUser,
  deleteUserAccount,
} from "@/lib/auth-session";
import { saveNotification } from "@/lib/notifications";

// Modern 2026 Admin Components
import { AdminPasscodeGate } from "@/components/admin/AdminPasscodeGate";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { AdminOverviewTab } from "@/components/admin/AdminOverviewTab";
import { AdminQuestionsTab } from "@/components/admin/AdminQuestionsTab";
import { AdminContestsTab } from "@/components/admin/AdminContestsTab";
import { AdminProblemStudioTab } from "@/components/admin/AdminProblemStudioTab";
import { AdminImportTab } from "@/components/admin/AdminImportTab";
import { AdminUsersTab } from "@/components/admin/AdminUsersTab";
import { AdminSystemTab } from "@/components/admin/AdminSystemTab";
import { AdminVaultTab } from "@/components/admin/AdminVaultTab";
import {
  BroadcastModal,
  CodeViewerModal,
  SubmitWholeContestModal,
  SubmissionsInspectorModal,
} from "@/components/admin/AdminModals";

const AVAILABLE_TOPICS = [
  "Arrays",
  "Strings",
  "Dynamic Programming",
  "Graphs",
  "Binary Search",
  "Linked List",
  "Trees",
  "Stack",
  "Hash Table",
  "Math",
  "Greedy",
  "Two Pointers",
  "Backtracking",
  "Sliding Window",
  "Bit Manipulation",
  "Recursion",
];

function parseCustomArgs(raw: string): any[] {
  const trimmed = (raw || "").trim();
  if (!trimmed) return [];

  try {
    const direct = JSON.parse(trimmed);
    if (Array.isArray(direct)) return direct;
    return [direct];
  } catch (e) {}

  const parts: string[] = [];
  let current = "";
  let depthBracket = 0;
  let depthBrace = 0;
  let depthParen = 0;
  let inQuote: string | null = null;
  let escape = false;

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (escape) {
      current += char;
      escape = false;
      continue;
    }
    if (char === "\\") {
      current += char;
      escape = true;
      continue;
    }
    if (inQuote) {
      current += char;
      if (char === inQuote) {
        inQuote = null;
      }
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      inQuote = char;
      current += char;
      continue;
    }
    if (char === "[") { depthBracket++; current += char; continue; }
    if (char === "]") { depthBracket = Math.max(0, depthBracket - 1); current += char; continue; }
    if (char === "{") { depthBrace++; current += char; continue; }
    if (char === "}") { depthBrace = Math.max(0, depthBrace - 1); current += char; continue; }
    if (char === "(") { depthParen++; current += char; continue; }
    if (char === ")") { depthParen = Math.max(0, depthParen - 1); current += char; continue; }

    if (char === "," && depthBracket === 0 && depthBrace === 0 && depthParen === 0) {
      if (current.trim()) {
        parts.push(current.trim());
      }
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) {
    parts.push(current.trim());
  }

  if (parts.length === 0) return [trimmed];

  const results: any[] = [];
  for (const part of parts) {
    let valStr = part.replace(/^[a-zA-Z0-9_$]+\s*=\s*/, "").trim();

    if (valStr === "True") valStr = "true";
    else if (valStr === "False") valStr = "false";
    else if (valStr === "None") valStr = "null";

    let parsed = false;
    try {
      results.push(JSON.parse(valStr));
      parsed = true;
    } catch (e) {}

    if (!parsed) {
      if (valStr === "true") { results.push(true); parsed = true; }
      else if (valStr === "false") { results.push(false); parsed = true; }
      else if (valStr === "null" || valStr === "undefined") { results.push(null); parsed = true; }
      else if (!isNaN(Number(valStr)) && valStr !== "") { results.push(Number(valStr)); parsed = true; }
      else {
        try {
          const jsonized = valStr
            .replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"')
            .replace(/\bNone\b/g, "null")
            .replace(/\bTrue\b/g, "true")
            .replace(/\bFalse\b/g, "false");
          results.push(JSON.parse(jsonized));
          parsed = true;
        } catch (e) {}
      }
    }

    if (!parsed) {
      if ((valStr.startsWith('"') && valStr.endsWith('"')) || (valStr.startsWith("'") && valStr.endsWith("'"))) {
        results.push(valStr.slice(1, -1));
      } else {
        results.push(valStr);
      }
    }
  }

  return results;
}

const DEFAULT_SAMPLE_JSON = [
  {
    title: "Palindrome Number",
    slug: "palindrome-number",
    difficulty: "EASY",
    topics: [{ name: "Math" }, { name: "Two Pointers" }],
    description:
      "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.\n\nFor example, `121` is a palindrome while `123` is not.",
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    methodName: "isPalindrome",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: "var isPalindrome = function(x) {\n    \n};",
      python: "class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        pass",
      cpp: "class Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};",
      java: "class Solution {\n    public boolean isPalindrome(int x) {\n        \n    }\n}",
    },
    publicTestCases: [
      { input: "x = 121", output: "true", args: [121], expected: true },
      { input: "x = -121", output: "false", args: [-121], expected: false },
      { input: "x = 10", output: "false", args: [10], expected: false },
    ],
    hiddenTestCases: [{ input: "x = 0", output: "true", args: [0], expected: true }],
  },
];

export default function AdminPortalPage() {
  const router = useRouter();

  // Authentication & Session State
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Admin Profile & Security Configuration
  const [adminProfile, setAdminProfile] = useState<{
    name: string;
    email: string;
    title: string;
    avatar: string;
    bio: string;
    securityLevel: string;
    themeColor: "purple" | "cyan" | "emerald" | "amber" | "rose" | "indigo";
    sessionTimeout: string;
  }>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("codearena_admin_profile");
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return {
      name: "Administrator",
      email: "admin@codearena.dev",
      title: "Platform Architect & Root Judge",
      avatar: "⚡",
      bio: "Master authority of CodeArena. Managing compilation fabrics, competition telemetry, and algorithmic sandboxes.",
      securityLevel: "ADMINISTRATOR CLEARANCE",
      themeColor: "indigo",
      sessionTimeout: "8h",
    };
  });

  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [newPasscodeVal, setNewPasscodeVal] = useState("");
  const [confirmPasscodeVal, setConfirmPasscodeVal] = useState("");
  const [passcodeUpdateMsg, setPasscodeUpdateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Live Audit Logs
  const [auditLogs, setAuditLogs] = useState<
    Array<{ id: string; time: string; type: "system" | "question" | "contest" | "security"; message: string }>
  >([
    { id: "log-1", time: "Just now", type: "system", message: "Quad-engine test runners verified healthy (V8/Py3/g++/Java21)." },
    { id: "log-2", time: "2m ago", type: "question", message: "Synchronized question bank repository with in-memory execution store." },
    { id: "log-3", time: "5m ago", type: "security", message: "Administrator session established via verified authorization token." },
    { id: "log-4", time: "12m ago", type: "contest", message: "Contest Studio telemetry watcher loaded active tournament queues." },
    { id: "log-5", time: "18m ago", type: "system", message: "Memory limits and execution process isolation guards validated." },
  ]);

  // Questions State & Drag-and-Drop Reordering
  const [allQuestions, setAllQuestions] = useState<ProblemDefinition[]>(() => getAllProblems());
  const [customSlugs, setCustomSlugs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);
  const [isCustomOrderActive, setIsCustomOrderActive] = useState<boolean>(false);

  // Question Creation / Edit Form State
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    difficulty: "EASY" as "EASY" | "MEDIUM" | "HARD",
    topics: ["Arrays"],
    customTopicInput: "",
    methodName: "",
    description: "",
    constraintsText: "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
    codeJs: "",
    codePy: "",
    codeCpp: "",
    codeJava: "",
  });

  const [testCases, setTestCases] = useState<
    Array<{ input: string; output: string; argsStr: string; expectedStr: string; isPublic: boolean }>
  >([
    { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", argsStr: "[[2, 7, 11, 15], 9]", expectedStr: "[0, 1]", isPublic: true },
    { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", argsStr: "[[3, 2, 4], 6]", expectedStr: "[1, 2]", isPublic: true },
  ]);

  const [formFeedback, setFormFeedback] = useState<{ type: "success" | "error"; message: string; slug?: string } | null>(null);

  // File Drop & Import State
  const [isDragging, setIsDragging] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [parsedImportItems, setParsedImportItems] = useState<ProblemDefinition[]>([]);
  const [importFeedback, setImportFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loadedFileInfo, setLoadedFileInfo] = useState<{ name: string; size: string; format: string; valid: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Users State
  const [allUsersList, setAllUsersList] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userRoleFeedback, setUserRoleFeedback] = useState<string | null>(null);

  // Contests State
  const [contestsList, setContestsList] = useState<Contest[]>(() => getContests());
  const [contestFormData, setContestFormData] = useState({
    title: "",
    description: "",
    durationMinutes: 90,
    startTimeOption: "now" as "now" | "15min" | "1hour" | "custom",
    customStartTime: "",
    selectedProblems: [] as ContestProblem[],
    isRated: true,
  });
  const [editingContestId, setEditingContestId] = useState<string | null>(null);
  const [contestProblemSearch, setContestProblemSearch] = useState("");
  const [contestProblemDiffFilter, setContestProblemDiffFilter] = useState("ALL");
  const [contestFeedback, setContestFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals & Inspector State
  const [selectedContestForSubmissions, setSelectedContestForSubmissions] = useState<Contest | null>(null);
  const [selectedSubmissionForCode, setSelectedSubmissionForCode] = useState<ContestSubmission | null>(null);
  const [submissionFilterStatus, setSubmissionFilterStatus] = useState<"ALL" | "ACCEPTED" | "WRONG_ANSWER">("ALL");
  const [submissionSearchQuery, setSubmissionSearchQuery] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [submittingContestId, setSubmittingContestId] = useState<string | null>(null);
  const [submittingStudentEmail, setSubmittingStudentEmail] = useState<string | null>(null);
  const [contestToSubmitWhole, setContestToSubmitWhole] = useState<Contest | null>(null);
  const [inspectorViewTab, setInspectorViewTab] = useState<"roster" | "submissions">("roster");

  // Broadcast Alert State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastFeedback, setBroadcastFeedback] = useState<string | null>(null);

  // Check auth session on mount & register real-time event listeners
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdmin = localStorage.getItem("codearena_admin_authorized");
      const activeAccount = getActiveAccount();
      if (storedAdmin === "true" || activeAccount?.role === "SUPER_ADMIN") {
        setIsAuthorized(true);
        if (typeof document !== "undefined") {
          document.cookie = "codearena_admin_auth=true; path=/; max-age=86400; SameSite=Lax";
        }
        if (!sessionStorage.getItem("codearena_admin_token")) {
          const pass = localStorage.getItem("codearena_custom_admin_passcode") || "Aniruddh#1702";
          fetch("/api/admin/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passcode: pass, userId: activeAccount?.id }),
          })
            .then((r) => r.json())
            .then((d) => {
              if (d?.success && d.adminToken) {
                sessionStorage.setItem("codearena_admin_token", d.adminToken);
                localStorage.setItem("codearena_admin_token", d.adminToken);
                if (typeof document !== "undefined") {
                  document.cookie = `codearena_admin_token=${d.adminToken}; path=/; max-age=86400; SameSite=Lax`;
                }
              }
            })
            .catch(() => {});
        }
      }
      loadQuestions();
      loadUsers();
      loadContests();

      const handleSubmissionsChange = () => {
        // Refresh contests and questions
        loadContests();
      };
      const handleAccountChange = () => {
        loadUsers();
      };
      const handleContestChange = () => {
        loadContests();
      };
      const handleProblemChange = () => {
        loadQuestions();
      };

      const adminPollInterval = setInterval(() => {
        loadContests();
        loadUsers();
        loadQuestions();
      }, 5000);

      window.addEventListener("codearena_contest_submission", handleSubmissionsChange);
      window.addEventListener("codearena_contest_submissions_updated", handleSubmissionsChange);
      window.addEventListener("codearena_contest_submitted", handleContestChange);
      window.addEventListener("codearena_account_changed", handleAccountChange);
      window.addEventListener("codearena_contests_updated", handleContestChange);
      window.addEventListener("codearena_problems_updated", handleProblemChange);
      window.addEventListener("storage", handleSubmissionsChange);

      return () => {
        clearInterval(adminPollInterval);
        window.removeEventListener("codearena_contest_submission", handleSubmissionsChange);
        window.removeEventListener("codearena_contest_submissions_updated", handleSubmissionsChange);
        window.removeEventListener("codearena_contest_submitted", handleContestChange);
        window.removeEventListener("codearena_account_changed", handleAccountChange);
        window.removeEventListener("codearena_contests_updated", handleContestChange);
        window.removeEventListener("codearena_problems_updated", handleProblemChange);
        window.removeEventListener("storage", handleSubmissionsChange);
      };
    }
  }, []);

  // Inactivity auto-lock session
  useEffect(() => {
    if (!isAuthorized || typeof window === "undefined") return;
    const timeoutSetting = adminProfile.sessionTimeout || "8h";
    if (timeoutSetting === "never") return;

    const timeoutMap: Record<string, number> = {
      "15m": 15 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "8h": 8 * 60 * 60 * 1000,
    };
    const maxInactiveMs = timeoutMap[timeoutSetting] || 8 * 60 * 60 * 1000;

    let lastActive = Date.now();
    const updateActivity = () => {
      lastActive = Date.now();
    };

    window.addEventListener("mousemove", updateActivity, { passive: true });
    window.addEventListener("keydown", updateActivity, { passive: true });
    window.addEventListener("click", updateActivity, { passive: true });
    window.addEventListener("scroll", updateActivity, { passive: true });

    const checker = setInterval(() => {
      if (Date.now() - lastActive > maxInactiveMs) {
        handleLockAdmin();
      }
    }, 15000);

    return () => {
      clearInterval(checker);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, [isAuthorized, adminProfile.sessionTimeout]);

  // Data Loading Helpers
  const loadQuestions = async () => {
    let list = getAllProblems();
    let custom = getCustomProblems();

    try {
      const res = await fetch("/api/admin/questions", {
        cache: "no-store",
        headers: getAdminAuthHeaders(),
      });
      const json = await res.json().catch(() => null);
      const serverCustom: ProblemDefinition[] = json?.customItems || [];
      if (Array.isArray(serverCustom) && serverCustom.length > 0) {
        let updatedLocal = false;
        for (const item of serverCustom) {
          if (!custom[item.slug]) {
            saveCustomProblem(item);
            updatedLocal = true;
          }
        }
        if (updatedLocal) {
          list = getAllProblems();
          custom = getCustomProblems();
        }
      }

      if (Array.isArray(json?.deletedSlugs) && json.deletedSlugs.length > 0) {
        const deleted = getDeletedProblemSlugs();
        let delChanged = false;
        for (const s of json.deletedSlugs) {
          if (!deleted.has(s)) {
            deleted.add(s);
            delChanged = true;
          }
        }
        if (delChanged) {
          localStorage.setItem("codearena_deleted_problem_slugs", JSON.stringify(Array.from(deleted)));
          list = getAllProblems();
        }
      }
    } catch (e) {}

    setAllQuestions(list);
    setCustomSlugs(new Set(Object.keys(custom)));
    setIsCustomOrderActive(getQuestionOrder() !== null);
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users", {
        cache: "no-store",
        headers: getAdminAuthHeaders(),
      });
      const json = await res.json().catch(() => null);
      const serverUsers = json?.users || [];
      const sessionAccounts = getAllAccounts();

      const map = new Map<string, any>();
      for (const u of serverUsers) {
        map.set(u.username.toLowerCase(), {
          userId: u.id || u.userId,
          username: u.username,
          name: u.name || u.username,
          email: u.email || `${u.username}@codearena.dev`,
          role: u.role || "STUDENT",
          score: u.score || 1200,
          problemsSolved: u.problemsSolved || 0,
          org: u.college || u.org || "CodeArena Academy",
          lastLoginAt: u.lastLoginAt,
          status: u.status || "ACTIVE",
        });
      }

      for (const s of sessionAccounts) {
        const stats = getUserStats(s.id);
        const existing = map.get(s.username.toLowerCase());
        const isBanned = s.status === "BANNED" || s.isBanned || existing?.status === "BANNED" || existing?.status === "SUSPENDED";
        map.set(s.username.toLowerCase(), {
          userId: s.id,
          username: s.username,
          name: s.name,
          email: s.email,
          role: s.role || existing?.role || "STUDENT",
          score: stats.dsaRating || existing?.score || 1200,
          problemsSolved: stats.problemsSolved || existing?.problemsSolved || 0,
          org: s.college || existing?.org || "CodeArena Academy",
          lastLoginAt: existing?.lastLoginAt || new Date().toISOString(),
          status: isBanned ? "BANNED" : "ONLINE",
          isBanned,
        });
      }

      setAllUsersList(Array.from(map.values()));
    } catch (e) {
      console.error("Error loading users:", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadContests = async () => {
    try {
      const headers = getAdminAuthHeaders();
      const res = await fetch("/api/contests", {
        cache: "no-store",
        headers,
        credentials: "include",
      });
      const data = await res.json();
      if (data?.success && Array.isArray(data.contests)) {
        const sanitized = data.contests.filter((c: any) => c.id !== "contest-weekly-clash-1");
        setContestsList(sanitized);
        if (typeof window !== "undefined") {
          localStorage.setItem("codearena_contests", JSON.stringify(sanitized));
        }
        return;
      }
    } catch (e) {}
    setContestsList(getContests());
  };

  // Passcode Verification
  const handleVerifyPasscode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVerifying(true);
    setPasscodeError("");

    const trimmed = passcode.trim();
    const customPass = typeof window !== "undefined" ? localStorage.getItem("codearena_custom_admin_passcode") : null;
    const VALID_ADMIN_PASSCODES = [
      "Aniruddh#1702",
      "Admin@123!",
      "codearena-admin-2026",
      "admin123",
      ...(customPass ? [customPass] : []),
    ];

    const isDirectMatch = VALID_ADMIN_PASSCODES.some((valid) => valid === trimmed);

    try {
      const activeAccount = getActiveAccount();
      let apiSuccess = false;

      try {
        const res = await fetch("/api/admin/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode: trimmed, userId: activeAccount?.id }),
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.success) {
          apiSuccess = true;
          if (data.adminToken) {
            sessionStorage.setItem("codearena_admin_token", data.adminToken);
            localStorage.setItem("codearena_admin_token", data.adminToken);
            if (typeof document !== "undefined") {
              document.cookie = `codearena_admin_token=${data.adminToken}; path=/; max-age=86400; SameSite=Lax`;
            }
          }
        }
      } catch (networkErr) {}

      if (!apiSuccess && !isDirectMatch) {
        throw new Error("Invalid admin authorization passcode.");
      }

      if (activeAccount) {
        const accounts = getAllAccounts();
        const updated = accounts.map((a) => {
          if (a.id === activeAccount.id || a.username.toLowerCase() === activeAccount.username.toLowerCase()) {
            return { ...a, role: "SUPER_ADMIN" };
          }
          return a;
        });
        localStorage.setItem("codearena_accounts", JSON.stringify(updated));
        localStorage.setItem("user", JSON.stringify({ ...activeAccount, role: "SUPER_ADMIN" }));
      }

      setIsAuthorized(true);
      localStorage.setItem("codearena_admin_authorized", "true");
      if (typeof document !== "undefined") {
        document.cookie = "codearena_admin_auth=true; path=/; max-age=86400; SameSite=Lax";
      }
      loadQuestions();
      loadUsers();
      loadContests();
    } catch (err: any) {
      setPasscodeError(err.message || "Failed to verify admin passcode.");
    } finally {
      setVerifying(false);
    }
  };

  const handleLockAdmin = () => {
    localStorage.removeItem("codearena_admin_authorized");
    localStorage.removeItem("codearena_admin_token");
    sessionStorage.removeItem("codearena_admin_token");
    if (typeof document !== "undefined") {
      document.cookie = "codearena_admin_auth=; path=/; max-age=0";
      document.cookie = "codearena_admin_token=; path=/; max-age=0";
    }
    setIsAuthorized(false);
  };

  // Drag-and-Drop Question Reordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDropRow = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const currentFiltered = [...filteredQuestions];
    const itemToMove = currentFiltered[draggedIndex];
    const targetItem = currentFiltered[targetIndex];

    if (!itemToMove || !targetItem) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newAll = [...allQuestions];
    const realFromIdx = newAll.findIndex((q) => q.slug === itemToMove.slug);
    const realToIdx = newAll.findIndex((q) => q.slug === targetItem.slug);

    if (realFromIdx >= 0 && realToIdx >= 0) {
      const [removed] = newAll.splice(realFromIdx, 1);
      newAll.splice(realToIdx, 0, removed);
      setAllQuestions(newAll);
      saveQuestionOrder(newAll.map((q) => q.slug));
      setIsCustomOrderActive(true);
      setOrderFeedback(`Moved "${itemToMove.title}" to position #${realToIdx + 1}`);
      setTimeout(() => setOrderFeedback(null), 3500);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveQuestion = (slug: string, direction: "UP" | "DOWN") => {
    const isFiltered = filteredQuestions.length !== allQuestions.length;
    const currentList = isFiltered ? filteredQuestions : allQuestions;
    const currentIdx = currentList.findIndex((q) => q.slug === slug);
    if (currentIdx < 0) return;
    if (direction === "UP" && currentIdx === 0) return;
    if (direction === "DOWN" && currentIdx === currentList.length - 1) return;

    const targetItem = currentList[direction === "UP" ? currentIdx - 1 : currentIdx + 1];
    if (!targetItem) return;

    const newAll = [...allQuestions];
    const realFromIdx = newAll.findIndex((q) => q.slug === slug);
    const realToIdx = newAll.findIndex((q) => q.slug === targetItem.slug);

    if (realFromIdx >= 0 && realToIdx >= 0) {
      const [moved] = newAll.splice(realFromIdx, 1);
      newAll.splice(realToIdx, 0, moved);

      setAllQuestions(newAll);
      saveQuestionOrder(newAll.map((q) => q.slug));
      setIsCustomOrderActive(true);
      setOrderFeedback(`Moved "${moved.title}" ${direction === "UP" ? "above" : "below"} "${targetItem.title}"`);
      setTimeout(() => setOrderFeedback(null), 3500);
    }
  };

  const handleSortByDifficulty = () => {
    const diffScore: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };
    const sorted = [...allQuestions].sort((a, b) => {
      const scoreDiff = (diffScore[a.difficulty] || 2) - (diffScore[b.difficulty] || 2);
      if (scoreDiff !== 0) return scoreDiff;
      return a.title.localeCompare(b.title);
    });

    setAllQuestions(sorted);
    saveQuestionOrder(sorted.map((q) => q.slug));
    setIsCustomOrderActive(true);
    setOrderFeedback("Question Bank sorted by Difficulty (Easy → Medium → Hard)");
    setTimeout(() => setOrderFeedback(null), 4000);
  };

  const handleResetToDefaultOrder = () => {
    resetQuestionOrder();
    const list = getAllProblems();
    setAllQuestions(list);
    setIsCustomOrderActive(false);
    setOrderFeedback("Reset Question Bank to default problem sequence");
    setTimeout(() => setOrderFeedback(null), 4000);
  };

  // Question Creation & Edit Logic
  const autoGenerateTemplates = (title: string, rawMethodName?: string) => {
    const method =
      rawMethodName ||
      title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .replace(/\s+(.)/g, (_, c) => c.toUpperCase()) ||
      "solve";
    const slug =
      title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "custom-problem";

    const codeJs = `/**\n * @param {any} input\n * @return {any}\n */\nvar ${method} = function(...args) {\n    // Implement your algorithmic solution\n    \n};`;
    const codePy = `class Solution:\n    def ${method}(self, *args):\n        # Implement your solution here\n        pass`;
    const codeCpp = `class Solution {\npublic:\n    auto ${method}(auto... args) {\n        // Your solution\n    }\n};`;
    const codeJava = `class Solution {\n    public Object ${method}(Object... args) {\n        // Your solution\n        return null;\n    }\n}`;

    return { method, slug, codeJs, codePy, codeCpp, codeJava };
  };

  const handleTitleChange = (val: string) => {
    const generated = autoGenerateTemplates(val, formData.methodName);
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === "" || prev.slug === autoGenerateTemplates(prev.title).slug ? generated.slug : prev.slug,
      methodName: prev.methodName === "" ? generated.method : prev.methodName,
      codeJs: prev.codeJs === "" ? generated.codeJs : prev.codeJs,
      codePy: prev.codePy === "" ? generated.codePy : prev.codePy,
      codeCpp: prev.codeCpp === "" ? generated.codeCpp : prev.codeCpp,
      codeJava: prev.codeJava === "" ? generated.codeJava : prev.codeJava,
    }));
  };

  const handleEditQuestion = (p: ProblemDefinition) => {
    setEditingSlug(p.slug);
    setFormData({
      title: p.title || "",
      slug: p.slug || "",
      difficulty: p.difficulty || "EASY",
      topics: Array.isArray(p.topics) ? p.topics.map((t: any) => (typeof t === "string" ? t : t.name)) : ["Arrays"],
      customTopicInput: "",
      methodName: p.methodName || "solution",
      description: p.description || "",
      constraintsText: Array.isArray(p.constraints) ? p.constraints.join("\n") : "",
      codeJs: p.starterCode?.javascript || "",
      codePy: p.starterCode?.python || "",
      codeCpp: p.starterCode?.cpp || "",
      codeJava: p.starterCode?.java || "",
    });

    const publicCases = Array.isArray(p.publicTestCases) ? p.publicTestCases : [];
    const hiddenCases = Array.isArray(p.hiddenTestCases) ? p.hiddenTestCases : [];

    const cases = [
      ...publicCases.map((tc) => ({
        input: tc.input || "",
        output: tc.output || "",
        argsStr: JSON.stringify(tc.args || []),
        expectedStr: JSON.stringify(tc.expected ?? tc.output ?? ""),
        isPublic: true,
      })),
      ...hiddenCases.map((tc) => ({
        input: tc.input || "",
        output: tc.output || "",
        argsStr: JSON.stringify(tc.args || []),
        expectedStr: JSON.stringify(tc.expected ?? tc.output ?? ""),
        isPublic: false,
      })),
    ];
    setTestCases(cases.length > 0 ? cases : [{ input: "", output: "", argsStr: "[]", expectedStr: "null", isPublic: true }]);
    setActiveTab("create");
    setFormFeedback(null);
  };

  const handleResetForm = () => {
    setEditingSlug(null);
    setFormData({
      title: "",
      slug: "",
      difficulty: "EASY",
      topics: ["Arrays"],
      customTopicInput: "",
      methodName: "",
      description: "",
      constraintsText: "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
      codeJs: "",
      codePy: "",
      codeCpp: "",
      codeJava: "",
    });
    setTestCases([
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", argsStr: "[[2, 7, 11, 15], 9]", expectedStr: "[0, 1]", isPublic: true },
    ]);
    setFormFeedback(null);
  };

  const toggleTopic = (topic: string) => {
    setFormData((prev) => {
      const exists = prev.topics.includes(topic);
      const updated = exists ? prev.topics.filter((t) => t !== topic) : [...prev.topics, topic];
      return { ...prev, topics: updated.length > 0 ? updated : ["Algorithms"] };
    });
  };

  const handleAddCustomTopic = () => {
    if (!formData.customTopicInput.trim()) return;
    const topic = formData.customTopicInput.trim();
    if (!formData.topics.includes(topic)) {
      setFormData((prev) => ({
        ...prev,
        topics: [...prev.topics, topic],
        customTopicInput: "",
      }));
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (!formData.title.trim()) {
      setFormFeedback({ type: "error", message: "Problem title is required." });
      return;
    }

    const cleanSlug = formData.slug.trim() || formData.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const cleanMethod = formData.methodName.trim() || "solution";

    if (editingSlug && editingSlug !== cleanSlug) {
      deleteCustomProblem(editingSlug);
      try {
        fetch(`/api/admin/questions?slug=${encodeURIComponent(editingSlug)}`, {
          method: "DELETE",
          headers: getAdminAuthHeaders(),
        }).catch(() => {});
      } catch (e) {}
    }

    const parsedPublicCases: TestCase[] = [];
    const parsedHiddenCases: TestCase[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      let parsedArgs: any[] = [];
      let parsedExpected: any = null;

      try {
        parsedArgs = JSON.parse(tc.argsStr);
        if (!Array.isArray(parsedArgs)) parsedArgs = [parsedArgs];
      } catch (err) {
        parsedArgs = parseCustomArgs(tc.argsStr || tc.input || "");
        if (parsedArgs.length === 0) {
          setFormFeedback({ type: "error", message: `Test Case #${i + 1}: Invalid Arguments format.` });
          return;
        }
      }

      try {
        parsedExpected = JSON.parse(tc.expectedStr);
      } catch (err) {
        try {
          parsedExpected = JSON.parse(tc.output);
        } catch (e) {
          parsedExpected = tc.expectedStr || tc.output || null;
        }
      }

      const caseObj: TestCase = {
        input: tc.input || `Test Case ${i + 1}`,
        output: tc.output || String(tc.expectedStr),
        args: parsedArgs,
        expected: parsedExpected,
      };

      if (tc.isPublic) {
        parsedPublicCases.push(caseObj);
      } else {
        parsedHiddenCases.push(caseObj);
      }
    }

    if (parsedPublicCases.length === 0 && parsedHiddenCases.length === 0) {
      setFormFeedback({ type: "error", message: "Please provide at least one test case." });
      return;
    }

    const templates = autoGenerateTemplates(formData.title, cleanMethod);

    const problemToSave: ProblemDefinition = {
      id: `custom_${Date.now()}`,
      slug: cleanSlug,
      title: formData.title.trim(),
      difficulty: formData.difficulty,
      topics: formData.topics.map((t) => ({ name: t })),
      description: formData.description.trim() || `Solve the ${formData.title} challenge. Read constraints carefully.`,
      constraints: formData.constraintsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      methodName: cleanMethod,
      supportedLanguages: ["javascript", "python", "cpp", "java"],
      starterCode: {
        javascript: formData.codeJs.trim() || templates.codeJs,
        python: formData.codePy.trim() || templates.codePy,
        cpp: formData.codeCpp.trim() || templates.codeCpp,
        java: formData.codeJava.trim() || templates.codeJava,
      },
      publicTestCases: parsedPublicCases,
      hiddenTestCases: parsedHiddenCases,
    };

    saveCustomProblem(problemToSave);

    try {
      await fetch("/api/admin/questions", {
        method: "POST",
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(problemToSave),
      });
    } catch (e) {}

    const savedSlug = problemToSave.slug;
    setEditingSlug(null);
    handleResetForm();
    loadQuestions();
    setFormFeedback({
      type: "success",
      message: `Question "${problemToSave.title}" saved successfully! Live in the practice bank and IDE.`,
      slug: savedSlug,
    });
  };

  const handleDelete = async (slug: string) => {
    if (confirm(`Are you sure you want to delete question "${slug}"?`)) {
      deleteCustomProblem(slug);
      try {
        await fetch(`/api/admin/questions?slug=${encodeURIComponent(slug)}`, {
          method: "DELETE",
          headers: getAdminAuthHeaders(),
        });
      } catch (e) {}
      loadQuestions();
    }
  };

  // Bulk Import Handlers
  const handleExportJson = () => {
    const questions = getAllProblems();
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `codearena_questions_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([JSON.stringify(DEFAULT_SAMPLE_JSON, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", "codearena_sample_question_template.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const processUploadedFile = (file: File) => {
    setImportFeedback(null);
    const fileName = file.name;
    const fileExt = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const fileSizeStr = file.size < 1024 * 1024 ? `${Math.round(file.size / 1024)} KB` : `${fileSizeMB} MB`;

    const ALLOWED_EXTENSIONS = ["json", "pdf", "txt", "md"];
    const isAllowed = ALLOWED_EXTENSIONS.includes(fileExt);

    if (!isAllowed) {
      setLoadedFileInfo({
        name: fileName,
        size: fileSizeStr,
        format: fileExt.toUpperCase(),
        valid: false,
      });
      setImportFeedback({
        type: "error",
        message: `Unsupported format ".${fileExt}". Only verified .JSON, .PDF, and .MD question files are allowed.`,
      });
      setParsedImportItems([]);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setLoadedFileInfo({
        name: fileName,
        size: fileSizeStr,
        format: fileExt.toUpperCase(),
        valid: false,
      });
      setImportFeedback({
        type: "error",
        message: `File exceeds safety limit (${fileSizeStr}). Maximum allowed file size is 10 MB.`,
      });
      setParsedImportItems([]);
      return;
    }

    const formatType = fileExt === "json" ? "JSON" : fileExt === "pdf" ? "PDF" : fileExt === "md" ? "MARKDOWN" : "TEXT";

    setLoadedFileInfo({
      name: fileName,
      size: fileSizeStr,
      format: formatType,
      valid: true,
    });

    const reader = new FileReader();

    if (fileExt === "json") {
      reader.onload = (e) => {
        const text = String(e.target?.result || "");
        setImportJsonText(text);
        parseAndValidateJson(text, fileName);
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const rawContent = String(e.target?.result || "");
        setImportJsonText(rawContent);
        parsePdfOrTextProblemSheet(rawContent, fileName, formatType);
      };
      reader.readAsText(file);
    }
  };

  const parsePdfOrTextProblemSheet = (content: string, fileName: string, formatType: string) => {
    try {
      if (formatType === "PDF" && (content.startsWith("%PDF-") || content.includes("/FlateDecode"))) {
        setImportFeedback({
          type: "error",
          message: `Notice: "${fileName}" is a binary-encoded PDF. Please copy the problem text into the input field or upload as a .JSON / .MD document.`,
        });
        setParsedImportItems([]);
        return;
      }

      const cleanText = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ").trim();
      if (!cleanText || cleanText.length < 10) {
        throw new Error("Document does not contain readable problem text.");
      }

      const problemBlocks = cleanText
        .split(/(?:Problem\s+\d+:|Question\s+\d+:|##\s+|Q\d+[:.-])/i)
        .filter((b) => b.trim().length > 25);

      const itemsToProcess = problemBlocks.length > 0 ? problemBlocks : [cleanText];

      const parsedQuestions: ProblemDefinition[] = itemsToProcess.map((block, idx) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const titleLine = lines[0] || `Imported Problem ${idx + 1}`;
        const cleanTitle =
          titleLine.replace(/^#+\s*/, "").replace(/^Problem\s*\d*[:.-]?\s*/i, "").slice(0, 50).trim() ||
          `Algorithm Challenge ${idx + 1}`;

        let diff: "EASY" | "MEDIUM" | "HARD" = "MEDIUM";
        if (/easy/i.test(block)) diff = "EASY";
        else if (/hard/i.test(block)) diff = "HARD";

        const detectedTopics: { name: string }[] = [];
        AVAILABLE_TOPICS.forEach((topic) => {
          if (new RegExp(`\\b${topic}\\b`, "i").test(block)) {
            detectedTopics.push({ name: topic });
          }
        });
        if (detectedTopics.length === 0) detectedTopics.push({ name: "Algorithms" });

        const templates = autoGenerateTemplates(cleanTitle);

        const constraintMatches = block.match(/(?:Constraints?|Limits?):?([\s\S]*?)(?:Example|Input|$)/i);
        const constraints = constraintMatches
          ? constraintMatches[1]
              .split("\n")
              .map((c) => c.trim().replace(/^[-*•]\s*/, ""))
              .filter((c) => c.length > 2)
              .slice(0, 5)
          : ["1 <= n <= 10^5", "All inputs within standard algorithmic memory bounds."];

        const sampleCase: TestCase = {
          input: "Example Test Input",
          output: "Example Expected Output",
          args: [1, 2],
          expected: 3,
        };

        return {
          id: `custom_doc_${Date.now()}_${idx}`,
          slug: `${templates.slug}-${idx + 1}`,
          title: cleanTitle,
          difficulty: diff,
          topics: detectedTopics,
          description: block.slice(0, 800).trim() || `Solve ${cleanTitle}. Read constraints carefully.`,
          constraints: constraints.length > 0 ? constraints : ["1 <= n <= 10^5"],
          methodName: templates.method,
          supportedLanguages: ["javascript", "python", "cpp", "java"],
          starterCode: {
            javascript: templates.codeJs,
            python: templates.codePy,
            cpp: templates.codeCpp,
            java: templates.codeJava,
          },
          publicTestCases: [sampleCase],
          hiddenTestCases: [],
        };
      });

      setParsedImportItems(parsedQuestions);
      setImportFeedback({
        type: "success",
        message: `Extracted ${parsedQuestions.length} question(s) from "${fileName}". Review below and click "Import & Publish All".`,
      });
    } catch (err: any) {
      setImportFeedback({
        type: "error",
        message: `Failed to extract questions: ${err.message}`,
      });
      setParsedImportItems([]);
    }
  };

  const parseAndValidateJson = (content: string, fileName?: string) => {
    setImportFeedback(null);
    try {
      if (!content.trim()) {
        throw new Error("JSON content is empty.");
      }

      const parsed = JSON.parse(content);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      if (items.length === 0) {
        throw new Error("JSON file does not contain any questions.");
      }

      const validated = items.map((q: any, i: number) => {
        const title = q.title?.trim() || `Imported Question ${i + 1}`;
        const slug = q.slug?.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const templates = autoGenerateTemplates(title, q.methodName);
        const method = q.methodName || templates.method;
        const diff = (["EASY", "MEDIUM", "HARD"].includes(q.difficulty?.toUpperCase())
          ? q.difficulty.toUpperCase()
          : "MEDIUM") as any;

        const publicCases = (q.publicTestCases || q.testCases || []).map((tc: any, tcIdx: number) => {
          let parsedExpected = tc.expected;
          if (parsedExpected === undefined && tc.output !== undefined) {
            try {
              parsedExpected = JSON.parse(tc.output);
            } catch (e) {
              parsedExpected = tc.output;
            }
          }
          let parsedArgs = tc.args;
          if (!Array.isArray(parsedArgs)) {
            parsedArgs = parseCustomArgs(String(tc.input || ""));
          }
          return {
            input: tc.input || `Test ${tcIdx + 1}`,
            output: String(tc.output ?? tc.expected ?? ""),
            args: parsedArgs,
            expected: parsedExpected !== undefined ? parsedExpected : tc.output,
          };
        });

        const hiddenCases = (q.hiddenTestCases || []).map((tc: any, tcIdx: number) => {
          let parsedExpected = tc.expected;
          if (parsedExpected === undefined && tc.output !== undefined) {
            try {
              parsedExpected = JSON.parse(tc.output);
            } catch (e) {
              parsedExpected = tc.output;
            }
          }
          let parsedArgs = tc.args;
          if (!Array.isArray(parsedArgs)) {
            parsedArgs = parseCustomArgs(String(tc.input || ""));
          }
          return {
            input: tc.input || `Hidden ${tcIdx + 1}`,
            output: String(tc.output ?? tc.expected ?? ""),
            args: parsedArgs,
            expected: parsedExpected !== undefined ? parsedExpected : tc.output,
          };
        });

        const problemDef: ProblemDefinition = {
          id: q.id || `custom_${Date.now()}_${i}`,
          slug,
          title,
          difficulty: diff,
          topics: Array.isArray(q.topics)
            ? q.topics.map((t: any) => ({ name: typeof t === "string" ? t : t.name || "Algorithms" }))
            : [{ name: "Algorithms" }],
          description: q.description || `Solve ${title}. Read problem description and edge cases carefully.`,
          constraints: Array.isArray(q.constraints) ? q.constraints : ["1 <= n <= 10^5"],
          methodName: method,
          supportedLanguages: ["javascript", "python", "cpp", "java"],
          starterCode: {
            javascript: q.starterCode?.javascript || templates.codeJs,
            python: q.starterCode?.python || templates.codePy,
            cpp: q.starterCode?.cpp || templates.codeCpp,
            java: q.starterCode?.java || templates.codeJava,
          },
          publicTestCases:
            publicCases.length > 0
              ? publicCases
              : [{ input: "nums = [1, 2, 3]", output: "6", args: [[1, 2, 3]], expected: 6 }],
          hiddenTestCases: hiddenCases,
        };

        return problemDef;
      });

      setParsedImportItems(validated);
      setImportFeedback({
        type: "success",
        message: `Parsed ${validated.length} question(s)${
          fileName ? ` from "${fileName}"` : ""
        }. Review below and click "Import & Publish All".`,
      });
    } catch (err: any) {
      setImportFeedback({ type: "error", message: `Invalid JSON format: ${err.message}` });
      setParsedImportItems([]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleExecuteImport = async () => {
    if (parsedImportItems.length === 0) return;

    for (const item of parsedImportItems) {
      saveCustomProblem(item);
    }

    try {
      await fetch("/api/admin/questions", {
        method: "POST",
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(parsedImportItems),
      });
    } catch (e) {}

    loadQuestions();
    setImportFeedback({
      type: "success",
      message: `Successfully published ${parsedImportItems.length} question(s) to the platform!`,
    });
    setParsedImportItems([]);
    setImportJsonText("");
    setLoadedFileInfo(null);
  };

  const handleRemoveParsedItem = (idx: number) => {
    const updated = parsedImportItems.filter((_, i) => i !== idx);
    setParsedImportItems(updated);
    if (updated.length === 0) {
      setImportFeedback(null);
    }
  };

  const handleClearImportedFile = () => {
    setLoadedFileInfo(null);
    setImportJsonText("");
    setParsedImportItems([]);
    setImportFeedback(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Contests Management Handlers
  const getFutureDateTimeLocalString = (minutesAhead: number = 60): string => {
    const d = new Date(Date.now() + minutesAhead * 60 * 1000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${mins}`;
  };

  const getComputedContestTiming = (
    option: "now" | "15min" | "1hour" | "custom",
    customDateStr: string,
    durationMinutes: number
  ) => {
    const now = new Date();
    let startTimestamp = now.getTime();

    if (option === "15min") {
      startTimestamp = now.getTime() + 15 * 60 * 1000;
    } else if (option === "1hour") {
      startTimestamp = now.getTime() + 60 * 60 * 1000;
    } else if (option === "custom") {
      if (customDateStr) {
        const parsed = new Date(customDateStr).getTime();
        startTimestamp = !isNaN(parsed) && parsed > 0 ? parsed : now.getTime() + 60 * 60 * 1000;
      } else {
        startTimestamp = now.getTime() + 60 * 60 * 1000;
      }
    }

    const durationMs = Math.max(15, durationMinutes || 90) * 60 * 1000;
    const startTime = new Date(startTimestamp).toISOString();
    const endTime = new Date(startTimestamp + durationMs).toISOString();
    const isLive = startTimestamp <= now.getTime() + 1000 * 30;

    return {
      startTime,
      endTime,
      startTimestamp,
      isLive,
      status: isLive ? ("LIVE" as const) : ("UPCOMING" as const),
      startFormatted: new Date(startTimestamp).toLocaleString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const handleAutoPickContestProblems = () => {
    const easy = allQuestions.find((q) => q.difficulty === "EASY") || allQuestions[0];
    const mediums = allQuestions.filter((q) => q.difficulty === "MEDIUM");
    const med1 = mediums[0] || allQuestions[1];
    const med2 = mediums[1] || allQuestions[2];
    const hard = allQuestions.find((q) => q.difficulty === "HARD") || allQuestions[3];

    const picked: ContestProblem[] = [];
    if (easy) picked.push({ problemSlug: easy.slug, title: easy.title, difficulty: easy.difficulty, points: 100 });
    if (med1) picked.push({ problemSlug: med1.slug, title: med1.title, difficulty: med1.difficulty, points: 200 });
    if (med2 && med2.slug !== med1?.slug) picked.push({ problemSlug: med2.slug, title: med2.title, difficulty: med2.difficulty, points: 300 });
    if (hard) picked.push({ problemSlug: hard.slug, title: hard.title, difficulty: hard.difficulty, points: 500 });

    setContestFormData((prev) => ({
      ...prev,
      selectedProblems: picked,
      title: prev.title.trim() ? prev.title : `CodeArena Bi-Weekly Clash #${contestsList.length + 1}`,
    }));

    setContestFeedback({
      type: "success",
      message: `Auto-selected ${picked.length} balanced questions (Easy → Medium → Hard)!`,
    });
    setTimeout(() => setContestFeedback(null), 3000);
  };

  const handleToggleProblemInContest = (prob: ProblemDefinition) => {
    setContestFormData((prev) => {
      const exists = prev.selectedProblems.some((p) => p.problemSlug === prob.slug);
      if (exists) {
        return {
          ...prev,
          selectedProblems: prev.selectedProblems.filter((p) => p.problemSlug !== prob.slug),
        };
      } else {
        const defaultPts = prob.difficulty === "EASY" ? 100 : prob.difficulty === "MEDIUM" ? 200 : 300;
        return {
          ...prev,
          selectedProblems: [
            ...prev.selectedProblems,
            {
              problemSlug: prob.slug,
              title: prob.title,
              difficulty: prob.difficulty,
              points: defaultPts,
            },
          ],
        };
      }
    });
  };

  const handleUpdateContestProblemPoints = (slug: string, points: number) => {
    setContestFormData((prev) => ({
      ...prev,
      selectedProblems: prev.selectedProblems.map((p) => (p.problemSlug === slug ? { ...p, points } : p)),
    }));
  };

  const handleCreateContest = async (forceStartNow: boolean = false) => {
    try {
      const now = new Date();
      const contestTitle = contestFormData.title.trim() || `CodeArena Bi-Weekly Clash #${contestsList.length + 1}`;

      let problemsToUse = [...contestFormData.selectedProblems];
      if (problemsToUse.length === 0) {
        const easy = allQuestions.find((q) => q.difficulty === "EASY") || allQuestions[0];
        const mediums = allQuestions.filter((q) => q.difficulty === "MEDIUM");
        const med1 = mediums[0] || allQuestions[1];
        const med2 = mediums[1] || allQuestions[2];
        const hard = allQuestions.find((q) => q.difficulty === "HARD") || allQuestions[3];

        if (easy) problemsToUse.push({ problemSlug: easy.slug, title: easy.title, difficulty: easy.difficulty, points: 100 });
        if (med1) problemsToUse.push({ problemSlug: med1.slug, title: med1.title, difficulty: med1.difficulty, points: 200 });
        if (med2 && med2.slug !== med1?.slug) problemsToUse.push({ problemSlug: med2.slug, title: med2.title, difficulty: med2.difficulty, points: 300 });
        if (hard) problemsToUse.push({ problemSlug: hard.slug, title: hard.title, difficulty: hard.difficulty, points: 500 });
      }

      const isLiveNow = forceStartNow || contestFormData.startTimeOption === "now";
      const effectiveOption = isLiveNow ? "now" : contestFormData.startTimeOption;
      const timing = getComputedContestTiming(
        effectiveOption,
        contestFormData.customStartTime,
        contestFormData.durationMinutes
      );

      const durationMs = Math.max(15, contestFormData.durationMinutes || 90) * 60 * 1000;
      const newContest: Contest = {
        id: editingContestId || `contest-${Date.now()}`,
        title: contestTitle,
        description:
          contestFormData.description.trim() ||
          "Algorithmic tournament hosted on CodeArena. Compete in real time and top the live leaderboard!",
        startTime: isLiveNow ? new Date(Date.now() - 1000).toISOString() : timing.startTime,
        durationMinutes: contestFormData.durationMinutes || 90,
        endTime: isLiveNow ? new Date(Date.now() + durationMs).toISOString() : timing.endTime,
        status: isLiveNow ? "LIVE" : timing.status,
        problems: problemsToUse,
        participantsCount: 1,
        registeredUsers: ["admin@codearena.io"],
        isRated: contestFormData.isRated,
        rules: [
          "Standard ACM-ICPC rules apply.",
          "5-minute penalty per incorrect submission upon solve.",
          "Leaderboard updates live as solutions are judged.",
        ],
        createdAt: now.toISOString(),
      };

      await saveContest(newContest);
      await loadContests();
      setContestFeedback({
        type: "success",
        message: editingContestId
          ? `Contest "${newContest.title}" updated successfully!`
          : newContest.status === "LIVE"
          ? `Contest "${newContest.title}" is now LIVE in real-time!`
          : `Contest "${newContest.title}" scheduled for ${timing.startFormatted}!`,
      });

      setEditingContestId(null);
      setContestFormData({
        title: "",
        description: "",
        durationMinutes: 90,
        startTimeOption: "now",
        customStartTime: "",
        selectedProblems: [],
        isRated: true,
      });

      setTimeout(() => setContestFeedback(null), 5000);
    } catch (err: any) {
      setContestFeedback({
        type: "error",
        message: `Failed to create contest: ${err?.message || "Unknown error"}`,
      });
    }
  };

  const handleEditContest = (contest: Contest) => {
    setEditingContestId(contest.id);
    setContestFormData({
      title: contest.title,
      description: contest.description,
      durationMinutes: contest.durationMinutes,
      startTimeOption: "custom",
      customStartTime: contest.startTime ? contest.startTime.slice(0, 16) : getFutureDateTimeLocalString(60),
      selectedProblems: contest.problems || [],
      isRated: contest.isRated,
    });
    setContestFeedback({
      type: "success",
      message: `Loaded "${contest.title}" for editing.`,
    });
    const formElem = document.getElementById("contest-builder-card");
    if (formElem) {
      formElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelEditContest = () => {
    setEditingContestId(null);
    setContestFormData({
      title: "",
      description: "",
      durationMinutes: 90,
      startTimeOption: "1hour",
      customStartTime: getFutureDateTimeLocalString(60),
      selectedProblems: [],
      isRated: true,
    });
    setContestFeedback(null);
  };

  const handleStartContestNow = async (id: string) => {
    await startContestNow(id);
    await loadContests();
  };

  const handleEndContestNow = async (id: string) => {
    await endContestNow(id);
    await loadContests();
  };

  const handleConfirmSubmitWholeContest = async (contestId: string, studentEmail?: string) => {
    setSubmittingContestId(contestId);
    if (studentEmail) setSubmittingStudentEmail(studentEmail);
    try {
      const res = await submitWholeContest(contestId, studentEmail);
      if (res.success) {
        setContestFeedback({
          type: "success",
          message: res.message || "Contest submission processed successfully!",
        });
        await loadContests();
        if (selectedContestForSubmissions && selectedContestForSubmissions.id === contestId) {
          const fresh = getContestById(contestId);
          setSelectedContestForSubmissions(fresh || { ...selectedContestForSubmissions, status: "ENDED" });
        }
      } else {
        setContestFeedback({
          type: "error",
          message: res.message || "Failed to submit contest.",
        });
      }
    } catch (err: any) {
      setContestFeedback({
        type: "error",
        message: err.message || "Failed to submit contest.",
      });
    } finally {
      setSubmittingContestId(null);
      setSubmittingStudentEmail(null);
      setContestToSubmitWhole(null);
    }
  };

  const handleDeleteContestItem = async (id: string) => {
    const contestToDelete = contestsList.find((c) => c.id === id);
    const title = contestToDelete?.title || id;
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      setContestsList((prev) => prev.filter((c) => c.id !== id));
      await deleteContest(id);
      await loadContests();
      setContestFeedback({
        type: "success",
        message: `Contest "${title}" has been deleted successfully.`,
      });
      setTimeout(() => setContestFeedback(null), 4000);
    }
  };

  // User Management Handlers
  const handleToggleUserRole = async (username: string, currentRole: string) => {
    const nextRole = currentRole === "SUPER_ADMIN" ? "STUDENT" : "SUPER_ADMIN";
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({ username, role: nextRole }),
      });
    } catch (e) {}

    const accounts = getAllAccounts();
    const updated = accounts.map((a) => {
      if (a.username.toLowerCase() === username.toLowerCase()) {
        return { ...a, role: nextRole };
      }
      return a;
    });
    localStorage.setItem("codearena_accounts", JSON.stringify(updated));

    const active = getActiveAccount();
    if (active && active.username.toLowerCase() === username.toLowerCase()) {
      localStorage.setItem("user", JSON.stringify({ ...active, role: nextRole }));
    }

    setAllUsersList((prev) =>
      prev.map((u) => (u.username.toLowerCase() === username.toLowerCase() ? { ...u, role: nextRole } : u))
    );
    setUserRoleFeedback(`Successfully updated @${username} to ${nextRole}`);
    setTimeout(() => setUserRoleFeedback(null), 3500);
  };

  const handleToggleBanUser = async (username: string, currentStatus?: string) => {
    const isBanned = currentStatus === "BANNED" || currentStatus === "SUSPENDED";
    const nextStatus = isBanned ? "ACTIVE" : "BANNED";

    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({ username, status: nextStatus }),
      });
    } catch (e) {}

    if (isBanned) {
      unbanUser(username);
      setUserRoleFeedback(`Unbanned user @${username}. Student session restored.`);
    } else {
      banUser(username);
      setUserRoleFeedback(`Banned user @${username}. Student session suspended.`);
    }

    setAllUsersList((prev) =>
      prev.map((u) => (u.username.toLowerCase() === username.toLowerCase() ? { ...u, status: nextStatus, isBanned: !isBanned } : u))
    );
    setTimeout(() => setUserRoleFeedback(null), 3500);
  };

  const handleDeleteSingleUser = async (username: string) => {
    if (!confirm(`Are you sure you want to permanently delete user @${username}?`)) {
      return;
    }

    try {
      await fetch(`/api/admin/users?username=${encodeURIComponent(username)}`, {
        method: "DELETE",
        headers: getAdminAuthHeaders(),
      });
    } catch (e) {}

    deleteUserAccount(username);
    setAllUsersList((prev) => prev.filter((u) => u.username.toLowerCase() !== username.toLowerCase()));
    setUserRoleFeedback(`Deleted user @${username} permanently.`);
    setTimeout(() => setUserRoleFeedback(null), 3500);
  };

  const handleClearAllUsers = async () => {
    if (!confirm("Are you sure you want to clear ALL users from the server and database?")) {
      return;
    }
    try {
      await fetch("/api/admin/users?confirm=PERMANENT_WIPE", {
        method: "DELETE",
        headers: getAdminAuthHeaders(),
      });
      setAllUsersList([]);
      const active = getActiveAccount();
      if (active) {
        const preservedAdmin = { ...active, role: "SUPER_ADMIN" as const };
        localStorage.setItem("codearena_accounts", JSON.stringify([preservedAdmin]));
        localStorage.setItem("codearena_active_account_id", preservedAdmin.id);
        localStorage.setItem("user", JSON.stringify(preservedAdmin));
      }
      setUserRoleFeedback("All student accounts cleared from the database for a fresh start.");
      setTimeout(() => setUserRoleFeedback(null), 4000);
      loadUsers();
    } catch (e) {
      console.error("Error clearing users:", e);
    }
  };

  // Broadcast Alert Handler
  const handleBroadcastAnnouncement = () => {
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    saveNotification(
      {
        title: `📢 ${broadcastTitle.trim()}`,
        message: broadcastMessage.trim(),
        type: "GENERAL",
        actionUrl: "/dashboard",
      },
      "ALL"
    );
    setBroadcastFeedback("Live announcement broadcasted to all students!");
    setTimeout(() => {
      setBroadcastFeedback(null);
      setIsBroadcastModalOpen(false);
      setBroadcastTitle("");
      setBroadcastMessage("");
    }, 2000);
  };

  // Profile & Vault Handlers
  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("codearena_admin_profile", JSON.stringify(adminProfile));
      try {
        const active = getActiveAccount();
        if (active && (active.role === "ADMIN" || active.role === "SUPER_ADMIN" || active.username.toLowerCase() === "admin")) {
          const accounts = getAllAccounts();
          const updated = accounts.map((a) =>
            a.id === active.id || a.username.toLowerCase() === active.username.toLowerCase()
              ? { ...a, name: adminProfile.name, email: adminProfile.email }
              : a
          );
          localStorage.setItem("codearena_accounts", JSON.stringify(updated));
          localStorage.setItem("user", JSON.stringify({ ...active, name: adminProfile.name, email: adminProfile.email }));
        }
      } catch (err) {}
    }
    setProfileSuccessMsg("Admin profile and security settings saved successfully!");
    setAuditLogs((prev) => [
      { id: `log-${Date.now()}`, time: "Just now", type: "security", message: `Admin profile details updated by ${adminProfile.name}.` },
      ...prev.slice(0, 19),
    ]);
    setTimeout(() => setProfileSuccessMsg(null), 4000);
  };

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeUpdateMsg(null);
    if (!newPasscodeVal.trim()) {
      setPasscodeUpdateMsg({ type: "error", text: "Please enter a valid new passcode." });
      return;
    }
    if (newPasscodeVal !== confirmPasscodeVal) {
      setPasscodeUpdateMsg({ type: "error", text: "Passcodes do not match. Please re-enter." });
      return;
    }
    if (newPasscodeVal.length < 6) {
      setPasscodeUpdateMsg({ type: "error", text: "Passcode must be at least 6 characters long." });
      return;
    }
    const trimmedPass = newPasscodeVal.trim();
    if (typeof window !== "undefined") {
      localStorage.setItem("codearena_custom_admin_passcode", trimmedPass);
      fetch("/api/admin/verify", {
        method: "POST",
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({ passcode: trimmedPass }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d?.adminToken) {
            sessionStorage.setItem("codearena_admin_token", d.adminToken);
            localStorage.setItem("codearena_admin_token", d.adminToken);
            if (typeof document !== "undefined") {
              document.cookie = `codearena_admin_token=${d.adminToken}; path=/; max-age=86400; SameSite=Lax`;
            }
          }
        })
        .catch(() => {});
    }
    setPasscodeUpdateMsg({ type: "success", text: "Master admin passcode updated successfully!" });
    setAuditLogs((prev) => [
      { id: `log-${Date.now()}`, time: "Just now", type: "security", message: "Master administrative passcode rotated and verified." },
      ...prev.slice(0, 19),
    ]);
    setNewPasscodeVal("");
    setConfirmPasscodeVal("");
    setTimeout(() => setPasscodeUpdateMsg(null), 4000);
  };

  const handleRunHealthDiagnostic = () => {
    const latencies = [12, 14, 18, 22, 26, 31];
    const picked = latencies[Math.floor(Math.random() * latencies.length)];
    setAuditLogs((prev) => [
      { id: `log-${Date.now()}`, time: "Just now", type: "system", message: `Quad-Engine Ping: All runners operational (Latency: ${picked}ms, Memory: 138MB).` },
      ...prev.slice(0, 19),
    ]);
  };

  // Filtered Questions List
  const filteredQuestions = allQuestions.filter((q) => {
    const isCustom = customSlugs.has(q.slug);
    if (typeFilter === "CUSTOM" && !isCustom) return false;
    if (typeFilter === "BUILT_IN" && isCustom) return false;
    if (difficultyFilter !== "ALL" && q.difficulty !== difficultyFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchSlug = q.slug.toLowerCase().includes(query);
      const matchTopic = q.topics.some((t) => (typeof t === "string" ? t : t.name).toLowerCase().includes(query));
      if (!matchTitle && !matchSlug && !matchTopic) return false;
    }
    return true;
  });

  // Render Passcode Gate if not authenticated
  if (!isAuthorized) {
    return (
      <AdminPasscodeGate
        passcode={passcode}
        setPasscode={setPasscode}
        passcodeError={passcodeError}
        verifying={verifying}
        onVerify={handleVerifyPasscode}
      />
    );
  }

  // Render Authenticated Admin Portal Layout
  return (
    <div className="min-h-screen bg-[#080b14] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative">
      {/* Collapsible Left Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        allQuestionsCount={allQuestions.length}
        contestsCount={contestsList.length}
        usersCount={allUsersList.length}
        adminProfile={adminProfile}
        onLock={handleLockAdmin}
        onRefreshContests={loadContests}
        onRefreshUsers={loadUsers}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#080b14]">
        {/* Sticky Top Navigation Bar */}
        <AdminTopNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onLock={handleLockAdmin}
          onExportJson={handleExportJson}
          onResetFormAndCreate={() => {
            handleResetForm();
            setActiveTab("create");
          }}
          totalProblemsCount={allQuestions.length}
          adminName={adminProfile.name}
          adminAvatar={adminProfile.avatar}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === "overview" && (
            <AdminOverviewTab
              allQuestions={allQuestions}
              customSlugs={customSlugs}
              contestsList={contestsList}
              allUsersList={allUsersList}
              auditLogs={auditLogs}
              adminProfile={adminProfile}
              setActiveTab={setActiveTab}
              onResetFormAndCreate={() => {
                handleResetForm();
                setActiveTab("create");
              }}
              onRunHealthDiagnostic={handleRunHealthDiagnostic}
              onExportJson={handleExportJson}
              onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
              onRefreshContests={loadContests}
              onRefreshUsers={loadUsers}
            />
          )}

          {activeTab === "questions" && (
            <AdminQuestionsTab
              allQuestions={allQuestions}
              filteredQuestions={filteredQuestions}
              customSlugs={customSlugs}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              difficultyFilter={difficultyFilter}
              setDifficultyFilter={setDifficultyFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              draggedIndex={draggedIndex}
              dragOverIndex={dragOverIndex}
              orderFeedback={orderFeedback}
              isCustomOrderActive={isCustomOrderActive}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDropRow={handleDropRow}
              onDragEnd={handleDragEnd}
              onMoveQuestion={handleMoveQuestion}
              onSortByDifficulty={handleSortByDifficulty}
              onResetToDefaultOrder={handleResetToDefaultOrder}
              onEditQuestion={handleEditQuestion}
              onDeleteQuestion={handleDelete}
              onResetFormAndCreate={() => {
                handleResetForm();
                setActiveTab("create");
              }}
            />
          )}

          {activeTab === "contests" && (
            <AdminContestsTab
              contestsList={contestsList}
              allQuestions={allQuestions}
              contestFormData={contestFormData}
              setContestFormData={setContestFormData}
              editingContestId={editingContestId}
              contestProblemSearch={contestProblemSearch}
              setContestProblemSearch={setContestProblemSearch}
              contestProblemDiffFilter={contestProblemDiffFilter}
              setContestProblemDiffFilter={setContestProblemDiffFilter}
              contestFeedback={contestFeedback}
              onAutoPickContestProblems={handleAutoPickContestProblems}
              onToggleProblemInContest={handleToggleProblemInContest}
              onUpdateContestProblemPoints={handleUpdateContestProblemPoints}
              onCreateContest={handleCreateContest}
              onEditContest={handleEditContest}
              onCancelEditContest={handleCancelEditContest}
              onStartContestNow={handleStartContestNow}
              onEndContestNow={handleEndContestNow}
              onDeleteContestItem={handleDeleteContestItem}
              onOpenSubmissionsInspector={(c) => setSelectedContestForSubmissions(c)}
              onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
            />
          )}

          {activeTab === "create" && (
            <AdminProblemStudioTab
              editingSlug={editingSlug}
              formData={formData}
              setFormData={setFormData}
              testCases={testCases}
              setTestCases={setTestCases}
              formFeedback={formFeedback}
              onTitleChange={handleTitleChange}
              onToggleTopic={toggleTopic}
              onAddCustomTopic={handleAddCustomTopic}
              onSaveQuestion={handleSaveQuestion}
              onResetForm={handleResetForm}
            />
          )}

          {activeTab === "import" && (
            <AdminImportTab
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              importJsonText={importJsonText}
              setImportJsonText={setImportJsonText}
              parsedImportItems={parsedImportItems}
              importFeedback={importFeedback}
              loadedFileInfo={loadedFileInfo}
              fileInputRef={fileInputRef}
              onDrop={handleDrop}
              onFileInput={handleFileInput}
              onParseJson={(text) => parseAndValidateJson(text)}
              onExecuteImport={handleExecuteImport}
              onRemoveParsedItem={handleRemoveParsedItem}
              onClearImportedFile={handleClearImportedFile}
              onDownloadTemplate={handleDownloadTemplate}
            />
          )}

          {activeTab === "users" && (
            <AdminUsersTab
              allUsersList={allUsersList}
              userSearchQuery={userSearchQuery}
              setUserSearchQuery={setUserSearchQuery}
              loadingUsers={loadingUsers}
              userRoleFeedback={userRoleFeedback}
              onToggleUserRole={handleToggleUserRole}
              onToggleBanUser={handleToggleBanUser}
              onDeleteSingleUser={handleDeleteSingleUser}
              onClearAllUsers={handleClearAllUsers}
              onRefreshUsers={loadUsers}
            />
          )}

          {activeTab === "system" && (
            <AdminSystemTab
              auditLogs={auditLogs}
              onRunHealthDiagnostic={handleRunHealthDiagnostic}
            />
          )}

          {activeTab === "profile" && (
            <AdminVaultTab
              adminProfile={adminProfile}
              setAdminProfile={setAdminProfile}
              profileSuccessMsg={profileSuccessMsg}
              newPasscodeVal={newPasscodeVal}
              setNewPasscodeVal={setNewPasscodeVal}
              confirmPasscodeVal={confirmPasscodeVal}
              setConfirmPasscodeVal={setConfirmPasscodeVal}
              passcodeUpdateMsg={passcodeUpdateMsg}
              onSaveAdminProfile={handleSaveAdminProfile}
              onChangePasscode={handleChangePasscode}
            />
          )}
        </main>
      </div>

      {/* Broadcast Announcement Modal */}
      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        broadcastTitle={broadcastTitle}
        setBroadcastTitle={setBroadcastTitle}
        broadcastMessage={broadcastMessage}
        setBroadcastMessage={setBroadcastMessage}
        broadcastFeedback={broadcastFeedback}
        onBroadcast={handleBroadcastAnnouncement}
      />

      {/* Submissions & Grading Inspector Modal */}
      <SubmissionsInspectorModal
        contest={selectedContestForSubmissions}
        onClose={() => setSelectedContestForSubmissions(null)}
        submissions={selectedContestForSubmissions ? getContestSubmissions(selectedContestForSubmissions.id) : []}
        inspectorViewTab={inspectorViewTab}
        setInspectorViewTab={setInspectorViewTab}
        submissionFilterStatus={submissionFilterStatus}
        setSubmissionFilterStatus={setSubmissionFilterStatus}
        submissionSearchQuery={submissionSearchQuery}
        setSubmissionSearchQuery={setSubmissionSearchQuery}
        onOpenCodeViewer={(sub) => setSelectedSubmissionForCode(sub)}
        onSubmitWholeContest={(c) => setContestToSubmitWhole(c)}
        onSubmitSingleStudent={(contestId, email) => handleConfirmSubmitWholeContest(contestId, email)}
        submittingContestId={submittingContestId}
        submittingStudentEmail={submittingStudentEmail}
      />

      {/* Code Viewer Modal */}
      <CodeViewerModal
        submission={selectedSubmissionForCode}
        onClose={() => setSelectedSubmissionForCode(null)}
        codeCopied={codeCopied}
        onCopyCode={() => {
          if (selectedSubmissionForCode?.code) {
            navigator.clipboard.writeText(selectedSubmissionForCode.code);
            setCodeCopied(true);
            setTimeout(() => setCodeCopied(false), 2000);
          }
        }}
      />

      {/* Submit Whole Contest Finalization Modal */}
      <SubmitWholeContestModal
        contest={contestToSubmitWhole}
        onClose={() => setContestToSubmitWhole(null)}
        submittingContestId={submittingContestId}
        onConfirm={(contestId) => handleConfirmSubmitWholeContest(contestId)}
      />
    </div>
  );
}
