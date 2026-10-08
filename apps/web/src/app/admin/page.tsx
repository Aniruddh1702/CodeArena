"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Label, Tabs, TabsList, TabsTrigger, TabsContent } from "@codearena/ui";
import {
  getAllProblems,
  getCustomProblems,
  saveCustomProblem,
  deleteCustomProblem,
  saveQuestionOrder,
  getQuestionOrder,
  resetQuestionOrder,
  ProblemDefinition,
  TestCase,
} from "@/lib/problems-data";
import {
  getContests,
  saveContest,
  deleteContest,
  startContestNow,
  endContestNow,
  clearAllContests,
  Contest,
  ContestProblem,
} from "@/lib/contests-data";
import { getActiveAccount, getAllAccounts, getUserStats } from "@/lib/auth-session";

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

const DEFAULT_SAMPLE_JSON = [
  {
    "title": "Palindrome Number",
    "slug": "palindrome-number",
    "difficulty": "EASY",
    "topics": [{ "name": "Math" }, { "name": "Two Pointers" }],
    "description": "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.\n\nFor example, `121` is a palindrome while `123` is not.",
    "constraints": ["-2^31 <= x <= 2^31 - 1"],
    "methodName": "isPalindrome",
    "supportedLanguages": ["javascript", "python", "cpp", "java"],
    "starterCode": {
      "javascript": "/**\n * @param {number} x\n * @return {boolean}\n */\nvar isPalindrome = function(x) {\n    \n};",
      "python": "class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        pass",
      "cpp": "class Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};",
      "java": "class Solution {\n    public boolean isPalindrome(int x) {\n        \n    }\n}"
    },
    "publicTestCases": [
      {
        "input": "x = 121",
        "output": "true",
        "args": [121],
        "expected": true
      },
      {
        "input": "x = -121",
        "output": "false",
        "args": [-121],
        "expected": false
      },
      {
        "input": "x = 10",
        "output": "false",
        "args": [10],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "x = 0",
        "output": "true",
        "args": [0],
        "expected": true
      }
    ]
  }
];

export default function AdminPortalPage() {
  const router = useRouter();

  // Authentication & Gate State (Locked by default - requires Admin password)
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState("questions");

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

  // Form State for Manual Creation / Editing
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

  const [formFeedback, setFormFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // File Drop & Import State
  const [isDragging, setIsDragging] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [parsedImportItems, setParsedImportItems] = useState<ProblemDefinition[]>([]);
  const [importFeedback, setImportFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loadedFileInfo, setLoadedFileInfo] = useState<{ name: string; size: string; format: string; valid: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User Accounts State
  const [allUsersList, setAllUsersList] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userRoleFeedback, setUserRoleFeedback] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/leaderboard");
      const json = await res.json().catch(() => null);
      const dbItems = json?.items || [];
      const sessionAccounts = getAllAccounts();

      const map = new Map<string, any>();
      for (const u of dbItems) {
        map.set(u.username.toLowerCase(), {
          userId: u.userId || u.id,
          username: u.username,
          name: u.name || u.username,
          email: `${u.username}@codearena.dev`,
          role: "STUDENT",
          score: u.score || 1450,
          problemsSolved: u.problemsSolved || 0,
          org: u.org || "CodeArena Academy",
        });
      }
      for (const s of sessionAccounts) {
        const stats = getUserStats(s.id);
        map.set(s.username.toLowerCase(), {
          userId: s.id,
          username: s.username,
          name: s.name,
          email: s.email,
          role: s.role || "STUDENT",
          score: stats.dsaRating,
          problemsSolved: stats.problemsSolved,
          org: s.college || "CodeArena Academy",
        });
      }
      setAllUsersList(Array.from(map.values()));
    } catch (e) {
      console.error("Error loading users:", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleUserRole = (username: string, currentRole: string) => {
    const nextRole = currentRole === "SUPER_ADMIN" ? "STUDENT" : "SUPER_ADMIN";
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

  // Contest Manager State & Scheduling Logic
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
        if (!isNaN(parsed) && parsed > 0) {
          startTimestamp = parsed;
        } else {
          startTimestamp = now.getTime() + 60 * 60 * 1000;
        }
      } else {
        startTimestamp = now.getTime() + 60 * 60 * 1000;
      }
    }

    const durationMs = Math.max(15, durationMinutes || 90) * 60 * 1000;
    const startTime = new Date(startTimestamp).toISOString();
    const endTime = new Date(startTimestamp + durationMs).toISOString();
    const isLive = startTimestamp <= (now.getTime() + 1000 * 30); // within 30s considered immediate

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
        minute: "2-digit"
      }),
      endFormatted: new Date(startTimestamp + durationMs).toLocaleString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };
  };

  const [contestsList, setContestsList] = useState<Contest[]>(() => getContests());
  const [contestFormData, setContestFormData] = useState({
    title: "",
    description: "",
    durationMinutes: 90,
    startTimeOption: "1hour" as "now" | "15min" | "1hour" | "custom",
    customStartTime: "",
    selectedProblems: [] as ContestProblem[],
    isRated: true,
  });
  const [contestProblemSearch, setContestProblemSearch] = useState("");
  const [contestProblemDiffFilter, setContestProblemDiffFilter] = useState("ALL");
  const [contestFeedback, setContestFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadContests = () => {
    setContestsList(getContests());
  };

  const handleAutoPickContestProblems = () => {
    const easy = allQuestions.find(q => q.difficulty === "EASY") || allQuestions[0];
    const mediums = allQuestions.filter(q => q.difficulty === "MEDIUM");
    const med1 = mediums[0] || allQuestions[1];
    const med2 = mediums[1] || allQuestions[2];
    const hard = allQuestions.find(q => q.difficulty === "HARD") || allQuestions[3];

    const picked: ContestProblem[] = [];
    if (easy) picked.push({ problemSlug: easy.slug, title: easy.title, difficulty: easy.difficulty, points: 100 });
    if (med1) picked.push({ problemSlug: med1.slug, title: med1.title, difficulty: med1.difficulty, points: 200 });
    if (med2 && med2.slug !== med1?.slug) picked.push({ problemSlug: med2.slug, title: med2.title, difficulty: med2.difficulty, points: 300 });
    if (hard) picked.push({ problemSlug: hard.slug, title: hard.title, difficulty: hard.difficulty, points: 500 });

    setContestFormData(prev => ({
      ...prev,
      selectedProblems: picked,
      title: prev.title.trim() ? prev.title : `CodeArena Bi-Weekly Clash #${contestsList.length + 1}`
    }));

    setContestFeedback({
      type: "success",
      message: `⚡ Auto-selected ${picked.length} balanced questions (Easy → Medium → Hard)!`
    });
    setTimeout(() => setContestFeedback(null), 3000);
  };

  const handleToggleProblemInContest = (prob: ProblemDefinition) => {
    setContestFormData(prev => {
      const exists = prev.selectedProblems.some(p => p.problemSlug === prob.slug);
      if (exists) {
        return {
          ...prev,
          selectedProblems: prev.selectedProblems.filter(p => p.problemSlug !== prob.slug)
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
              points: defaultPts
            }
          ]
        };
      }
    });
  };

  const handleUpdateContestProblemPoints = (slug: string, points: number) => {
    setContestFormData(prev => ({
      ...prev,
      selectedProblems: prev.selectedProblems.map(p =>
        p.problemSlug === slug ? { ...p, points } : p
      )
    }));
  };

  const handleCreateContest = (forceStartNow: boolean = false) => {
    try {
      const now = new Date();
      const contestTitle = contestFormData.title.trim() || `CodeArena Bi-Weekly Clash #${contestsList.length + 1}`;

      let problemsToUse = [...contestFormData.selectedProblems];
      if (problemsToUse.length === 0) {
        const easy = allQuestions.find(q => q.difficulty === "EASY") || allQuestions[0];
        const mediums = allQuestions.filter(q => q.difficulty === "MEDIUM");
        const med1 = mediums[0] || allQuestions[1];
        const med2 = mediums[1] || allQuestions[2];
        const hard = allQuestions.find(q => q.difficulty === "HARD") || allQuestions[3];

        if (easy) problemsToUse.push({ problemSlug: easy.slug, title: easy.title, difficulty: easy.difficulty, points: 100 });
        if (med1) problemsToUse.push({ problemSlug: med1.slug, title: med1.title, difficulty: med1.difficulty, points: 200 });
        if (med2 && med2.slug !== med1?.slug) problemsToUse.push({ problemSlug: med2.slug, title: med2.title, difficulty: med2.difficulty, points: 300 });
        if (hard) problemsToUse.push({ problemSlug: hard.slug, title: hard.title, difficulty: hard.difficulty, points: 500 });
      }

      const effectiveOption = forceStartNow 
        ? "now" 
        : (contestFormData.startTimeOption === "now" ? "1hour" : contestFormData.startTimeOption);

      const timing = getComputedContestTiming(
        effectiveOption,
        contestFormData.customStartTime,
        contestFormData.durationMinutes
      );

      const newContest: Contest = {
        id: `contest-${Date.now()}`,
        title: contestTitle,
        description: contestFormData.description.trim() || "Algorithmic contest hosted on CodeArena. Compete in real time and top the live leaderboard!",
        startTime: timing.startTime,
        durationMinutes: contestFormData.durationMinutes || 90,
        endTime: timing.endTime,
        status: timing.status,
        problems: problemsToUse,
        participantsCount: 1,
        registeredUsers: ["admin@codearena.io"],
        isRated: contestFormData.isRated,
        rules: [
          "Standard ACM-ICPC rules apply.",
          "5-minute penalty per incorrect submission upon solve.",
          "Leaderboard updates live as solutions are judged."
        ],
        createdAt: now.toISOString()
      };

      saveContest(newContest);
      setContestsList(getContests());
      setContestFeedback({
        type: "success",
        message: timing.status === "LIVE"
          ? `🟢 Contest '${newContest.title}' is now LIVE! Live contest arena opened.`
          : `📅 Contest '${newContest.title}' successfully SCHEDULED for ${timing.startFormatted}! In-App & Gmail 1-hour reminders armed.`
      });

      // Reset form to next scheduled slot
      setContestFormData({
        title: "",
        description: "",
        durationMinutes: 90,
        startTimeOption: "1hour",
        customStartTime: getFutureDateTimeLocalString(60),
        selectedProblems: [],
        isRated: true,
      });

      setTimeout(() => setContestFeedback(null), 5000);
    } catch (err: any) {
      setContestFeedback({
        type: "error",
        message: `Failed to create contest: ${err?.message || "Unknown error"}`
      });
    }
  };

  const handleStartContestNow = (id: string) => {
    startContestNow(id);
    loadContests();
  };

  const handleEndContestNow = (id: string) => {
    endContestNow(id);
    loadContests();
  };

  const handleDeleteContestItem = (id: string) => {
    if (confirm("Are you sure you want to delete this contest?")) {
      deleteContest(id);
      loadContests();
    }
  };

  // Check auth session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdmin = localStorage.getItem("codearena_admin_authorized");
      const activeAccount = getActiveAccount();
      if (storedAdmin === "true" || activeAccount?.role === "SUPER_ADMIN") {
        setIsAuthorized(true);
      }
      loadQuestions();
      loadUsers();
      loadContests();
    }
  }, []);

  const loadQuestions = () => {
    const list = getAllProblems();
    const custom = getCustomProblems();
    setAllQuestions(list);
    setCustomSlugs(new Set(Object.keys(custom)));
    setIsCustomOrderActive(getQuestionOrder() !== null);
  };

  // Drag-and-Drop & Reordering Handlers
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

    // Reorder in full list
    const newAll = [...allQuestions];
    const realFromIdx = newAll.findIndex(q => q.slug === itemToMove.slug);
    const realToIdx = newAll.findIndex(q => q.slug === targetItem.slug);

    if (realFromIdx >= 0 && realToIdx >= 0) {
      const [removed] = newAll.splice(realFromIdx, 1);
      newAll.splice(realToIdx, 0, removed);
      setAllQuestions(newAll);
      saveQuestionOrder(newAll.map(q => q.slug));
      setIsCustomOrderActive(true);
      setOrderFeedback(`✓ Moved "${itemToMove.title}" to position #${realToIdx + 1}`);
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
    const idx = allQuestions.findIndex(q => q.slug === slug);
    if (idx < 0) return;
    if (direction === "UP" && idx === 0) return;
    if (direction === "DOWN" && idx === allQuestions.length - 1) return;

    const targetIdx = direction === "UP" ? idx - 1 : idx + 1;
    const newAll = [...allQuestions];
    const [moved] = newAll.splice(idx, 1);
    newAll.splice(targetIdx, 0, moved);

    setAllQuestions(newAll);
    saveQuestionOrder(newAll.map(q => q.slug));
    setIsCustomOrderActive(true);
    setOrderFeedback(`✓ Moved "${moved.title}" ${direction === "UP" ? "up" : "down"} to position #${targetIdx + 1}`);
    setTimeout(() => setOrderFeedback(null), 3500);
  };

  const handleSortByDifficulty = () => {
    const diffScore: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };
    const sorted = [...allQuestions].sort((a, b) => {
      const scoreDiff = (diffScore[a.difficulty] || 2) - (diffScore[b.difficulty] || 2);
      if (scoreDiff !== 0) return scoreDiff;
      return a.title.localeCompare(b.title);
    });

    setAllQuestions(sorted);
    saveQuestionOrder(sorted.map(q => q.slug));
    setIsCustomOrderActive(true);
    setOrderFeedback("✓ Question Bank sorted strictly by Difficulty (50 Easy → 50 Medium → 50 Hard)");
    setTimeout(() => setOrderFeedback(null), 4000);
  };

  const handleResetToDefaultOrder = () => {
    resetQuestionOrder();
    const list = getAllProblems();
    setAllQuestions(list);
    setIsCustomOrderActive(false);
    setOrderFeedback("✓ Reset Question Bank to default 50 Easy → 50 Medium → 50 Hard sequence");
    setTimeout(() => setOrderFeedback(null), 4000);
  };

  const handleVerifyPasscode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVerifying(true);
    setPasscodeError("");

    const trimmed = passcode.trim();
    const VALID_ADMIN_PASSCODES = [
      "Aniruddh#1702"
    ];

    const isDirectMatch = VALID_ADMIN_PASSCODES.some(
      (valid) => valid === trimmed
    );

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
        }
      } catch (networkErr) {
        // Fallback to direct match if offline/network error
      }

      if (!apiSuccess && !isDirectMatch) {
        throw new Error("Invalid Admin Password. Access denied.");
      }

      // Elevate active session and accounts to SUPER_ADMIN
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
    document.cookie = "codearena_admin_auth=; path=/; max-age=0";
    setIsAuthorized(false);
  };

  // Helper to auto-generate method name and starter templates
  const autoGenerateTemplates = (title: string, rawMethodName?: string) => {
    const method = rawMethodName || title.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+(.)/g, (_, c) => c.toUpperCase()) || "solve";
    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "custom-problem";

    const codeJs = `/**\n * @param {any} input\n * @return {any}\n */\nvar ${method} = function(...args) {\n    // Implement your algorithmic solution\n    \n};`;
    const codePy = `class Solution:\n    def ${method}(self, *args):\n        # Implement your solution here\n        pass`;
    const codeCpp = `class Solution {\npublic:\n    auto ${method}(auto... args) {\n        // Your solution\n    }\n};`;
    const codeJava = `class Solution {\n    public Object ${method}(Object... args) {\n        // Your solution\n        return null;\n    }\n}`;

    return { method, slug, codeJs, codePy, codeCpp, codeJava };
  };

  // Handle Title change in Question Creator
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

  // Populate form for editing existing question
  const handleEditQuestion = (p: ProblemDefinition) => {
    setEditingSlug(p.slug);
    setFormData({
      title: p.title,
      slug: p.slug,
      difficulty: p.difficulty,
      topics: p.topics.map((t) => t.name),
      customTopicInput: "",
      methodName: p.methodName || "solution",
      description: p.description,
      constraintsText: p.constraints?.join("\n") || "",
      codeJs: p.starterCode.javascript,
      codePy: p.starterCode.python,
      codeCpp: p.starterCode.cpp,
      codeJava: p.starterCode.java,
    });

    const cases = [
      ...p.publicTestCases.map((tc) => ({
        input: tc.input,
        output: tc.output,
        argsStr: JSON.stringify(tc.args),
        expectedStr: JSON.stringify(tc.expected),
        isPublic: true,
      })),
      ...p.hiddenTestCases.map((tc) => ({
        input: tc.input,
        output: tc.output,
        argsStr: JSON.stringify(tc.args),
        expectedStr: JSON.stringify(tc.expected),
        isPublic: false,
      })),
    ];
    setTestCases(cases.length > 0 ? cases : [{ input: "", output: "", argsStr: "[]", expectedStr: "null", isPublic: true }]);
    setActiveTab("create");
    setFormFeedback(null);
  };

  // Reset form
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

  // Add / Remove Topic
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

  // Save Question
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (!formData.title.trim()) {
      setFormFeedback({ type: "error", message: "Problem title is required." });
      return;
    }

    const cleanSlug = formData.slug.trim() || formData.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const cleanMethod = formData.methodName.trim() || "solution";

    // Validate and parse test cases
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
        setFormFeedback({ type: "error", message: `Test Case #${i + 1}: Invalid Arguments JSON format.` });
        return;
      }

      try {
        parsedExpected = JSON.parse(tc.expectedStr);
      } catch (err) {
        // Fallback to raw string if valid JSON primitive
        parsedExpected = tc.expectedStr;
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

    // 1. Save to local repository
    saveCustomProblem(problemToSave);

    // 2. Sync to Backend API
    try {
      await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(problemToSave),
      });
    } catch (e) {
      console.warn("Backend sync optional:", e);
    }

    loadQuestions();
    setFormFeedback({
      type: "success",
      message: `Question "${problemToSave.title}" saved successfully! It is now live in the practice bank and IDE.`,
    });

    if (!editingSlug) {
      handleResetForm();
    }
  };

  // Delete Question
  const handleDelete = (slug: string) => {
    if (confirm(`Are you sure you want to delete question "${slug}"?`)) {
      deleteCustomProblem(slug);
      loadQuestions();
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const questions = getAllProblems();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `codearena_questions_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Download Sample Template
  const handleDownloadTemplate = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(DEFAULT_SAMPLE_JSON, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "codearena_sample_question_template.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Process Uploaded File with strict security validation (.json, .pdf, .txt, .md)
  const processUploadedFile = (file: File) => {
    setImportFeedback(null);
    const fileName = file.name;
    const fileExt = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const fileSizeStr = file.size < 1024 * 1024 ? `${Math.round(file.size / 1024)} KB` : `${fileSizeMB} MB`;

    // Strictly whitelist secure document formats
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
        message: `⛔ Security Alert: Unsupported format ".${fileExt}". For application security and stability, only verified .JSON, .PDF, and .MD question files are allowed.`,
      });
      setParsedImportItems([]);
      return;
    }

    // Safety size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setLoadedFileInfo({
        name: fileName,
        size: fileSizeStr,
        format: fileExt.toUpperCase(),
        valid: false,
      });
      setImportFeedback({
        type: "error",
        message: `⛔ File exceeds safety limit (${fileSizeStr}). Maximum allowed file size is 10 MB to ensure high performance.`,
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
      // PDF, Markdown, or plain text problem sheets
      reader.onload = (e) => {
        const rawContent = String(e.target?.result || "");
        setImportJsonText(rawContent);
        parsePdfOrTextProblemSheet(rawContent, fileName, formatType);
      };
      reader.readAsText(file);
    }
  };

  // Structured PDF / Text Question Extractor
  const parsePdfOrTextProblemSheet = (content: string, fileName: string, formatType: string) => {
    try {
      const cleanText = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ").trim();
      if (!cleanText || cleanText.length < 10) {
        throw new Error("Document does not contain readable problem text.");
      }

      // Detect multiple questions if formatted with headers
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
          : ["1 <= n <= 10^5", "All inputs are within standard algorithmic memory bounds."];

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
          description: block.slice(0, 800).trim() || `Solve ${cleanTitle}. Read the full document constraints carefully.`,
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
        message: `✓ Successfully verified and extracted ${parsedQuestions.length} question(s) from ${formatType} file "${fileName}". Review the problems below and click "Import & Publish" to go live.`,
      });
    } catch (err: any) {
      setImportFeedback({
        type: "error",
        message: `Failed to extract questions from ${formatType} file: ${err.message}`,
      });
      setParsedImportItems([]);
    }
  };

  // Parse File Drop / Import Text
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

        const publicCases = (q.publicTestCases || q.testCases || []).map((tc: any, tcIdx: number) => ({
          input: tc.input || `Test ${tcIdx + 1}`,
          output: String(tc.output ?? tc.expected ?? ""),
          args: Array.isArray(tc.args) ? tc.args : [tc.input],
          expected: tc.expected !== undefined ? tc.expected : tc.output,
        }));

        const hiddenCases = (q.hiddenTestCases || []).map((tc: any, tcIdx: number) => ({
          input: tc.input || `Hidden ${tcIdx + 1}`,
          output: String(tc.output ?? tc.expected ?? ""),
          args: Array.isArray(tc.args) ? tc.args : [tc.input],
          expected: tc.expected !== undefined ? tc.expected : tc.output,
        }));

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
        message: `✓ Successfully verified and parsed ${validated.length} question(s)${
          fileName ? ` from "${fileName}"` : ""
        }. Review below and click "Import All Questions" to publish.`,
      });
    } catch (err: any) {
      setImportFeedback({ type: "error", message: `Invalid or Malformed JSON format: ${err.message}` });
      setParsedImportItems([]);
    }
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Handle File Input Change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  // Execute Bulk Import
  const handleExecuteImport = async () => {
    if (parsedImportItems.length === 0) return;

    for (const item of parsedImportItems) {
      saveCustomProblem(item);
    }

    try {
      await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedImportItems),
      });
    } catch (e) {}

    loadQuestions();
    setImportFeedback({
      type: "success",
      message: `🎉 Successfully imported and published ${parsedImportItems.length} question(s) to the platform!`,
    });
    setParsedImportItems([]);
    setImportJsonText("");
    setLoadedFileInfo(null);
  };
  // Remove single staged question from import queue
  const handleRemoveParsedItem = (idx: number) => {
    const updated = parsedImportItems.filter((_, i) => i !== idx);
    setParsedImportItems(updated);
    if (updated.length === 0) {
      setImportFeedback(null);
    } else {
      setImportFeedback({
        type: "success",
        message: `Removed question. ${updated.length} question(s) remaining in staging queue.`,
      });
    }
  };

  // Clear imported file & staging
  const handleClearImportedFile = () => {
    setLoadedFileInfo(null);
    setImportJsonText("");
    setParsedImportItems([]);
    setImportFeedback(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      const matchTopic = q.topics.some((t) => t.name.toLowerCase().includes(query));
      if (!matchTitle && !matchSlug && !matchTopic) return false;
    }
    return true;
  });

  // Security Passcode Gate if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 selection:bg-primary/30">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-destructive/10 border border-destructive/20 items-center justify-center text-3xl mb-2 shadow-lg">
              🛡️
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">CodeArena Admin Portal</h1>
            <p className="text-xs text-muted-foreground">
              Super-Administrator authorization required to manage questions and contests.
            </p>
          </div>

          <Card className="border-border/80 shadow-2xl bg-card/80 backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Admin Authentication</CardTitle>
              <CardDescription className="text-xs">
                Enter your authorized administrator password to access the platform control studio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyPasscode} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="passcode" className="text-xs font-bold">Admin Password</Label>
                  <Input
                    id="passcode"
                    type="password"
                    placeholder="Enter Admin Password"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setPasscodeError("");
                    }}
                    required
                    autoFocus
                    className="h-10 text-sm font-mono tracking-wider"
                  />
                </div>

                {passcodeError && (
                  <p className="text-xs font-semibold text-destructive bg-destructive/10 p-2.5 rounded-lg border border-destructive/20 animate-in fade-in">
                    {passcodeError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={verifying || !passcode.trim()}
                  className="w-full h-10 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                >
                  {verifying ? "Verifying Credentials..." : "Sign In to Admin Studio →"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-[11px] text-muted-foreground/70 font-mono">
            🔒 CodeArena Security • Authorized Administrators Only
          </div>
        </div>
      </div>
    );
  }

  // Full Admin Portal (Directly rendered for Admin)
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl border-border/80 shadow-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-extrabold text-xl tracking-tight text-foreground flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-destructive to-purple-600 flex items-center justify-center text-primary-foreground font-black text-sm shadow-md">
                🛡️
              </div>
              Code<span className="text-primary">Arena</span> <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/15 text-destructive font-mono font-bold border border-destructive/30">ADMIN</span>
            </Link>
          </div>

          <nav className="hidden md:flex gap-6 text-xs font-semibold items-center">
            <button
              onClick={() => setActiveTab("questions")}
              className={`transition-colors ${activeTab === "questions" ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground"}`}
            >
              Question Bank ({allQuestions.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("contests");
                loadContests();
              }}
              className={`transition-colors flex items-center gap-1.5 ${activeTab === "contests" ? "text-amber-400 border-b-2 border-amber-400 pb-1 font-bold" : "text-amber-400/80 hover:text-amber-300"}`}
            >
              <span>🏆</span> Contests Studio ({contestsList.length})
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`transition-colors ${activeTab === "create" ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground"}`}
            >
              Manual Creator
            </button>
            <button
              onClick={() => setActiveTab("import")}
              className={`transition-colors ${activeTab === "import" ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground"}`}
            >
              File Drop / Import
            </button>
            <button
              onClick={() => setActiveTab("system")}
              className={`transition-colors ${activeTab === "system" ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground"}`}
            >
              System Health
            </button>
            <button
              onClick={() => {
                setActiveTab("users");
                loadUsers();
              }}
              className={`transition-colors ${activeTab === "users" ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground"}`}
            >
              Users & Access ({allUsersList.length})
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-[11px] font-mono font-bold text-destructive">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              SUPER-ADMIN
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLockAdmin}
              className="h-8 text-xs font-bold shadow-sm gap-1.5"
              title="Lock Admin and require password again"
            >
              <span>🔒</span> Lock & Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 container mx-auto px-6 py-8 space-y-6 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 border-border/60">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Question Operations & Content Studio</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Add, edit, drop files, and manage algorithmic problems across the platform with immediate IDE synchronization.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={activeTab === "questions" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("questions")}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <span>📚</span> All Problems ({allQuestions.length})
              </Button>
              <Button
                variant={activeTab === "contests" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveTab("contests");
                  loadContests();
                }}
                className="h-8 text-xs font-bold gap-1.5 border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
              >
                <span>🏆</span> Contests Studio ({contestsList.length})
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleResetForm();
                  setActiveTab("create");
                }}
                className="h-8 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
              >
                <span>➕</span> Create Question
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("import")}
                className="h-8 text-xs font-semibold gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
              >
                <span>📁</span> Drop / Import File
              </Button>
              <Button
                variant={activeTab === "users" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveTab("users");
                  loadUsers();
                }}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <span>👥</span> Users & Access
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportJson}
                className="h-8 text-xs font-semibold gap-1.5"
                title="Download complete JSON backup of all problems"
              >
                <span>📥</span> Export JSON
              </Button>
            </div>
          </div>

          {/* TAB 1: QUESTION BANK LIST */}
          <TabsContent value="questions" className="space-y-4 m-0 focus-visible:outline-none">
            {/* Reorder Status Feedback Toast */}
            {orderFeedback && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between animate-in fade-in shadow-sm">
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <span>{orderFeedback}</span>
                </div>
                <span className="text-[10px] text-emerald-300 font-mono">Syncing globally...</span>
              </div>
            )}

            {/* Filter, Search, and Reordering Toolbar */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-card border border-border/80 shadow-sm">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="w-full md:w-80">
                  <Input
                    placeholder="Search by title, slug, or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <span className="text-xs text-muted-foreground font-semibold">Filter:</span>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="h-9 text-xs rounded-md bg-secondary px-3 py-1 border border-border font-medium"
                  >
                    <option value="ALL">All Difficulties</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-9 text-xs rounded-md bg-secondary px-3 py-1 border border-border font-medium"
                  >
                    <option value="ALL">All Sources</option>
                    <option value="CUSTOM">Custom Admin Only ({customSlugs.size})</option>
                    <option value="BUILT_IN">Built-in Only ({allQuestions.length - customSlugs.size})</option>
                  </select>
                </div>
              </div>

              {/* Order Tools Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                  <span className="text-primary font-bold">⠿ Drag & Drop:</span>
                  <span>Grab the drag handles to reorder questions in real-time.</span>
                  {isCustomOrderActive && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                      Custom Order Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSortByDifficulty}
                    className="h-7 text-[11px] font-bold gap-1 border-primary/40 text-primary hover:bg-primary/10"
                    title="Strictly arrange 50 Easy -> 50 Medium -> 50 Hard"
                  >
                    <span>🎯</span> Tier by Difficulty (50 Easy → 50 Medium → 50 Hard)
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetToDefaultOrder}
                    className="h-7 text-[11px] text-muted-foreground hover:text-foreground gap-1"
                    title="Reset to factory default sequence"
                  >
                    <span>🔄</span> Reset Order
                  </Button>
                </div>
              </div>
            </div>

            {/* Questions Table */}
            <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/60 text-muted-foreground uppercase tracking-wider font-mono text-[10px] border-b border-border">
                    <tr>
                      <th className="py-3 px-3 text-center w-12">#</th>
                      <th className="py-3 px-2 text-center w-14">Order</th>
                      <th className="py-3 px-4">Title & Slug</th>
                      <th className="py-3 px-4">Difficulty</th>
                      <th className="py-3 px-4">Topics</th>
                      <th className="py-3 px-4">Method Name</th>
                      <th className="py-3 px-4">Test Cases</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-muted-foreground">
                          No questions matched your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredQuestions.map((q, idx) => {
                        const isCustom = customSlugs.has(q.slug);
                        const totalCases = (q.publicTestCases?.length || 0) + (q.hiddenTestCases?.length || 0);
                        const isBeingDragged = draggedIndex === idx;
                        const isTargeted = dragOverIndex === idx && draggedIndex !== idx;

                        return (
                          <tr
                            key={q.slug}
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDropRow(e, idx)}
                            onDragEnd={handleDragEnd}
                            className={`transition-all ${
                              isBeingDragged
                                ? "opacity-30 bg-secondary/80 scale-[0.99]"
                                : isTargeted
                                ? "bg-primary/20 border-y-2 border-primary"
                                : "hover:bg-secondary/30"
                            }`}
                          >
                            {/* Sequence Number */}
                            <td className="py-3.5 px-3 text-center font-mono text-muted-foreground font-bold text-[11px]">
                              {idx + 1}
                            </td>

                            {/* Drag Handle & Quick Move Arrows */}
                            <td className="py-3.5 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <span
                                  className="cursor-grab active:cursor-grabbing text-base text-muted-foreground hover:text-primary transition-colors select-none p-1"
                                  title="Click and drag to reposition"
                                >
                                  ⠿
                                </span>
                                <div className="flex flex-col gap-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveQuestion(q.slug, "UP")}
                                    disabled={idx === 0}
                                    className="text-[9px] text-muted-foreground hover:text-foreground disabled:opacity-20 px-1 py-0.2 rounded hover:bg-secondary"
                                    title="Move up"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveQuestion(q.slug, "DOWN")}
                                    disabled={idx === filteredQuestions.length - 1}
                                    className="text-[9px] text-muted-foreground hover:text-foreground disabled:opacity-20 px-1 py-0.2 rounded hover:bg-secondary"
                                    title="Move down"
                                  >
                                    ▼
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Title & Slug */}
                            <td className="py-3.5 px-4 font-semibold">
                              <div className="text-foreground text-xs font-bold flex items-center gap-1.5">
                                <span>{q.title}</span>
                              </div>
                              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{q.slug}</div>
                            </td>

                            {/* Difficulty */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  q.difficulty === "EASY"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    : q.difficulty === "MEDIUM"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                }`}
                              >
                                {q.difficulty}
                              </span>
                            </td>

                            {/* Topics */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {q.topics?.slice(0, 3).map((t, tIdx) => (
                                  <span key={tIdx} className="px-1.5 py-0.5 rounded bg-secondary text-[10px] text-foreground font-medium">
                                    {t.name}
                                  </span>
                                ))}
                                {q.topics && q.topics.length > 3 && (
                                  <span className="text-[10px] text-muted-foreground font-mono">+{q.topics.length - 3}</span>
                                )}
                              </div>
                            </td>

                            {/* Method Name */}
                            <td className="py-3.5 px-4 font-mono text-[11px] text-primary">
                              {q.methodName || "solution"}()
                            </td>

                            {/* Test Cases */}
                            <td className="py-3.5 px-4 font-mono text-xs">
                              {totalCases} cases ({q.publicTestCases?.length || 0} pub / {q.hiddenTestCases?.length || 0} hid)
                            </td>

                            {/* Source */}
                            <td className="py-3.5 px-4">
                              {isCustom ? (
                                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold border border-primary/30">
                                  Custom Admin
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-medium border border-border">
                                  Built-in
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditQuestion(q)}
                                  className="h-7 px-2.5 text-[11px]"
                                >
                                  Edit
                                </Button>

                                <Link href={`/problems/${q.slug}`} target="_blank">
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px] text-primary hover:text-primary">
                                    ▶ IDE
                                  </Button>
                                </Link>

                                {isCustom && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDelete(q.slug)}
                                    className="h-7 px-2 text-[11px] text-destructive hover:bg-destructive/10"
                                  >
                                    ✕
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: MANUAL QUESTION CREATOR / EDITOR */}
          <TabsContent value="create" className="space-y-6 m-0 focus-visible:outline-none">
            <Card className="shadow-lg border-border/80 bg-card">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-xl">
                    {editingSlug ? `Editing Question: ${formData.title}` : "Create & Publish New Question"}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Configure question parameters, test cases, and starter code. Saved questions will be immediately available in the IDE.
                  </CardDescription>
                </div>
                {editingSlug && (
                  <Button variant="outline" size="sm" onClick={handleResetForm} className="text-xs h-8">
                    Cancel Edit (Create New)
                  </Button>
                )}
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSaveQuestion} className="space-y-6">
                  {/* Basic Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="title" className="text-xs font-bold">Problem Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g. Valid Palindrome"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="slug" className="text-xs font-bold">Problem Slug (URL identifier) *</Label>
                      <Input
                        id="slug"
                        placeholder="e.g. valid-palindrome"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                        className="h-9 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="difficulty" className="text-xs font-bold">Difficulty</Label>
                      <select
                        id="difficulty"
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                        className="w-full h-9 text-xs rounded-md bg-secondary px-3 py-1 border border-border font-medium"
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Method Name & Topics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="methodName" className="text-xs font-bold">
                        Target Method Name *
                      </Label>
                      <Input
                        id="methodName"
                        placeholder="e.g. isPalindrome"
                        value={formData.methodName}
                        onChange={(e) => setFormData({ ...formData, methodName: e.target.value })}
                        required
                        className="h-9 text-xs font-mono"
                      />
                      <p className="text-[10px] text-muted-foreground">The function name called during test evaluation.</p>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <Label className="text-xs font-bold">Topics & Categories</Label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {AVAILABLE_TOPICS.map((topic) => {
                          const selected = formData.topics.includes(topic);
                          return (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => toggleTopic(topic)}
                              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                                selected
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "bg-secondary text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {selected ? "✓ " : ""}{topic}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          placeholder="Add custom topic..."
                          value={formData.customTopicInput}
                          onChange={(e) => setFormData({ ...formData, customTopicInput: e.target.value })}
                          className="h-8 text-xs max-w-xs"
                        />
                        <Button type="button" size="sm" variant="outline" onClick={handleAddCustomTopic} className="h-8 text-xs">
                          Add Topic
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Description & Constraints */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="description" className="text-xs font-bold">Problem Description (Markdown supported)</Label>
                      <textarea
                        id="description"
                        rows={6}
                        placeholder="Explain the problem statement, parameters, return format, and edge cases..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded-md bg-secondary/50 p-3 text-xs border border-border font-sans focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="constraints" className="text-xs font-bold">Constraints (1 per line)</Label>
                      <textarea
                        id="constraints"
                        rows={6}
                        placeholder="e.g.&#10;1 <= nums.length <= 10^5&#10;-10^9 <= nums[i] <= 10^9"
                        value={formData.constraintsText}
                        onChange={(e) => setFormData({ ...formData, constraintsText: e.target.value })}
                        className="w-full rounded-md bg-secondary/50 p-3 text-xs border border-border font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Test Cases Builder */}
                  <div className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border/80">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">Test Cases Builder ({testCases.length})</h3>
                        <p className="text-[11px] text-muted-foreground">Define inputs, JSON arguments, and expected outputs for automatic evaluation.</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTestCases([
                            ...testCases,
                            { input: "", output: "", argsStr: "[]", expectedStr: '""', isPublic: true },
                          ]);
                        }}
                        className="h-8 text-xs font-semibold gap-1"
                      >
                        <span>➕</span> Add Test Case
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {testCases.map((tc, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-card border border-border/70 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary font-mono">Case #{idx + 1}</span>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={tc.isPublic}
                                  onChange={(e) => {
                                    const updated = [...testCases];
                                    updated[idx].isPublic = e.target.checked;
                                    setTestCases(updated);
                                  }}
                                  className="rounded"
                                />
                                <span>Public Example</span>
                              </label>

                              {testCases.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTestCases(testCases.filter((_, i) => i !== idx));
                                  }}
                                  className="text-xs text-destructive hover:underline"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-[11px] text-muted-foreground">Display Input</Label>
                              <Input
                                placeholder='e.g. nums = [2,7,11,15], target = 9'
                                value={tc.input}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].input = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="h-8 text-xs font-mono"
                              />
                            </div>

                            <div>
                              <Label className="text-[11px] text-muted-foreground">Arguments JSON array [arg1, arg2, ...] *</Label>
                              <Input
                                placeholder='e.g. [[2,7,11,15], 9]'
                                value={tc.argsStr}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].argsStr = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="h-8 text-xs font-mono"
                              />
                            </div>

                            <div>
                              <Label className="text-[11px] text-muted-foreground">Display Output</Label>
                              <Input
                                placeholder='e.g. [0, 1]'
                                value={tc.output}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].output = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="h-8 text-xs font-mono"
                              />
                            </div>

                            <div>
                              <Label className="text-[11px] text-muted-foreground">Expected Return Value JSON *</Label>
                              <Input
                                placeholder='e.g. [0, 1] or true or 42'
                                value={tc.expectedStr}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].expectedStr = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="h-8 text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Starter Code Multi-Language Tabs */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold">Starter Code Templates</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const t = autoGenerateTemplates(formData.title, formData.methodName);
                          setFormData({
                            ...formData,
                            codeJs: t.codeJs,
                            codePy: t.codePy,
                            codeCpp: t.codeCpp,
                            codeJava: t.codeJava,
                          });
                        }}
                        className="h-7 text-[11px]"
                      >
                        🪄 Regenerate Templates
                      </Button>
                    </div>

                    <Tabs defaultValue="js" className="w-full">
                      <TabsList className="bg-secondary/60 h-8">
                        <TabsTrigger value="js" className="text-xs py-1">JavaScript</TabsTrigger>
                        <TabsTrigger value="py" className="text-xs py-1">Python 3</TabsTrigger>
                        <TabsTrigger value="cpp" className="text-xs py-1">C++</TabsTrigger>
                        <TabsTrigger value="java" className="text-xs py-1">Java</TabsTrigger>
                      </TabsList>

                      <TabsContent value="js" className="m-0 pt-2">
                        <textarea
                          rows={6}
                          value={formData.codeJs}
                          onChange={(e) => setFormData({ ...formData, codeJs: e.target.value })}
                          className="w-full rounded-md bg-secondary/80 p-3 text-xs font-mono border border-border focus:outline-none"
                        />
                      </TabsContent>

                      <TabsContent value="py" className="m-0 pt-2">
                        <textarea
                          rows={6}
                          value={formData.codePy}
                          onChange={(e) => setFormData({ ...formData, codePy: e.target.value })}
                          className="w-full rounded-md bg-secondary/80 p-3 text-xs font-mono border border-border focus:outline-none"
                        />
                      </TabsContent>

                      <TabsContent value="cpp" className="m-0 pt-2">
                        <textarea
                          rows={6}
                          value={formData.codeCpp}
                          onChange={(e) => setFormData({ ...formData, codeCpp: e.target.value })}
                          className="w-full rounded-md bg-secondary/80 p-3 text-xs font-mono border border-border focus:outline-none"
                        />
                      </TabsContent>

                      <TabsContent value="java" className="m-0 pt-2">
                        <textarea
                          rows={6}
                          value={formData.codeJava}
                          onChange={(e) => setFormData({ ...formData, codeJava: e.target.value })}
                          className="w-full rounded-md bg-secondary/80 p-3 text-xs font-mono border border-border focus:outline-none"
                        />
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Feedback Messages */}
                  {formFeedback && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                        formFeedback.type === "success"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      }`}
                    >
                      <span>{formFeedback.type === "success" ? "✓" : "⚠️"}</span>
                      <span>{formFeedback.message}</span>
                      {formFeedback.type === "success" && (
                        <Link href={`/problems/${formData.slug || autoGenerateTemplates(formData.title).slug}`} target="_blank" className="underline ml-auto font-bold">
                          Open in IDE &rarr;
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" className="h-10 px-8 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                      {editingSlug ? "Save Changes" : "Create & Publish Question"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleResetForm} className="h-10 text-xs">
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: SECURED DRAG & DROP FILE IMPORTER (.JSON, .PDF, .MD, .TXT) */}
          <TabsContent value="import" className="space-y-6 m-0 focus-visible:outline-none">
            <Card className="shadow-xl border-border/80 bg-card overflow-hidden">
              <CardHeader className="border-b pb-5 bg-gradient-to-r from-card via-secondary/30 to-card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="p-1.5 rounded-lg bg-primary/10 text-primary text-base">🛡️</span>
                      <CardTitle className="text-xl font-bold tracking-tight">Secured Question & Document Importer</CardTitle>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                        Anti-Crash Sandboxed
                      </span>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Upload verified algorithmic problem documents or JSON question arrays. Prevents crashes, malicious payloads, and memory overflow.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {loadedFileInfo && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearImportedFile}
                        className="h-8 text-xs font-semibold gap-1.5 text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                      >
                        ✕ Clear File
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadTemplate}
                      className="h-8 text-xs font-semibold gap-1.5 shadow-sm"
                    >
                      <span>📥</span> Download JSON Template
                    </Button>
                  </div>
                </div>

                {/* Whitelisted Formats & Security Badge */}
                <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">Secured Formats:</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      📄 .JSON <span className="text-[10px] font-normal opacity-80">(Standard Schema)</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      📑 .PDF <span className="text-[10px] font-normal opacity-80">(Problem Sheets)</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      📝 .MD <span className="text-[10px] font-normal opacity-80">(Markdown Specs)</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-500/10 text-slate-300 border border-slate-500/20">
                      📃 .TXT <span className="text-[10px] font-normal opacity-80">(Raw Text)</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                    <span>🔒 Max 10MB</span>
                    <span>•</span>
                    <span>Strict Type Isolation</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {/* Active Loaded File Card */}
                {loadedFileInfo && (
                  <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                    loadedFileInfo.valid
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-background/60 flex items-center justify-center text-xl shrink-0 shadow-inner">
                        {loadedFileInfo.format === "JSON" ? "📄" : loadedFileInfo.format === "PDF" ? "📑" : loadedFileInfo.format === "MARKDOWN" ? "📝" : "📃"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-foreground truncate">{loadedFileInfo.name}</p>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.2 rounded bg-secondary border border-border font-bold">
                            {loadedFileInfo.format}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Size: <span className="font-mono">{loadedFileInfo.size}</span> • {loadedFileInfo.valid ? "✓ Validated & Cleaned" : "⛔ Security Rejected"}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearImportedFile}
                      className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </Button>
                  </div>
                )}

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all relative overflow-hidden ${
                    isDragging
                      ? "border-primary bg-primary/10 scale-[1.01] shadow-lg ring-4 ring-primary/20"
                      : "border-border/80 hover:border-primary/50 hover:bg-secondary/40"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept=".json,.pdf,.txt,.md,application/json,application/pdf,text/markdown,text/plain"
                    className="hidden"
                  />
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-secondary/80 flex items-center justify-center text-3xl mb-3 shadow-inner group-hover:scale-110 transition-transform">
                    {isDragging ? "📥" : "📂"}
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    Drop your secured <span className="text-amber-400">.JSON</span>, <span className="text-rose-400">.PDF</span>, or <span className="text-sky-400">.MD</span> file here, or <span className="text-primary underline">browse</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-lg mx-auto">
                    Automatic multi-format problem parsing with test case generation and algorithmic scaffolding.
                  </p>
                </div>

                {/* Direct Paste / Raw Content Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="jsonText" className="text-xs font-bold flex items-center gap-1.5">
                      <span>⌨️</span> Direct Text / JSON / Markdown Parser
                    </Label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const sample = JSON.stringify(DEFAULT_SAMPLE_JSON, null, 2);
                          setImportJsonText(sample);
                          parseAndValidateJson(sample);
                        }}
                        className="text-[11px] text-primary hover:underline font-semibold"
                      >
                        Paste Sample JSON
                      </button>
                      {importJsonText && (
                        <button
                          type="button"
                          onClick={() => {
                            setImportJsonText("");
                            setParsedImportItems([]);
                            setImportFeedback(null);
                          }}
                          className="text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          Clear Text
                        </button>
                      )}
                    </div>
                  </div>
                  <textarea
                    id="jsonText"
                    rows={6}
                    placeholder="Paste raw JSON question array, Markdown problem write-up, or text problem sheet..."
                    value={importJsonText}
                    onChange={(e) => {
                      setImportJsonText(e.target.value);
                      if (e.target.value.trim()) {
                        if (e.target.value.trim().startsWith("{") || e.target.value.trim().startsWith("[")) {
                          parseAndValidateJson(e.target.value);
                        } else {
                          parsePdfOrTextProblemSheet(e.target.value, "pasted-content.txt", "TEXT");
                        }
                      } else {
                        setParsedImportItems([]);
                        setImportFeedback(null);
                      }
                    }}
                    className="w-full rounded-xl bg-secondary/40 p-3 text-xs font-mono border border-border/80 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Feedback Notification Banner */}
                {importFeedback && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-3 animate-in fade-in duration-200 ${
                      importFeedback.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    }`}
                  >
                    <span className="text-sm mt-0.5">{importFeedback.type === "success" ? "✓" : "⚠️"}</span>
                    <div className="flex-1 leading-relaxed">{importFeedback.message}</div>
                  </div>
                )}

                {/* Parsed Preview Table & Publish Action */}
                {parsedImportItems.length > 0 && (
                  <div className="space-y-4 pt-2 border-t border-border/80">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <span>📋</span> Verified Questions Ready to Import ({parsedImportItems.length})
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Review parsed questions, test case counts, and scaffolding before committing to the database.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setParsedImportItems([]);
                            setImportFeedback(null);
                          }}
                          className="h-9 text-xs"
                        >
                          Discard
                        </Button>
                        <Button
                          onClick={handleExecuteImport}
                          className="h-9 px-6 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md gap-1.5"
                        >
                          <span>🚀</span> Import & Publish All ({parsedImportItems.length})
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-secondary/60 text-muted-foreground uppercase text-[10px] font-mono border-b border-border">
                            <tr>
                              <th className="py-3 px-3 w-10 text-center">#</th>
                              <th className="py-3 px-3">Question Title</th>
                              <th className="py-3 px-3">Slug</th>
                              <th className="py-3 px-3">Difficulty</th>
                              <th className="py-3 px-3">Topics</th>
                              <th className="py-3 px-3">Method Signature</th>
                              <th className="py-3 px-3">Test Cases</th>
                              <th className="py-3 px-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60">
                            {parsedImportItems.map((item, i) => (
                              <tr key={i} className="hover:bg-secondary/30 transition-colors">
                                <td className="py-3 px-3 font-mono text-[10px] text-center text-muted-foreground">
                                  {i + 1}
                                </td>
                                <td className="py-3 px-3 font-bold text-foreground">
                                  {item.title}
                                </td>
                                <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground">
                                  {item.slug}
                                </td>
                                <td className="py-3 px-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                      item.difficulty === "EASY"
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : item.difficulty === "MEDIUM"
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    }`}
                                  >
                                    {item.difficulty}
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="flex flex-wrap gap-1">
                                    {item.topics.slice(0, 2).map((t, tIdx) => (
                                      <span key={tIdx} className="px-1.5 py-0.2 rounded text-[10px] bg-secondary text-muted-foreground border border-border">
                                        {t.name}
                                      </span>
                                    ))}
                                    {item.topics.length > 2 && (
                                      <span className="text-[10px] text-muted-foreground font-mono">
                                        +{item.topics.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-3 font-mono text-primary text-[11px]">
                                  {item.methodName}()
                                </td>
                                <td className="py-3 px-3 font-mono text-[11px]">
                                  <span className="text-emerald-400 font-bold">{item.publicTestCases?.length || 0} public</span>
                                  {item.hiddenTestCases && item.hiddenTestCases.length > 0 && (
                                    <span className="text-muted-foreground ml-1.5">
                                      + {item.hiddenTestCases.length} hidden
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveParsedItem(i)}
                                    title="Remove from import queue"
                                    className="p-1 rounded text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: SYSTEM HEALTH & STATS */}
          <TabsContent value="system" className="space-y-6 m-0 focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card shadow-sm border-border/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Total Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-foreground">{allQuestions.length}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Available in practice bank</p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-sm border-border/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Custom Admin Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-primary">{customSlugs.size}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Created / imported by you</p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-sm border-border/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Built-in Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-foreground">{allQuestions.length - customSlugs.size}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Factory curated set</p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-sm border-border/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Connected Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-emerald-400">{getAllAccounts().length}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Logged in on this browser</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg border-border/80 bg-card">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg">Maintenance & Operations</CardTitle>
                <CardDescription className="text-xs">
                  Tools to manage local storage caches and platform data integrity.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/40 border border-border">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Export All Platform Data</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Download full JSON archive of all built-in and custom questions with complete test suites.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExportJson} className="h-8 text-xs shrink-0">
                    Export Backup (.json)
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/40 border border-border">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Reset Custom Questions</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Clear all custom questions created in admin and revert strictly to default factory questions.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete all custom questions? This action cannot be undone.")) {
                        localStorage.removeItem("customProblems");
                        loadQuestions();
                        alert("Custom questions reset to factory defaults.");
                      }
                    }}
                    className="h-8 text-xs shrink-0"
                  >
                    Reset to Factory
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: USER MANAGEMENT */}
          <TabsContent value="users" className="space-y-6 m-0 focus-visible:outline-none">
            <Card className="bg-card/80 backdrop-blur-md border-border/80 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <span>👥</span> Platform User Accounts & Access Controls
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-1">
                      Manage administrator roles, review user algorithmic progress, and control system privileges.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search by username or name..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="h-8 text-xs w-64 bg-background"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadUsers}
                      className="h-8 text-xs font-semibold gap-1"
                    >
                      <span>🔄</span> Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {userRoleFeedback && (
                  <div className="m-4 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <span>✅</span>
                    <span>{userRoleFeedback}</span>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/40 border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3.5 font-bold">User</th>
                        <th className="px-5 py-3.5 font-bold hidden sm:table-cell">Organization</th>
                        <th className="px-5 py-3.5 font-bold">Role</th>
                        <th className="px-5 py-3.5 font-bold text-right">Solved</th>
                        <th className="px-5 py-3.5 font-bold text-right text-primary">DSA Rating</th>
                        <th className="px-5 py-3.5 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {loadingUsers ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground animate-pulse">
                            Loading platform users...
                          </td>
                        </tr>
                      ) : allUsersList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                            No users registered yet.
                          </td>
                        </tr>
                      ) : (
                        allUsersList
                          .filter((u) => {
                            if (!userSearchQuery.trim()) return true;
                            const q = userSearchQuery.toLowerCase().trim();
                            return (
                              u.username.toLowerCase().includes(q) ||
                              u.name.toLowerCase().includes(q) ||
                              (u.org && u.org.toLowerCase().includes(q))
                            );
                          })
                          .map((u) => {
                            const isSuper = u.role === "SUPER_ADMIN";
                            return (
                              <tr key={u.userId || u.username} className="hover:bg-muted/20 transition-colors">
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-bold text-xs text-primary-foreground">
                                      {u.name ? u.name[0].toUpperCase() : "U"}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-foreground text-xs">{u.name}</p>
                                      <p className="text-[11px] text-muted-foreground font-mono">@{u.username}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-3.5 hidden sm:table-cell text-xs text-muted-foreground">
                                  {u.org || "CodeArena Academy"}
                                </td>
                                <td className="px-5 py-3.5">
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                      isSuper
                                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                        : "bg-secondary text-secondary-foreground border-border"
                                    }`}
                                  >
                                    {u.role}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-right font-mono text-xs font-semibold">
                                  {u.problemsSolved}
                                </td>
                                <td className="px-5 py-3.5 text-right font-mono text-xs font-bold text-primary">
                                  {u.score}
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                  <Button
                                    size="sm"
                                    variant={isSuper ? "destructive" : "outline"}
                                    onClick={() => handleToggleUserRole(u.username, u.role)}
                                    className="h-7 text-[11px] font-semibold"
                                  >
                                    {isSuper ? "Revoke Admin" : "Make Super Admin"}
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: CONTESTS STUDIO & MANAGEMENT */}
          <TabsContent value="contests" className="space-y-6 m-0 focus-visible:outline-none">
            {/* Feedback alert */}
            {contestFeedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
                  contestFeedback.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                }`}
              >
                <span>{contestFeedback.message}</span>
                <button onClick={() => setContestFeedback(null)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>
            )}

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-card border border-border shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg font-bold">
                  🟢
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase">Live Now</p>
                  <p className="text-xl font-black">{contestsList.filter(c => c.status === "LIVE").length} Active</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-lg font-bold">
                  ⏱️
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase">Upcoming Scheduled</p>
                  <p className="text-xl font-black">{contestsList.filter(c => c.status === "UPCOMING").length} Scheduled</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center text-lg font-bold">
                  📚
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase">DSA Questions Available</p>
                  <p className="text-xl font-black">{allQuestions.length} Problems</p>
                </div>
              </div>
            </div>

            {/* Create & Launch Contest Builder */}
            <Card className="border-border/80 shadow-sm overflow-hidden">
              <CardHeader className="bg-secondary/40 border-b border-border/60 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <span>🚀</span> Create & Launch New Contest
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Pick questions from the 150 DSA bank, set timing & duration, and start contests instantly for all students.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Contest Title */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Contest Title *</Label>
                    <Input
                      placeholder="e.g. CodeArena Weekly Battle #42"
                      value={contestFormData.title}
                      onChange={(e) => setContestFormData({ ...contestFormData, title: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Duration (Minutes)</Label>
                    <select
                      value={contestFormData.durationMinutes}
                      onChange={(e) => setContestFormData({ ...contestFormData, durationMinutes: Number(e.target.value) })}
                      className="w-full h-9 text-xs rounded-md bg-secondary px-3 py-1 border border-border font-medium"
                    >
                      <option value={30}>30 Minutes (Sprint)</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>60 Minutes (1 Hour Standard)</option>
                      <option value={90}>90 Minutes (1.5 Hours)</option>
                      <option value={120}>120 Minutes (2 Hours ICPC)</option>
                      <option value={180}>180 Minutes (3 Hours)</option>
                    </select>
                  </div>

                  {/* Contest Description */}
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs font-bold">Description & Instructions</Label>
                    <Input
                      placeholder="Brief rules, topics covered, or description for contestants..."
                      value={contestFormData.description}
                      onChange={(e) => setContestFormData({ ...contestFormData, description: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>

                  {/* Timing Option */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-bold">Contest Start Time</Label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setContestFormData({ ...contestFormData, startTimeOption: "now" })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          contestFormData.startTimeOption === "now"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                        }`}
                      >
                        🟢 Start Immediately (Live Now)
                      </button>

                      <button
                        type="button"
                        onClick={() => setContestFormData({ ...contestFormData, startTimeOption: "15min" })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          contestFormData.startTimeOption === "15min"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                        }`}
                      >
                        ⏱️ In 15 Minutes
                      </button>

                      <button
                        type="button"
                        onClick={() => setContestFormData({ ...contestFormData, startTimeOption: "1hour" })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          contestFormData.startTimeOption === "1hour"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                        }`}
                      >
                        ⏱️ In 1 Hour
                      </button>

                      <button
                        type="button"
                        onClick={() => setContestFormData({ ...contestFormData, startTimeOption: "custom" })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          contestFormData.startTimeOption === "custom"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                        }`}
                      >
                        📅 Custom Date & Time
                      </button>
                    </div>

                    {contestFormData.startTimeOption === "custom" && (
                      <div className="pt-2 max-w-sm space-y-1">
                        <Input
                          type="datetime-local"
                          value={contestFormData.customStartTime || getFutureDateTimeLocalString(60)}
                          onChange={(e) => setContestFormData({ ...contestFormData, customStartTime: e.target.value })}
                          className="h-9 text-xs"
                        />
                        <p className="text-[10px] text-muted-foreground">Select the future date & time when the contest should open for all students.</p>
                      </div>
                    )}

                    {/* Live Timing & Schedule Status Banner */}
                    {(() => {
                      const preview = getComputedContestTiming(
                        contestFormData.startTimeOption,
                        contestFormData.customStartTime,
                        contestFormData.durationMinutes
                      );
                      const isLive = preview.status === "LIVE";
                      return (
                        <div className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2 ${
                          isLive
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-blue-500/10 border-blue-500/30 text-blue-300"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-base">{isLive ? "🟢" : "📅"}</span>
                            <div>
                              <p className="font-bold text-foreground">
                                {isLive ? "Immediate Live Launch" : `Scheduled Start: ${preview.startFormatted}`}
                              </p>
                              <p className="text-[11px] opacity-80">
                                Duration: {contestFormData.durationMinutes}m • Concludes at {preview.endFormatted}
                              </p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                            isLive
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-blue-500/20 text-blue-200 border-blue-500/30"
                          }`}>
                            {isLive ? "Status: LIVE NOW" : "Status: UPCOMING (SCHEDULED)"}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Question Selector from 150 Question Bank */}
                <div className="space-y-3 pt-2 border-t border-border/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label className="text-xs font-bold">
                        Select Contest Questions ({contestFormData.selectedProblems.length} selected)
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        Browse the 150 DSA questions below. Click to add/remove and adjust point values.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAutoPickContestProblems}
                        className="h-8 text-xs font-bold gap-1 bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                      >
                        <span>⚡</span> Auto-Pick 4 Problems
                      </Button>
                      {contestFormData.selectedProblems.length > 0 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setContestFormData(prev => ({ ...prev, selectedProblems: [] }))}
                          className="h-8 text-xs text-rose-400 hover:text-rose-300"
                        >
                          Clear
                        </Button>
                      )}
                      <Input
                        placeholder="Search 150 questions..."
                        value={contestProblemSearch}
                        onChange={(e) => setContestProblemSearch(e.target.value)}
                        className="h-8 text-xs w-44"
                      />
                      <select
                        value={contestProblemDiffFilter}
                        onChange={(e) => setContestProblemDiffFilter(e.target.value)}
                        className="h-8 text-xs rounded-md bg-secondary px-2 border border-border font-medium"
                      >
                        <option value="ALL">All Diff</option>
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Selected Problems summary bar */}
                  {contestFormData.selectedProblems.length > 0 && (
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                      <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                        Contest Problem Queue:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {contestFormData.selectedProblems.map((p, idx) => (
                          <div
                            key={p.problemSlug}
                            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-card border border-border text-xs shadow-sm"
                          >
                            <span className="font-mono font-bold text-primary">Q{idx + 1}</span>
                            <span className="font-semibold">{p.title}</span>
                            <span className={`text-[10px] font-bold px-1 rounded ${
                              p.difficulty === "EASY" ? "bg-emerald-500/10 text-emerald-500" :
                              p.difficulty === "MEDIUM" ? "bg-amber-500/10 text-amber-500" :
                              "bg-rose-500/10 text-rose-500"
                            }`}>
                              {p.difficulty}
                            </span>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={50}
                                max={1000}
                                step={50}
                                value={p.points}
                                onChange={(e) => handleUpdateContestProblemPoints(p.problemSlug, Number(e.target.value))}
                                className="w-14 h-6 text-[11px] rounded bg-secondary px-1 border border-border text-center font-mono font-bold"
                              />
                              <span className="text-[10px] text-muted-foreground">pts</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleProblemInContest({ slug: p.problemSlug } as any)}
                              className="text-muted-foreground hover:text-rose-500 font-bold ml-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scrollable Question Picker Grid */}
                  <div className="max-h-60 overflow-y-auto rounded-xl border border-border/80 bg-secondary/20 p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {allQuestions
                      .filter(q => {
                        if (contestProblemDiffFilter !== "ALL" && q.difficulty !== contestProblemDiffFilter) return false;
                        if (contestProblemSearch.trim()) {
                          const query = contestProblemSearch.toLowerCase();
                          return q.title.toLowerCase().includes(query) || q.slug.toLowerCase().includes(query);
                        }
                        return true;
                      })
                      .map(prob => {
                        const isSelected = contestFormData.selectedProblems.some(p => p.problemSlug === prob.slug);
                        return (
                          <div
                            key={prob.slug}
                            onClick={() => handleToggleProblemInContest(prob)}
                            className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                              isSelected
                                ? "bg-primary/10 border-primary text-foreground shadow-sm"
                                : "bg-card border-border/60 hover:border-border hover:bg-secondary/40 text-muted-foreground"
                            }`}
                          >
                            <div className="truncate space-y-0.5">
                              <p className={`font-semibold truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
                                {prob.title}
                              </p>
                              <span className={`text-[10px] font-bold px-1 rounded ${
                                prob.difficulty === "EASY" ? "bg-emerald-500/10 text-emerald-500" :
                                prob.difficulty === "MEDIUM" ? "bg-amber-500/10 text-amber-500" :
                                "bg-rose-500/10 text-rose-500"
                              }`}>
                                {prob.difficulty}
                              </span>
                            </div>

                            <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                              isSelected ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
                            }`}>
                              {isSelected ? "✓" : "+"}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Launch Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCreateContest(false)}
                    className="h-9 text-xs font-bold gap-1.5"
                  >
                    <span>⏱️</span> Schedule Contest
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleCreateContest(true)}
                    className="h-9 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <span>🚀</span> Create & Start Contest Now!
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Existing Contests Management List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <span>📋</span> Contests on Platform ({contestsList.length})
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm("Are you sure you want to clear all contests? This will remove all scheduled and live contests.")) {
                        clearAllContests();
                        loadContests();
                      }
                    }}
                    className="h-8 text-xs font-semibold text-rose-400 border-rose-500/30 hover:bg-rose-500/10 gap-1"
                  >
                    <span>🗑️</span> Clear All Contests
                  </Button>
                </div>
              </div>

              {contestsList.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card space-y-3">
                  <span className="text-3xl block">🏆</span>
                  <h4 className="text-sm font-bold">No Contests Created Yet</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Use the 'Create & Launch New Contest' form above to pick questions, set time, and start live contests for students.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contestsList.map(contest => {
                    const isLive = contest.status === "LIVE";
                    const isUpcoming = contest.status === "UPCOMING";
                    const totalPoints = contest.problems.reduce((sum, p) => sum + p.points, 0);

                    return (
                      <Card
                        key={contest.id}
                        className={`border transition-all overflow-hidden ${
                          isLive
                            ? "border-emerald-500/50 bg-gradient-to-br from-card to-emerald-950/10"
                            : isUpcoming
                            ? "border-blue-500/40"
                            : "border-border/80 opacity-90"
                        }`}
                      >
                        <CardHeader className="pb-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {isLive ? (
                                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-black animate-pulse">
                                  LIVE NOW
                                </span>
                              ) : isUpcoming ? (
                                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-500/30">
                                  UPCOMING
                                </span>
                              ) : (
                                <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded font-bold">
                                  ENDED
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground font-mono">
                                ⏱️ {contest.durationMinutes}m duration
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <Link href={`/contests/${contest.id}`}>
                                <Button size="sm" variant="outline" className="h-7 text-[11px] font-semibold gap-1">
                                  <span>👁️</span> Arena
                                </Button>
                              </Link>

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteContestItem(contest.id)}
                                className="h-7 text-[11px] font-semibold"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>

                          <CardTitle className="text-base font-bold">{contest.title}</CardTitle>
                          <CardDescription className="text-xs line-clamp-1">{contest.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3 pt-1">
                          {/* Problem list breakdown */}
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between text-muted-foreground text-[11px] font-semibold">
                              <span>Questions ({contest.problems.length})</span>
                              <span className="text-primary">{totalPoints} pts total</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {contest.problems.map((p, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary border border-border"
                                >
                                  <strong>Q{idx + 1}:</strong> {p.title} ({p.points}pts)
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="text-[11px] text-muted-foreground space-y-0.5 font-mono pt-1">
                            <p><strong className="text-foreground font-sans">Start Time:</strong> {new Date(contest.startTime).toLocaleString()}</p>
                            <p><strong className="text-foreground font-sans">End Time:</strong> {new Date(contest.endTime).toLocaleString()}</p>
                          </div>

                          {/* Admin Action Bar */}
                          <div className="flex items-center justify-between pt-2 border-t border-border/60">
                            <span className="text-xs font-mono text-muted-foreground">
                              👥 {contest.participantsCount} participants
                            </span>

                            <div className="flex items-center gap-2">
                              {isUpcoming && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStartContestNow(contest.id)}
                                  className="h-7 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shadow-sm"
                                >
                                  <span>▶</span> Start Live Now
                                </Button>
                              )}
                              {isLive && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleEndContestNow(contest.id)}
                                  className="h-7 text-[11px] font-bold text-rose-400 gap-1 border border-rose-500/30"
                                >
                                  <span>⏹</span> Force End Contest
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
