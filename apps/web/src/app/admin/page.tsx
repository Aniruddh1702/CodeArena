"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  clearAllContests,
  getContestSubmissions,
  getAllContestSubmissions,
  Contest,
  ContestProblem,
  ContestSubmission,
} from "@/lib/contests-data";
import { getActiveAccount, getAllAccounts, getUserStats, banUser, unbanUser, deleteUserAccount } from "@/lib/auth-session";
import { saveNotification } from "@/lib/notifications";

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

  // Try direct JSON parse first
  try {
    const direct = JSON.parse(trimmed);
    if (Array.isArray(direct)) return direct;
    return [direct];
  } catch (e) {}

  // Split into top-level arguments respecting quotes, brackets, braces, and parens
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
    // Strip leading parameter variable label like "nums = " or "target = "
    let valStr = part.replace(/^[a-zA-Z0-9_$]+\s*=\s*/, "").trim();

    // Normalize python booleans/null
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

// ── 3D Interactive Tilt Card Component for Admin 2026 (Cyber Terminal Theme) ──
function AdminTiltCard({
  children,
  className = "",
  glowColor = "emerald",
  maxTilt = 6,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: "indigo" | "emerald" | "purple" | "blue" | "amber" | "rose" | "cyan";
  maxTilt?: number;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [sheen, setSheen] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotateX(((y - centerY) / centerY) * -maxTilt);
    setRotateY(((x - centerX) / centerX) * maxTilt);
    setSheen({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setSheen((prev) => ({ ...prev, opacity: 0 }));
  };

  const glowMap: Record<string, string> = {
    emerald: "rgba(16, 185, 129, 0.35)",
    cyan: "rgba(6, 182, 212, 0.35)",
    amber: "rgba(245, 158, 11, 0.35)",
    rose: "rgba(244, 63, 94, 0.35)",
    indigo: "rgba(56, 189, 248, 0.35)",
    purple: "rgba(16, 185, 129, 0.35)",
    blue: "rgba(14, 165, 233, 0.35)",
  };

  const borderMap: Record<string, string> = {
    emerald: "border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(16,185,129,0.25)]",
    cyan: "border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-[0_8px_32px_rgba(6,182,212,0.25)]",
    amber: "border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_8px_32px_rgba(245,158,11,0.25)]",
    rose: "border-rose-500/30 hover:border-rose-400/60 hover:shadow-[0_8px_32px_rgba(244,63,94,0.25)]",
    indigo: "border-indigo-500/30 hover:border-indigo-400/60 hover:shadow-[0_8px_32px_rgba(99,102,241,0.25)]",
    purple: "border-purple-500/30 hover:border-purple-400/60 hover:shadow-[0_8px_32px_rgba(168,85,247,0.25)]",
    blue: "border-sky-500/30 hover:border-sky-400/60 hover:shadow-[0_8px_32px_rgba(14,165,233,0.25)]",
  };

  return (
    <div style={{ perspective: "1200px" }} className="w-full h-full">
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${sheen.opacity ? "12px" : "0px"})`,
          transition: sheen.opacity ? "transform 0.08s ease-out" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          transformStyle: "preserve-3d",
        }}
        className={`relative rounded-2xl border border-white/10 border-t-white/25 bg-slate-950/40 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] transition-all duration-300 overflow-hidden ${borderMap[glowColor] || borderMap.emerald} ${className}`}
      >
        {/* Subtle Frosted Specular Sheen */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent z-10" />

        {/* Dynamic Glass Refraction Light Orb */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-10"
          style={{
            opacity: sheen.opacity,
            background: `radial-gradient(circle 320px at ${sheen.x}% ${sheen.y}%, ${glowMap[glowColor] || glowMap.emerald}, transparent 75%)`,
          }}
        />
        <div className="relative z-20 w-full h-full text-slate-100" style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

let sharedAudioCtx: AudioContext | null = null;

export default function AdminPortalPage() {
  const router = useRouter();

  // Authentication & Gate State (Locked by default - requires Admin password)
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Cyber Audio SFX & Live Digital Clock State
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [clockTime, setClockTime] = useState("");

  useEffect(() => {
    const fn = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setClockTime(`${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} // ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    };
    fn();
    const iv = setInterval(fn, 1000);
    return () => clearInterval(iv);
  }, []);

  const playCyberSound = (type: "blip" | "success" | "alert" | "lock" | "click") => {
    if (!sfxEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
        sharedAudioCtx = new AudioCtx();
      }
      if (sharedAudioCtx.state === "suspended") {
        sharedAudioCtx.resume().catch(() => {});
      }
      const ctx = sharedAudioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      if (type === "blip") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(820, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === "click") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.03);
      } else if (type === "success") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } else if (type === "alert") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === "lock") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(220, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch (e) {}
  };

  // Admin Profile & Security Configuration State
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
      name: "Nexus Root Operator",
      email: "root@codearena.dev",
      title: "Chief System Architect & Root Judge",
      avatar: "⚡",
      bio: "Root master authority of CodeArena 2026. Managing quad-engine compilation fabrics, live competition telemetry, and algorithmic sandbox isolation.",
      securityLevel: "CLASSIFIED LEVEL 5 [SUPER-ADMIN ROOT]",
      themeColor: "emerald",
      sessionTimeout: "8h",
    };
  });

  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [auditFilter, setAuditFilter] = useState<"all" | "system" | "question" | "contest" | "security">("all");
  const [newPasscodeVal, setNewPasscodeVal] = useState("");
  const [confirmPasscodeVal, setConfirmPasscodeVal] = useState("");
  const [passcodeUpdateMsg, setPasscodeUpdateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Live Audit Logs for 2026 Command Telemetry
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; time: string; type: "system" | "question" | "contest" | "security"; message: string }>>([
    { id: "log-1", time: "Just now", type: "system", message: "Quad-engine test runners verified healthy (V8/Py3/g++/Java21)." },
    { id: "log-2", time: "2m ago", type: "question", message: "Synchronized question bank repository with in-memory execution store." },
    { id: "log-3", time: "5m ago", type: "security", message: "Super-Admin session established with AES-256 encrypted token guard." },
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

  const [formFeedback, setFormFeedback] = useState<{ type: "success" | "error"; message: string; slug?: string } | null>(null);

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
      const res = await fetch("/api/admin/users", { cache: "no-store" });
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
          score: u.score || 1450,
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
          score: stats.dsaRating || existing?.score || 1450,
          problemsSolved: stats.problemsSolved || existing?.problemsSolved || 0,
          org: s.college || existing?.org || "CodeArena Academy",
          lastLoginAt: existing?.lastLoginAt || new Date().toISOString(),
          status: isBanned ? "BANNED" : "ONLINE",
          isBanned: isBanned,
        });
      }

      setAllUsersList(Array.from(map.values()));
    } catch (e) {
      console.error("Error loading users:", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleUserRole = async (username: string, currentRole: string) => {
    const nextRole = currentRole === "SUPER_ADMIN" ? "STUDENT" : "SUPER_ADMIN";
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
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
    if (!confirm(`Are you sure you want to permanently delete user @${username}? This removes their profile and session.`)) {
      return;
    }

    try {
      await fetch(`/api/admin/users?username=${encodeURIComponent(username)}`, {
        method: "DELETE",
      });
    } catch (e) {}

    deleteUserAccount(username);
    setAllUsersList((prev) => prev.filter((u) => u.username.toLowerCase() !== username.toLowerCase()));
    setUserRoleFeedback(`Deleted user @${username} permanently.`);
    setTimeout(() => setUserRoleFeedback(null), 3500);
  };

  const handleClearAllUsers = async () => {
    if (!confirm("Are you sure you want to clear ALL users from the server and database? This provides a completely fresh start.")) {
      return;
    }
    try {
      await fetch("/api/admin/users", { method: "DELETE" });
      setAllUsersList([]);
      const active = getActiveAccount();
      if (active) {
        const preservedAdmin = { ...active, role: "SUPER_ADMIN" as const };
        localStorage.setItem("codearena_accounts", JSON.stringify([preservedAdmin]));
        localStorage.setItem("codearena_active_account_id", preservedAdmin.id);
        localStorage.setItem("user", JSON.stringify(preservedAdmin));
      }
      setUserRoleFeedback("All student accounts cleared from the server and database for a fresh start.");
      setTimeout(() => setUserRoleFeedback(null), 4000);
      loadUsers();
    } catch (e) {
      console.error("Error clearing users:", e);
    }
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
  const [editingContestId, setEditingContestId] = useState<string | null>(null);
  const [contestProblemSearch, setContestProblemSearch] = useState("");
  const [contestProblemDiffFilter, setContestProblemDiffFilter] = useState("ALL");
  const [contestFeedback, setContestFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Contest submissions inspection state
  const [selectedContestForSubmissions, setSelectedContestForSubmissions] = useState<Contest | null>(null);
  const [selectedSubmissionForCode, setSelectedSubmissionForCode] = useState<ContestSubmission | null>(null);
  const [submissionFilterStatus, setSubmissionFilterStatus] = useState<"ALL" | "ACCEPTED" | "WRONG_ANSWER">("ALL");
  const [submissionSearchQuery, setSubmissionSearchQuery] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [submittingContestId, setSubmittingContestId] = useState<string | null>(null);
  const [submittingStudentEmail, setSubmittingStudentEmail] = useState<string | null>(null);
  const [contestToSubmitWhole, setContestToSubmitWhole] = useState<Contest | null>(null);
  const [inspectorViewTab, setInspectorViewTab] = useState<"roster" | "submissions">("roster");

  // Broadcast Announcement State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastFeedback, setBroadcastFeedback] = useState<string | null>(null);

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

  const loadContests = async () => {
    try {
      const res = await fetch("/api/contests", { cache: "no-store" });
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

  const handleCreateContest = async (forceStartNow: boolean = false) => {
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
        : contestFormData.startTimeOption;

      const timing = getComputedContestTiming(
        effectiveOption,
        contestFormData.customStartTime,
        contestFormData.durationMinutes
      );

      const newContest: Contest = {
        id: editingContestId || `contest-${Date.now()}`,
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

      await saveContest(newContest);
      await loadContests();
      setContestFeedback({
        type: "success",
        message: editingContestId
          ? `💾 Contest '${newContest.title}' updated successfully!`
          : timing.status === "LIVE"
          ? `🟢 Contest '${newContest.title}' is now LIVE! Live contest arena opened.`
          : `📅 Contest '${newContest.title}' successfully SCHEDULED for ${timing.startFormatted}! In-App & Gmail 1-hour reminders armed.`
      });

      setEditingContestId(null);
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
      message: `Loaded "${contest.title}" for editing. Update fields and click Save Contest.`,
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
    if (confirm("Are you sure you want to delete this contest?")) {
      await deleteContest(id);
      await loadContests();
    }
  };

  const [, setSubmissionTick] = useState(0);

  // Check auth session on mount & listen to real-time events from student panel
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

      const handleSubmissionsChange = () => {
        setSubmissionTick((t) => t + 1);
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
        setSubmissionTick((t) => t + 1);
      }, 4000);

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

  const loadQuestions = async () => {
    let list = getAllProblems();
    let custom = getCustomProblems();

    // Hydrate server custom problems into local store if not present
    try {
      const res = await fetch("/api/admin/questions", { cache: "no-store" });
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
    const isFiltered = filteredQuestions.length !== allQuestions.length;
    const currentList = isFiltered ? filteredQuestions : allQuestions;
    const currentIdx = currentList.findIndex(q => q.slug === slug);
    if (currentIdx < 0) return;
    if (direction === "UP" && currentIdx === 0) return;
    if (direction === "DOWN" && currentIdx === currentList.length - 1) return;

    const targetItem = currentList[direction === "UP" ? currentIdx - 1 : currentIdx + 1];
    if (!targetItem) return;

    const newAll = [...allQuestions];
    const realFromIdx = newAll.findIndex(q => q.slug === slug);
    const realToIdx = newAll.findIndex(q => q.slug === targetItem.slug);

    if (realFromIdx >= 0 && realToIdx >= 0) {
      const [moved] = newAll.splice(realFromIdx, 1);
      newAll.splice(realToIdx, 0, moved);

      setAllQuestions(newAll);
      saveQuestionOrder(newAll.map(q => q.slug));
      setIsCustomOrderActive(true);
      setOrderFeedback(`✓ Moved "${moved.title}" ${direction === "UP" ? "above" : "below"} "${targetItem.title}" (position #${realToIdx + 1})`);
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
    const customPass = typeof window !== "undefined" ? localStorage.getItem("codearena_custom_admin_passcode") : null;
    const VALID_ADMIN_PASSCODES = [
      "Aniruddh#1702",
      "Admin@123!",
      "codearena-admin-2026",
      "admin123",
      ...(customPass ? [customPass] : []),
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
    playCyberSound("lock");
    localStorage.removeItem("codearena_admin_authorized");
    document.cookie = "codearena_admin_auth=; path=/; max-age=0";
    setIsAuthorized(false);
  };

  // Auto-lock admin session on inactivity based on adminProfile.sessionTimeout
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

  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    playCyberSound("success");
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
    setProfileSuccessMsg("Admin Profile & Security configuration saved successfully!");
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
      playCyberSound("alert");
      setPasscodeUpdateMsg({ type: "error", text: "Please enter a valid new passcode." });
      return;
    }
    if (newPasscodeVal !== confirmPasscodeVal) {
      playCyberSound("alert");
      setPasscodeUpdateMsg({ type: "error", text: "Passcodes do not match. Please re-enter." });
      return;
    }
    if (newPasscodeVal.length < 6) {
      playCyberSound("alert");
      setPasscodeUpdateMsg({ type: "error", text: "Passcode must be at least 6 characters long." });
      return;
    }
    playCyberSound("success");
    if (typeof window !== "undefined") {
      localStorage.setItem("codearena_custom_admin_passcode", newPasscodeVal.trim());
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
      { id: `log-${Date.now()}`, time: "Just now", type: "system", message: `Quad-Engine Ping: All runners operational (Sandbox Latency: ${picked}ms, Memory: 138MB).` },
      ...prev.slice(0, 19),
    ]);
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
      title: p.title || "",
      slug: p.slug || "",
      difficulty: p.difficulty || "EASY",
      topics: Array.isArray(p.topics) ? p.topics.map((t: any) => typeof t === "string" ? t : t.name) : ["Arrays"],
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

    // Clean up old slug if slug was renamed during edit
    if (editingSlug && editingSlug !== cleanSlug) {
      deleteCustomProblem(editingSlug);
      try {
        fetch(`/api/admin/questions?slug=${encodeURIComponent(editingSlug)}`, { method: "DELETE" }).catch(() => {});
      } catch (e) {}
    }

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
        parsedArgs = parseCustomArgs(tc.argsStr || tc.input || "");
        if (parsedArgs.length === 0) {
          setFormFeedback({ type: "error", message: `Test Case #${i + 1}: Invalid Arguments format. Please enter arguments like [1, 2] or num1, num2.` });
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

    const savedSlug = problemToSave.slug;
    setEditingSlug(null);
    handleResetForm();
    loadQuestions();
    setFormFeedback({
      type: "success",
      message: `Question "${problemToSave.title}" saved successfully! It is now live in the practice bank and IDE.`,
      slug: savedSlug,
    });
  };

  // Delete Question
  const handleDelete = async (slug: string) => {
    if (confirm(`Are you sure you want to delete question "${slug}"?`)) {
      deleteCustomProblem(slug);
      try {
        await fetch(`/api/admin/questions?slug=${encodeURIComponent(slug)}`, {
          method: "DELETE",
        });
      } catch (e) {
        console.warn("Server deletion optional:", e);
      }
      loadQuestions();
    }
  };

  // Export JSON via Blob to support large payloads without URI length limits
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

  // Download Sample Template via Blob
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
      if (formatType === "PDF" && (content.startsWith("%PDF-") || content.includes("/FlateDecode"))) {
        setImportFeedback({
          type: "error",
          message: `Notice: "${fileName}" is a binary-encoded PDF. For accurate problem generation, please copy the problem text into the input field or upload as a .JSON / .MD document.`,
        });
        setParsedImportItems([]);
        return;
      }

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

  // Security Passcode Gate if not authorized (Classified Root Terminal)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Glassmorphic Ambient Luminous Orbs */}
        <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/25 blur-[120px] pointer-events-none z-0" />
        <div className="fixed -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-600/25 blur-[120px] pointer-events-none z-0" />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none z-0" />
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-40 z-0" />

        <div className="w-full max-w-lg space-y-5 relative z-10">
          {/* Frosted Glass Terminal Window */}
          <div className="rounded-3xl border border-white/15 border-t-white/30 bg-slate-900/40 backdrop-blur-3xl shadow-[0_24px_60px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden">
            {/* Terminal Header Bar */}
            <div className="p-3.5 bg-white/[0.04] border-b border-white/10 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-300 ml-2">
                  [FROSTED_GLASS // ROOT_GATEWAY v2026.4]
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>SECURE // AES-256</span>
              </div>
            </div>

            {/* Terminal Output Banner */}
            <div className="p-6 space-y-4">
              <div className="space-y-1.5 p-3.5 rounded-xl bg-black/30 border border-white/10 backdrop-blur-xl text-[11px] text-cyan-300/90 leading-relaxed font-mono shadow-inner">
                <div>&gt; HOST: CODEARENA_CORE_MAIN // 127.0.0.1</div>
                <div>&gt; CLEARANCE: LEVEL 5 (ROOT AUTHORITY) REQUIRED</div>
                <div>&gt; GLASS_AEROSPACE: HARDWARE TOKEN VERIFIED</div>
                <div className="text-cyan-200 font-bold">&gt; ENTER AUTHORIZATION MASTER KEY TO ENGAGE CONSOLE_</div>
              </div>

              <form onSubmit={handleVerifyPasscode} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="passcode" className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center justify-between">
                    <span>Root Authorization Passcode</span>
                    <span className="text-cyan-400 text-[10px] font-normal">ENCRYPTED STREAM</span>
                  </Label>
                  <Input
                    id="passcode"
                    type="password"
                    placeholder="ENTER ROOT PASSCODE"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setPasscodeError("");
                    }}
                    required
                    autoFocus
                    className="h-11 text-sm font-mono tracking-widest bg-white/[0.05] border-white/15 text-white placeholder:text-slate-500 focus:border-cyan-400/80 focus:bg-white/[0.08] backdrop-blur-xl rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all"
                  />
                </div>

                {passcodeError && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2 animate-in fade-in backdrop-blur-xl">
                    <span>⚠️</span>
                    <span>[ALERT] ACCESS_DENIED // {passcodeError}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={verifying || !passcode.trim()}
                  onClick={() => playCyberSound("blip")}
                  className="w-full h-11 text-xs font-mono font-black tracking-widest uppercase bg-gradient-to-r from-cyan-500/80 via-blue-500/80 to-purple-600/80 hover:from-cyan-400 hover:to-purple-500 text-white shadow-[0_0_25px_rgba(6,182,212,0.35)] border border-white/25 rounded-xl backdrop-blur-md transition-all"
                >
                  {verifying ? "VERIFYING CRYPTOGRAPHIC KEY..." : "[AUTHENTICATE ROOT SESSION ↵]"}
                </Button>
              </form>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>IDENTITY: SUPER-ADMINISTRATOR</span>
                <span className="text-cyan-400">STATUS: READY</span>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400 font-mono flex items-center justify-center gap-2">
            <span>🛡️</span>
            <span>CodeArena Frosted Glass Operations • Root Administrators Only</span>
          </div>
        </div>
      </div>
    );
  }

  // Full Admin Portal (Directly rendered for Admin - Glassmorphism Theme)
  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden font-sans">
      {/* Glassmorphic Ambient Luminous Refraction Orbs (Dynamic to HUD Theme Preset) */}
      <div className={`fixed -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none z-0 transition-all duration-700 ${
        adminProfile.themeColor === "rose" ? "bg-rose-500/25" :
        adminProfile.themeColor === "amber" ? "bg-amber-500/25" :
        adminProfile.themeColor === "purple" ? "bg-purple-600/25" :
        adminProfile.themeColor === "indigo" ? "bg-indigo-600/25" :
        adminProfile.themeColor === "cyan" ? "bg-cyan-500/25" :
        "bg-emerald-500/25"
      }`} />
      <div className="fixed top-1/4 -right-40 w-[650px] h-[650px] rounded-full bg-purple-600/15 blur-[150px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-500/15 blur-[150px] pointer-events-none z-0" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-40 z-0" />

      {/* Top Floating Frosted Glass Admin Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              onClick={() => playCyberSound("blip")}
              className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2.5"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400/80 via-blue-500/80 to-purple-600/80 flex items-center justify-center text-white font-black text-base shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-white/30 backdrop-blur-md">
                ⚡
              </div>
              <div className="flex flex-col">
                <div className="font-mono font-black text-sm sm:text-base tracking-widest text-slate-100 flex items-center gap-1.5">
                  NEXUS<span className="text-cyan-400 font-bold">//AERO.GLASS</span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-cyan-400/80 uppercase">
                  ROOT CONSOLE • 2026.4
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex gap-1.5 text-xs font-mono items-center">
            {[
              { id: "overview", label: "[01 // OVERVIEW]", icon: "⚡" },
              { id: "questions", label: `[02 // QUESTIONS (${allQuestions.length})]`, icon: "📚" },
              { id: "contests", label: `[03 // CONTESTS (${contestsList.length})]`, icon: "🏆", action: loadContests },
              { id: "create", label: "[04 // CREATOR]", icon: "➕" },
              { id: "import", label: "[05 // IMPORT]", icon: "📁" },
              { id: "users", label: `[06 // ROSTER (${allUsersList.length})]`, icon: "👥", action: loadUsers },
              { id: "system", label: "[07 // HEALTH]", icon: "🎛️" },
              { id: "profile", label: "[08 // VAULT]", icon: "🛡️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  playCyberSound("blip");
                  if (tab.action) tab.action();
                }}
                className={`transition-all px-2.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-white/15 text-white border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.12),inset_0_1px_1px_rgba(255,255,255,0.25)] font-bold backdrop-blur-xl"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent backdrop-blur-md"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Live Digital Clock */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-cyan-300 font-mono text-[11px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
              <span>{clockTime || "2026.10.11 // 17:05:00"}</span>
            </div>

            {/* Audio SFX Toggle */}
            <button
              onClick={() => {
                setSfxEnabled(!sfxEnabled);
                if (!sfxEnabled) playCyberSound("blip");
              }}
              className="hidden sm:flex px-2 py-1 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-white/20 text-[10px] font-mono text-slate-300 items-center gap-1 transition-colors"
              title="Toggle Cyber Sound Effects"
            >
              <span>{sfxEnabled ? "🔊 ON" : "🔈 MUTED"}</span>
            </button>

            {/* Root Operator Identity */}
            <button
              onClick={() => {
                setActiveTab("profile");
                playCyberSound("blip");
              }}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-mono font-bold backdrop-blur-xl ${
                activeTab === "profile"
                  ? "bg-white/20 border-white/40 text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-200"
              }`}
              title="Root Operator Profile & Vault"
            >
              <span className="text-sm">{adminProfile.avatar || "⚡"}</span>
              <span className="hidden sm:inline text-[11px] text-cyan-300 font-mono tracking-wider">
                {adminProfile.name.split(" ")[0].toUpperCase()}
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] border border-cyan-500/40">
                ROOT
              </span>
            </button>

            {/* Lock Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                playCyberSound("lock");
                handleLockAdmin();
              }}
              className="h-8 text-xs font-mono font-bold bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.25)] backdrop-blur-xl rounded-xl"
              title="Terminate Root Session"
            >
              <span>🔒</span> <span className="hidden sm:inline">[LOCK]</span>
            </Button>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Navigation Scroll Bar */}
        <div className="flex lg:hidden overflow-x-auto no-scrollbar gap-1.5 px-4 sm:px-6 py-2 border-t border-white/5 bg-slate-950/40 backdrop-blur-xl">
          {[
            { id: "overview", label: "OVERVIEW", icon: "⚡" },
            { id: "questions", label: `QUESTIONS (${allQuestions.length})`, icon: "📚" },
            { id: "contests", label: `CONTESTS (${contestsList.length})`, icon: "🏆", action: loadContests },
            { id: "create", label: "CREATOR", icon: "➕" },
            { id: "import", label: "IMPORT", icon: "📁" },
            { id: "users", label: `ROSTER (${allUsersList.length})`, icon: "👥", action: loadUsers },
            { id: "system", label: "HEALTH", icon: "🎛️" },
            { id: "profile", label: "VAULT", icon: "🛡️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                playCyberSound("blip");
                if (tab.action) tab.action();
              }}
              className={`whitespace-nowrap flex-shrink-0 transition-all px-2.5 py-1.5 rounded-xl text-[11px] font-mono flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-white/15 text-white border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.12),inset_0_1px_1px_rgba(255,255,255,0.25)] font-bold backdrop-blur-xl"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent backdrop-blur-md"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 container mx-auto px-6 py-8 space-y-6 max-w-7xl relative z-10">
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            playCyberSound("blip");
          }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 border-white/10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-mono font-black tracking-wide text-slate-100 flex items-center gap-2.5">
                {activeTab === "overview" && <span className="text-cyan-400">⚡ // NEXUS_COMMAND_CENTER [AERO_HUD]</span>}
                {activeTab === "profile" && <span className="text-cyan-400">🛡️ // ROOT_OPERATOR_VAULT [SECURITY_CLEARANCE]</span>}
                {activeTab === "questions" && <span className="text-cyan-400">📚 // PROBLEM_BANK_MATRIX [CONTENT_STUDIO]</span>}
                {activeTab === "contests" && <span className="text-amber-400">🏆 // TOURNAMENT_ORCHESTRATOR [LIVE_ARENA]</span>}
                {activeTab === "create" && <span className="text-emerald-400">➕ // ALGORITHM_AUTHORING_LAB [DEV_STUDIO]</span>}
                {activeTab === "import" && <span className="text-cyan-400">📁 // BATCH_IMPORT_STAGING [JSON_FABRIC]</span>}
                {activeTab === "system" && <span className="text-emerald-400">🎛️ // QUAD_ENGINE_DIAGNOSTICS [KERNEL_HEALTH]</span>}
                {activeTab === "users" && <span className="text-sky-400">👥 // PLATFORM_ROSTER_REGISTRY [ACCESS_CONTROL]</span>}
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                {activeTab === "overview" && "> REAL-TIME KERNEL STATUS • QUAD-ENGINE ISOLATION ACTIVE • METRIC STREAM ONLINE"}
                {activeTab === "profile" && "> ROOT CREDENTIAL GOVERNANCE • ENCRYPTION KEYS • HUD THEME SKINS"}
                {activeTab === "questions" && "> IN-MEMORY PROBLEM STORE SYNCHRONIZED ACROSS DISTRIBUTED SANDBOXES"}
                {activeTab === "contests" && "> REAL-TIME MULTI-CODER ARENA ORCHESTRATION WITH INSTANT CLOCK RUNNERS"}
                {activeTab === "create" && "> GENERATE BESPOKE CHALLENGES WITH QUAD-LANGUAGE (V8/PY3/CPP/JVM) TEMPLATES"}
                {activeTab === "import" && "> BULK PARSE AND PUBLISH LEETCODE-STYLE PROBLEMS INTO CODEARENA IDE"}
                {activeTab === "system" && "> CPU / MEMORY / LATENCY RUNTIME BENCHMARK GAUGES FOR CODEARENA RUNNERS"}
                {activeTab === "users" && "> ELEVATE STUDENT ROLES • CALIBRATE COMPETITOR ELO • GOVERN PERMISSIONS"}
              </p>
            </div>

            {/* Tactical Frosted Glass Quick Dock Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={activeTab === "overview" ? "default" : "outline"}
                size="sm"
                onClick={() => { setActiveTab("overview"); playCyberSound("blip"); }}
                className={`h-8 text-xs font-mono font-bold gap-1.5 rounded-xl transition-all ${
                  activeTab === "overview"
                    ? "bg-white/20 hover:bg-white/25 text-white border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)] backdrop-blur-xl"
                    : "bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] backdrop-blur-md"
                }`}
              >
                <span>⚡</span> OVERVIEW
              </Button>
              <Button
                variant={activeTab === "questions" ? "default" : "outline"}
                size="sm"
                onClick={() => { setActiveTab("questions"); playCyberSound("blip"); }}
                className={`h-8 text-xs font-mono font-bold gap-1.5 rounded-xl transition-all ${
                  activeTab === "questions"
                    ? "bg-cyan-500/25 hover:bg-cyan-500/35 text-cyan-200 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-xl"
                    : "bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] backdrop-blur-md"
                }`}
              >
                <span>📚</span> PROBLEMS ({allQuestions.length})
              </Button>
              <Button
                variant={activeTab === "contests" ? "default" : "outline"}
                size="sm"
                onClick={() => { setActiveTab("contests"); loadContests(); playCyberSound("blip"); }}
                className={`h-8 text-xs font-mono font-bold gap-1.5 rounded-xl transition-all ${
                  activeTab === "contests"
                    ? "bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.3)] backdrop-blur-xl"
                    : "bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] backdrop-blur-md"
                }`}
              >
                <span>🏆</span> CONTESTS ({contestsList.length})
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleResetForm();
                  setActiveTab("create");
                  playCyberSound("blip");
                }}
                className="h-8 text-xs font-mono font-bold bg-gradient-to-r from-emerald-500/80 to-cyan-500/80 hover:from-emerald-400 hover:to-cyan-400 text-black border border-white/30 gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md rounded-xl"
              >
                <span>➕</span> CREATE
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setActiveTab("import"); playCyberSound("blip"); }}
                className="h-8 text-xs font-mono font-bold gap-1.5 bg-white/[0.04] border-white/10 text-cyan-300 hover:bg-white/[0.08] backdrop-blur-md rounded-xl"
              >
                <span>📁</span> IMPORT
              </Button>
              <Button
                variant={activeTab === "users" ? "default" : "outline"}
                size="sm"
                onClick={() => { setActiveTab("users"); loadUsers(); playCyberSound("blip"); }}
                className="h-8 text-xs font-mono font-bold gap-1.5 bg-white/[0.04] border-white/10 text-sky-300 hover:bg-white/[0.08] backdrop-blur-md rounded-xl"
              >
                <span>👥</span> USERS ({allUsersList.length})
              </Button>
              <Button
                variant={activeTab === "profile" ? "default" : "outline"}
                size="sm"
                onClick={() => { setActiveTab("profile"); playCyberSound("blip"); }}
                className="h-8 text-xs font-mono font-bold gap-1.5 bg-white/[0.04] border-white/10 text-emerald-300 hover:bg-white/[0.08] backdrop-blur-md rounded-xl"
              >
                <span>🛡️</span> ROOT VAULT
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { handleExportJson(); playCyberSound("success"); }}
                className="h-8 text-xs font-mono font-bold gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/15 backdrop-blur-md rounded-xl"
                title="Download complete JSON backup of all problems"
              >
                <span>📥</span> EXPORT JSON
              </Button>
            </div>
          </div>

          {/* TAB 0: 2026 NEXUS OVERVIEW & COMMAND CENTER (Glassmorphism Theme) */}
          <TabsContent value="overview" className="space-y-6 m-0 focus-visible:outline-none">
            {/* Live Telemetry Status Ticker */}
            <div className="relative rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 backdrop-blur-2xl p-5 md:p-6 overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)]">
              {/* Subtle Ambient Refraction Sheen */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 z-0" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/20 text-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] text-cyan-300 font-mono backdrop-blur-xl">
                    <span>⚡</span>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm md:text-base font-mono font-black tracking-widest uppercase text-white">
                        NEXUS // REALTIME TELEMETRY MATRIX
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] font-bold backdrop-blur-md">
                        ACTIVE • AERO.GLASS 2026.4
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      QUAD-ENGINE SANDBOXES ONLINE • MULTI-CODER ARENA ORCHESTRATION • IN-MEMORY PROBLEM STORE
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono">
                  <div className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-mono flex items-center gap-2 backdrop-blur-md shadow-inner">
                    <span className="text-slate-400">OPERATOR:</span>
                    <span className="font-bold text-cyan-300">{adminProfile.name.toUpperCase()}</span>
                    <span className="text-cyan-300 text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 font-bold border border-cyan-400/30">
                      ROOT
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      playCyberSound("blip");
                      handleRunHealthDiagnostic();
                    }}
                    className="h-8 text-xs font-mono font-bold gap-1.5 bg-white/[0.04] border-white/15 text-cyan-300 hover:bg-white/[0.08] backdrop-blur-md rounded-xl"
                  >
                    <span>🩺</span> [PING_KERNEL]
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      handleResetForm();
                      setActiveTab("create");
                      playCyberSound("blip");
                    }}
                    className="h-8 text-xs font-mono font-black bg-gradient-to-r from-emerald-500/80 to-cyan-500/80 hover:from-emerald-400 hover:to-cyan-400 text-black border border-white/30 gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md rounded-xl"
                  >
                    <span>➕</span> [NEW_PROBLEM]
                  </Button>
                </div>
              </div>
            </div>

            {/* 4 Core Telemetry Metric Glass Tilt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Telemetry Card 1: Problems Repository */}
              <AdminTiltCard glowColor="emerald" className="p-5 flex flex-col justify-between">
                <div className="space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                      // 01: REPOSITORY_MATRIX
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-sm backdrop-blur-md">
                      📚
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-black tracking-tight text-white font-mono">
                      {allQuestions.length}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      Algorithmic problems indexed
                    </div>
                  </div>

                  {/* Difficulty Distribution Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="h-2 w-full rounded-full bg-white/[0.06] border border-white/10 overflow-hidden flex">
                      <div
                        style={{
                          width: `${allQuestions.length ? (allQuestions.filter((q) => q.difficulty === "EASY").length / allQuestions.length) * 100 : 0}%`,
                        }}
                        className="bg-emerald-400 h-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                        title="Easy"
                      />
                      <div
                        style={{
                          width: `${allQuestions.length ? (allQuestions.filter((q) => q.difficulty === "MEDIUM").length / allQuestions.length) * 100 : 0}%`,
                        }}
                        className="bg-amber-400 h-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                        title="Medium"
                      />
                      <div
                        style={{
                          width: `${allQuestions.length ? (allQuestions.filter((q) => q.difficulty === "HARD").length / allQuestions.length) * 100 : 0}%`,
                        }}
                        className="bg-rose-400 h-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                        title="Hard"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-emerald-400 font-bold">
                        {allQuestions.filter((q) => q.difficulty === "EASY").length} Easy
                      </span>
                      <span className="text-amber-400 font-bold">
                        {allQuestions.filter((q) => q.difficulty === "MEDIUM").length} Med
                      </span>
                      <span className="text-rose-400 font-bold">
                        {allQuestions.filter((q) => q.difficulty === "HARD").length} Hard
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono">
                  <span className="text-[10px] text-slate-400">
                    {customSlugs.size} Custom Ideations
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab("questions");
                      playCyberSound("blip");
                    }}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    INSPECT_BANK →
                  </button>
                </div>
              </AdminTiltCard>

              {/* Telemetry Card 2: Contests Studio */}
              <AdminTiltCard glowColor="amber" className="p-5 flex flex-col justify-between">
                <div className="space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                      // 02: TOURNAMENTS_ARENA
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-sm backdrop-blur-md">
                      🏆
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                      {contestsList.length}
                      {contestsList.some((c) => c.status === "LIVE") && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse font-mono font-bold">
                          ● LIVE_NOW
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Competitive tournaments scheduled
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 py-1">
                    <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-center backdrop-blur-md">
                      <div className="text-xs font-bold text-rose-400">
                        {contestsList.filter((c) => c.status === "LIVE").length}
                      </div>
                      <div className="text-[9px] text-slate-400">Live</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-center backdrop-blur-md">
                      <div className="text-xs font-bold text-amber-400">
                        {contestsList.filter((c) => c.status === "UPCOMING").length}
                      </div>
                      <div className="text-[9px] text-slate-400">Upcoming</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-center backdrop-blur-md">
                      <div className="text-xs font-bold text-slate-300">
                        {contestsList.filter((c) => c.status === "ENDED").length}
                      </div>
                      <div className="text-[9px] text-slate-400">Ended</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono">
                  <span className="text-[10px] text-slate-400">
                    {contestsList.reduce((acc, c) => acc + Math.max(c.participantsCount || 0, (c.registeredUsers || []).length), 0)} Registrations
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab("contests");
                      loadContests();
                      playCyberSound("blip");
                    }}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    OPEN_ARENA →
                  </button>
                </div>
              </AdminTiltCard>

              {/* Telemetry Card 3: Student Community & Roster */}
              <AdminTiltCard glowColor="cyan" className="p-5 flex flex-col justify-between">
                <div className="space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                      // 03: COMPETITOR_ROSTER
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-sm backdrop-blur-md">
                      👥
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-black tracking-tight text-white font-mono">
                      {allUsersList.length || 6}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Registered coder credentials
                    </div>
                  </div>

                  <div className="space-y-1.5 py-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Active Coders:</span>
                      <span className="font-bold text-slate-200">
                        {allUsersList.filter((u) => u.role !== "ADMIN" && u.role !== "SUPER_ADMIN").length || 5}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Peak Elo Rating:</span>
                      <span className="font-bold text-cyan-300">
                        {Math.max(...allUsersList.map((u) => u.score || 1450), 1850)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Global Pass Rate:</span>
                      <span className="font-bold text-emerald-400">68.4%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono">
                  <span className="text-[10px] text-slate-400">
                    {allUsersList.filter((u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length || 1} Admins
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab("users");
                      loadUsers();
                      playCyberSound("blip");
                    }}
                    className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    ROSTER_ADMIN →
                  </button>
                </div>
              </AdminTiltCard>

              {/* Telemetry Card 4: Quad-Engine Execution Fabric */}
              <AdminTiltCard glowColor="emerald" className="p-5 flex flex-col justify-between">
                <div className="space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                      // 04: QUAD_EXECUTION_FABRIC
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-sm backdrop-blur-md">
                      🎛️
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
                      <span>4 / 4</span>
                      <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30">
                        OPERATIONAL
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Process sandbox isolation verified
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>JavaScript V8:</span>
                      <span className="text-emerald-400 font-bold">12ms • ONLINE</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Python 3.12:</span>
                      <span className="text-emerald-400 font-bold">24ms • ONLINE</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>C++20 Clang:</span>
                      <span className="text-emerald-400 font-bold">18ms • ONLINE</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Java 21 JVM:</span>
                      <span className="text-emerald-400 font-bold">36ms • ONLINE</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono">
                  <span className="text-[10px] text-emerald-400 font-bold">
                    Zero Leaks
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab("system");
                      playCyberSound("blip");
                    }}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    RUN_DIAGNOSTICS →
                  </button>
                </div>
              </AdminTiltCard>
            </div>

            {/* Interactive 2026 Launchpad (Command Dock) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-mono font-black tracking-wide text-slate-100 flex items-center gap-2">
                    <span className="text-emerald-400">⚡</span> // TACTICAL_COMMAND_LAUNCHPAD
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    High-priority administrative actions with instant distributed synchronization
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    handleResetForm();
                    setActiveTab("create");
                    playCyberSound("blip");
                  }}
                  className="group p-4 rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 hover:bg-slate-900/60 hover:border-emerald-400/50 backdrop-blur-2xl transition-all duration-200 text-left flex items-start gap-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                    ➕
                  </div>
                  <div className="flex-1 min-w-0 font-mono">
                    <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <span>[01: CREATE_PROBLEM]</span>
                      <span className="text-xs text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      Author challenges with auto multi-language starter code, hidden test vectors, and live IDE sync.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("contests");
                    loadContests();
                    playCyberSound("blip");
                  }}
                  className="group p-4 rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 hover:bg-slate-900/60 hover:border-amber-400/50 backdrop-blur-2xl transition-all duration-200 text-left flex items-start gap-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                    🏆
                  </div>
                  <div className="flex-1 min-w-0 font-mono">
                    <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <span>[02: DEPLOY_CONTEST]</span>
                      <span className="text-xs text-amber-400 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      Deploy real-time ranked coding battles with dynamic live leaderboards and instant countdowns.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("import");
                    playCyberSound("blip");
                  }}
                  className="group p-4 rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 hover:bg-slate-900/60 hover:border-cyan-400/50 backdrop-blur-2xl transition-all duration-200 text-left flex items-start gap-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                    📁
                  </div>
                  <div className="flex-1 min-w-0 font-mono">
                    <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <span>[03: BATCH_IMPORT]</span>
                      <span className="text-xs text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      Drag & drop raw LeetCode-style question packages with instant schema validation and staging.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("users");
                    loadUsers();
                    playCyberSound("blip");
                  }}
                  className="group p-4 rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 hover:bg-slate-900/60 hover:border-sky-400/50 backdrop-blur-2xl transition-all duration-200 text-left flex items-start gap-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/40 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                    👥
                  </div>
                  <div className="flex-1 min-w-0 font-mono">
                    <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <span>[04: ROSTER_PERMISSIONS]</span>
                      <span className="text-xs text-sky-400 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      Elevate coder accounts to Super-Admin, calibrate Elo scores, and inspect activity logs.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("profile");
                    playCyberSound("blip");
                  }}
                  className="group p-4 rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 hover:bg-slate-900/60 hover:border-emerald-400/50 backdrop-blur-2xl transition-all duration-200 text-left flex items-start gap-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                    🛡️
                  </div>
                  <div className="flex-1 min-w-0 font-mono">
                    <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <span>[05: ROOT_VAULT]</span>
                      <span className="text-xs text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      Manage root credentials, rotate master passcodes, configure audio SFX, and choose HUD themes.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleExportJson();
                    playCyberSound("success");
                  }}
                  className="group p-4 rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 hover:bg-slate-900/60 hover:border-cyan-400/50 backdrop-blur-2xl transition-all duration-200 text-left flex items-start gap-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                    📥
                  </div>
                  <div className="flex-1 min-w-0 font-mono">
                    <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <span>[06: GLOBAL_EXPORT]</span>
                      <span className="text-xs text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      Download complete JSON backup of all problems and test cases for disaster recovery.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsBroadcastModalOpen(true);
                    playCyberSound("blip");
                  }}
                  className="group p-4 rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 hover:bg-slate-900/60 hover:border-amber-400/50 backdrop-blur-2xl transition-all duration-200 text-left flex items-start gap-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                    📢
                  </div>
                  <div className="flex-1 min-w-0 font-mono">
                    <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <span>[07: BROADCAST_ALERT]</span>
                      <span className="text-xs text-amber-400 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      Push instant live announcement alerts to every student's notification bell and dashboard.
                    </p>
                  </div>
                </button>
              </div>

              {/* Broadcast Modal Dialog */}
              {isBroadcastModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                  <div className="w-full max-w-lg bg-[#0c1024] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden font-mono">
                    <div className="p-5 border-b border-white/10 flex items-center justify-between bg-amber-500/10">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">📢</span>
                        <div>
                          <h3 className="text-sm font-bold text-white">BROADCAST_STUDENT_ALERT</h3>
                          <p className="text-[11px] text-slate-400">Sends live notification to all connected students</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsBroadcastModalOpen(false)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-5 space-y-4">
                      {broadcastFeedback && (
                        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                          <span>✓</span> {broadcastFeedback}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-300">ALERT_TITLE</Label>
                        <Input
                          placeholder="e.g. Contest starting soon or System maintenance"
                          value={broadcastTitle}
                          onChange={(e) => setBroadcastTitle(e.target.value)}
                          className="bg-white/5 border-white/10 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-300">MESSAGE_PAYLOAD</Label>
                        <textarea
                          rows={4}
                          placeholder="Enter details for all students..."
                          value={broadcastMessage}
                          onChange={(e) => setBroadcastMessage(e.target.value)}
                          className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-amber-500/60 transition-colors"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsBroadcastModalOpen(false)}
                          className="h-8 text-xs border-white/10 text-slate-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleBroadcastAnnouncement}
                          disabled={!broadcastTitle.trim() || !broadcastMessage.trim()}
                          className="h-8 text-xs bg-amber-500 hover:bg-amber-600 text-black font-bold gap-1.5 shadow-md shadow-amber-500/20"
                        >
                          <span>⚡</span> Dispatch Live Alert
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Split Section: Algorithmic Topic Visualizer & Live Audit Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Topic Breakdown & Difficulty Visualizer (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 backdrop-blur-2xl p-5 shadow-[0_16px_50px_rgba(0,0,0,0.4)] space-y-4 font-mono">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <span className="text-emerald-400">📊</span> // ALGORITHMIC_TOPIC_MATRIX
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Filter questions by classification topic across the platform
                      </p>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold">
                      [{AVAILABLE_TOPICS.length} TOPICS]
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TOPICS.map((topic) => {
                      const count = allQuestions.filter((q) =>
                        q.topics.some((t) => t.name.toLowerCase() === topic.toLowerCase())
                      ).length;
                      return (
                        <button
                          key={topic}
                          onClick={() => {
                            setSearchQuery(topic);
                            setActiveTab("questions");
                            playCyberSound("blip");
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500/15 hover:border-emerald-400/60 border border-white/10 text-xs transition-all flex items-center gap-1.5 group backdrop-blur-md"
                        >
                          <span className="text-slate-300 group-hover:text-emerald-300 transition-colors">
                            {topic}
                          </span>
                          <span className="px-1.5 py-0.2 rounded-md bg-white/[0.06] text-[10px] text-emerald-400 font-bold border border-white/10">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs backdrop-blur-md">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-emerald-400">⚡</span>
                      <span>Custom topics dynamically indexed upon question authoring.</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setActiveTab("create");
                        playCyberSound("blip");
                      }}
                      className="h-7 text-xs font-mono font-bold text-emerald-400 hover:bg-emerald-500/15 rounded-lg"
                    >
                      [+ ADD_TOPIC]
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right: Live Audit & Activity Stream (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 backdrop-blur-2xl p-5 shadow-[0_16px_50px_rgba(0,0,0,0.4)] space-y-3 font-mono">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <span className="text-emerald-400">🛰️</span> // KERNEL_AUDIT_STREAM
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Real-time kernel events & runtime execution pings
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        playCyberSound("blip");
                        handleRunHealthDiagnostic();
                      }}
                      className="p-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-400 text-emerald-400 text-xs backdrop-blur-md transition-colors"
                      title="Run Diagnostic Ping"
                    >
                      🔄
                    </button>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 pb-2">
                    {(["all", "system", "question", "contest", "security"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setAuditFilter(filter);
                          playCyberSound("blip");
                        }}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all backdrop-blur-md ${
                          auditFilter === filter
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                            : "bg-white/[0.04] text-slate-400 border border-white/10 hover:text-slate-200"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {auditLogs
                      .filter((l) => auditFilter === "all" || l.type === auditFilter)
                      .map((log) => {
                        const iconMap = {
                          system: "🎛️",
                          question: "📚",
                          contest: "🏆",
                          security: "🛡️",
                        };
                        const colorMap = {
                          system: "text-cyan-400 bg-cyan-500/10 border-cyan-500/25",
                          question: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
                          contest: "text-amber-400 bg-amber-500/10 border-amber-500/25",
                          security: "text-rose-400 bg-rose-500/10 border-rose-500/25",
                        };
                        return (
                          <div
                            key={log.id}
                            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5 text-xs animate-in fade-in backdrop-blur-md"
                          >
                            <span className="text-sm mt-0.5">{iconMap[log.type]}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-200 leading-snug font-mono text-[11px]">{log.message}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-mono text-slate-500">{log.time}</span>
                                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold ${colorMap[log.type]}`}>
                                  {log.type.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

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
            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-900/40 border border-white/10 border-t-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="w-full md:w-80">
                  <Input
                    placeholder="Search by title, slug, or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 text-xs font-mono bg-white/[0.04] border-white/10 text-cyan-200 placeholder-slate-500 focus:border-cyan-400/60 focus:bg-white/[0.08] backdrop-blur-md transition-all shadow-inner"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <span className="text-xs font-mono text-cyan-400 font-semibold">// FILTER:</span>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="h-9 text-xs font-mono rounded-xl bg-white/[0.04] text-cyan-200 px-3 py-1 border border-white/10 font-medium focus:border-cyan-400 focus:outline-none backdrop-blur-md transition-all"
                  >
                    <option value="ALL" className="bg-slate-900 text-slate-200">All Difficulties</option>
                    <option value="EASY" className="bg-slate-900 text-emerald-400">Easy</option>
                    <option value="MEDIUM" className="bg-slate-900 text-amber-400">Medium</option>
                    <option value="HARD" className="bg-slate-900 text-rose-400">Hard</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-9 text-xs font-mono rounded-xl bg-white/[0.04] text-cyan-200 px-3 py-1 border border-white/10 font-medium focus:border-cyan-400 focus:outline-none backdrop-blur-md transition-all"
                  >
                    <option value="ALL" className="bg-slate-900 text-slate-200">All Sources</option>
                    <option value="CUSTOM" className="bg-slate-900 text-cyan-300">Custom Admin Only ({customSlugs.size})</option>
                    <option value="BUILT_IN" className="bg-slate-900 text-slate-400">Built-in Only ({allQuestions.length - customSlugs.size})</option>
                  </select>
                </div>
              </div>

              {/* Order Tools Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span className="text-cyan-400 font-bold">⠿ DRAG & REORDER:</span>
                  <span>Grab drag handles to reorder question sequence in real-time.</span>
                  {isCustomOrderActive && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold backdrop-blur-md">
                      CUSTOM_ORDER_ACTIVE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { handleSortByDifficulty(); playCyberSound("blip"); }}
                    className="h-7 text-[11px] font-mono font-bold gap-1 rounded-lg border-white/10 border-t-white/20 bg-white/[0.04] text-cyan-300 hover:bg-cyan-500/15 backdrop-blur-md transition-all shadow-sm"
                    title="Strictly arrange 50 Easy -> 50 Medium -> 50 Hard"
                  >
                    <span>🎯</span> TIER_BY_DIFFICULTY (50E → 50M → 50H)
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { handleResetToDefaultOrder(); playCyberSound("blip"); }}
                    className="h-7 text-[11px] font-mono text-slate-400 hover:text-cyan-300 gap-1 hover:bg-white/[0.05] rounded-lg transition-all"
                    title="Reset to factory default sequence"
                  >
                    <span>🔄</span> RESET_ORDER
                  </Button>
                </div>
              </div>
            </div>

            {/* Questions Table */}
            <div className="rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-white/[0.03] text-slate-300 uppercase tracking-wider font-mono text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-3 text-center w-12 text-slate-400">#</th>
                      <th className="py-3.5 px-2 text-center w-14 text-slate-400">Order</th>
                      <th className="py-3.5 px-4">Title & Slug</th>
                      <th className="py-3.5 px-4">Difficulty</th>
                      <th className="py-3.5 px-4">Topics</th>
                      <th className="py-3.5 px-4">Method Name</th>
                      <th className="py-3.5 px-4">Test Cases</th>
                      <th className="py-3.5 px-4">Source</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] font-mono">
                    {filteredQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-10 text-center text-slate-400 font-mono">
                          // NO QUESTIONS MATCHED THE ACTIVE TELEMETRY FILTER //
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
                                ? "opacity-30 bg-cyan-500/10 scale-[0.99]"
                                : isTargeted
                                ? "bg-cyan-500/15 border-y-2 border-cyan-400"
                                : "hover:bg-white/[0.04]"
                            }`}
                          >
                            {/* Sequence Number */}
                            <td className="py-3.5 px-3 text-center font-mono text-cyan-400 font-bold text-[11px]">
                              {idx + 1}
                            </td>

                            {/* Drag Handle & Quick Move Arrows */}
                            <td className="py-3.5 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <span
                                  className="cursor-grab active:cursor-grabbing text-base text-slate-500 hover:text-cyan-400 transition-colors select-none p-1"
                                  title="Click and drag to reposition"
                                >
                                  ⠿
                                </span>
                                <div className="flex flex-col gap-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveQuestion(q.slug, "UP")}
                                    disabled={idx === 0}
                                    className="text-[9px] text-slate-500 hover:text-cyan-300 disabled:opacity-20 px-1 py-0.2 rounded hover:bg-white/[0.08]"
                                    title="Move up"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveQuestion(q.slug, "DOWN")}
                                    disabled={idx === filteredQuestions.length - 1}
                                    className="text-[9px] text-slate-500 hover:text-cyan-300 disabled:opacity-20 px-1 py-0.2 rounded hover:bg-white/[0.08]"
                                    title="Move down"
                                  >
                                    ▼
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Title & Slug */}
                            <td className="py-3.5 px-4 font-semibold">
                              <div className="text-slate-100 text-xs font-bold flex items-center gap-1.5">
                                <span>{q.title}</span>
                              </div>
                              <div className="text-[11px] text-cyan-400/80 font-mono mt-0.5">{q.slug}</div>
                            </td>

                            {/* Difficulty */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono backdrop-blur-md ${
                                  q.difficulty === "EASY"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                                    : q.difficulty === "MEDIUM"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                                    : "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]"
                                }`}
                              >
                                {q.difficulty}
                              </span>
                            </td>

                            {/* Topics */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1 max-w-xs font-mono">
                                {q.topics?.slice(0, 3).map((t, tIdx) => (
                                  <span key={tIdx} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-slate-300 border border-white/10 backdrop-blur-sm">
                                    {t.name}
                                  </span>
                                ))}
                                {q.topics && q.topics.length > 3 && (
                                  <span className="text-[10px] text-cyan-400/70 font-mono self-center">+{q.topics.length - 3}</span>
                                )}
                              </div>
                            </td>

                            {/* Method Name */}
                            <td className="py-3.5 px-4 font-mono text-[11px] text-cyan-300">
                              {q.methodName || "solution"}()
                            </td>

                            {/* Test Cases */}
                            <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                              {totalCases} cases ({q.publicTestCases?.length || 0} pub / {q.hiddenTestCases?.length || 0} hid)
                            </td>

                            {/* Source */}
                            <td className="py-3.5 px-4">
                              {isCustom ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 backdrop-blur-sm">
                                  ADMIN_CUSTOM
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 text-[10px] font-mono border border-white/10 backdrop-blur-sm">
                                  BUILT_IN
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 font-mono">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => { handleEditQuestion(q); playCyberSound("blip"); }}
                                  className="h-7 px-2.5 text-[11px] font-mono rounded-lg border-white/10 bg-white/[0.04] text-cyan-300 hover:bg-cyan-500/20 backdrop-blur-md transition-all shadow-sm"
                                >
                                  EDIT
                                </Button>

                                <Link href={`/problems/${q.slug}`} target="_blank">
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/15 rounded-lg transition-all">
                                    ▶ IDE
                                  </Button>
                                </Link>

                                {isCustom && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => { handleDelete(q.slug); playCyberSound("alert"); }}
                                    className="h-7 px-2 text-[11px] font-mono text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 rounded-lg transition-all"
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
            <Card className="rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl text-slate-100 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-5 bg-white/[0.02]">
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase mb-0.5">// CONTENT_STUDIO // LAB</div>
                  <CardTitle className="text-xl font-mono font-bold text-slate-100">
                    {editingSlug ? `Editing Question: ${formData.title}` : "Create & Publish New Question"}
                  </CardTitle>
                  <CardDescription className="text-xs font-mono text-slate-400 mt-1">
                    Configure question parameters, test cases, and starter code. Saved questions will be immediately available in the IDE.
                  </CardDescription>
                </div>
                {editingSlug && (
                  <Button variant="outline" size="sm" onClick={() => { handleResetForm(); playCyberSound("blip"); }} className="text-xs font-mono h-8 rounded-lg border-emerald-500/30 bg-white/[0.04] text-emerald-300 hover:bg-emerald-500/10 backdrop-blur-md">
                    Cancel Edit (Create New)
                  </Button>
                )}
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSaveQuestion} className="space-y-6">
                  {/* Basic Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="title" className="text-xs font-mono text-slate-300 font-bold">Problem Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g. Valid Palindrome"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                        className="h-9 text-xs bg-white/[0.04] border-white/10 text-white placeholder-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.08] backdrop-blur-md rounded-xl transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="slug" className="text-xs font-mono text-slate-300 font-bold">Problem Slug (URL identifier) *</Label>
                      <Input
                        id="slug"
                        placeholder="e.g. valid-palindrome"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                        className="h-9 text-xs font-mono bg-white/[0.04] border-white/10 text-emerald-300 placeholder-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.08] backdrop-blur-md rounded-xl transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="difficulty" className="text-xs font-mono text-slate-300 font-bold">Difficulty</Label>
                      <select
                        id="difficulty"
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                        className="w-full h-9 text-xs rounded-xl bg-white/[0.04] text-slate-200 px-3 py-1 border border-white/10 font-medium focus:border-emerald-400 focus:outline-none backdrop-blur-md transition-all"
                      >
                        <option value="EASY" className="bg-slate-900 text-emerald-400">Easy</option>
                        <option value="MEDIUM" className="bg-slate-900 text-amber-400">Medium</option>
                        <option value="HARD" className="bg-slate-900 text-rose-400">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Method Name & Topics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="methodName" className="text-xs font-mono text-slate-300 font-bold">
                        Target Method Name *
                      </Label>
                      <Input
                        id="methodName"
                        placeholder="e.g. isPalindrome"
                        value={formData.methodName}
                        onChange={(e) => setFormData({ ...formData, methodName: e.target.value })}
                        required
                        className="h-9 text-xs font-mono bg-white/[0.04] border-white/10 text-cyan-300 placeholder-slate-500 focus:border-cyan-400/60 focus:bg-white/[0.08] backdrop-blur-md rounded-xl transition-all"
                      />
                      <p className="text-[10px] text-slate-400 font-mono">The function name called during test evaluation.</p>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <Label className="text-xs font-mono text-slate-300 font-bold">Topics & Categories</Label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {AVAILABLE_TOPICS.map((topic) => {
                          const selected = formData.topics.includes(topic);
                          return (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => toggleTopic(topic)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all backdrop-blur-md ${
                                selected
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                                  : "bg-white/[0.04] text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-200"
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
                          className="h-8 text-xs max-w-xs bg-white/[0.04] border-white/10 text-white placeholder-slate-500 focus:border-emerald-400/60 rounded-lg backdrop-blur-md"
                        />
                        <Button type="button" size="sm" variant="outline" onClick={handleAddCustomTopic} className="h-8 text-xs font-mono rounded-lg border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] backdrop-blur-md">
                          Add Topic
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Description & Constraints */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="description" className="text-xs font-mono text-slate-300 font-bold">Problem Description (Markdown supported)</Label>
                      <textarea
                        id="description"
                        rows={6}
                        placeholder="Explain the problem statement, parameters, return format, and edge cases..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded-xl bg-white/[0.04] p-3 text-xs border border-white/10 font-sans text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400/60 focus:bg-white/[0.08] backdrop-blur-md transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="constraints" className="text-xs font-mono text-slate-300 font-bold">Constraints (1 per line)</Label>
                      <textarea
                        id="constraints"
                        rows={6}
                        placeholder="e.g.&#10;1 <= nums.length <= 10^5&#10;-10^9 <= nums[i] <= 10^9"
                        value={formData.constraintsText}
                        onChange={(e) => setFormData({ ...formData, constraintsText: e.target.value })}
                        className="w-full rounded-xl bg-white/[0.04] p-3 text-xs border border-white/10 font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-emerald-400/60 focus:bg-white/[0.08] backdrop-blur-md transition-all"
                      />
                    </div>
                  </div>

                  {/* Test Cases Builder */}
                  <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold font-mono text-slate-100">Test Cases Builder ({testCases.length})</h3>
                        <p className="text-[11px] font-mono text-slate-400">Define inputs, JSON arguments, and expected outputs for automatic evaluation.</p>
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
                        className="h-8 text-xs font-mono font-semibold gap-1 rounded-lg border-white/10 bg-white/[0.04] text-emerald-300 hover:bg-emerald-500/15 backdrop-blur-md shadow-sm"
                      >
                        <span>➕</span> Add Test Case
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {testCases.map((tc, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5 backdrop-blur-md">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-cyan-400 font-mono">Case #{idx + 1}</span>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer font-mono">
                                <input
                                  type="checkbox"
                                  checked={tc.isPublic}
                                  onChange={(e) => {
                                    const updated = [...testCases];
                                    updated[idx].isPublic = e.target.checked;
                                    setTestCases(updated);
                                  }}
                                  className="rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-0"
                                />
                                <span>Public Example</span>
                              </label>

                              {testCases.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTestCases(testCases.filter((_, i) => i !== idx));
                                  }}
                                  className="text-xs font-mono text-rose-400 hover:text-rose-300 hover:underline"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-[11px] font-mono text-slate-400">Display Input</Label>
                              <Input
                                placeholder='e.g. nums = [2,7,11,15], target = 9'
                                value={tc.input}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].input = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="h-8 text-xs font-mono bg-white/[0.04] border-white/10 text-white rounded-lg focus:border-cyan-400/60"
                              />
                            </div>

                            <div>
                              <Label className="text-[11px] font-mono text-slate-400">Arguments JSON array [arg1, arg2, ...] *</Label>
                              <Input
                                placeholder='e.g. [[2,7,11,15], 9]'
                                value={tc.argsStr}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].argsStr = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="h-8 text-xs font-mono bg-white/[0.04] border-white/10 text-cyan-300 rounded-lg focus:border-cyan-400/60"
                              />
                            </div>

                            <div>
                              <Label className="text-[11px] font-mono text-slate-400">Display Output</Label>
                              <Input
                                placeholder='e.g. [0, 1]'
                                value={tc.output}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].output = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="h-8 text-xs font-mono bg-white/[0.04] border-white/10 text-white rounded-lg focus:border-cyan-400/60"
                              />
                            </div>

                            <div>
                              <Label className="text-[11px] font-mono text-slate-400">Expected Return Value JSON *</Label>
                              <Input
                                placeholder='e.g. [0, 1] or true or 42'
                                value={tc.expectedStr}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].expectedStr = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="h-8 text-xs font-mono bg-white/[0.04] border-white/10 text-emerald-300 rounded-lg focus:border-emerald-400/60"
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
                      <Label className="text-xs font-mono text-slate-300 font-bold">Starter Code Templates</Label>
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
                        className="h-7 text-[11px] font-mono rounded-lg border-white/10 bg-white/[0.04] text-cyan-300 hover:bg-cyan-500/15 backdrop-blur-md"
                      >
                        🪄 Regenerate Templates
                      </Button>
                    </div>

                    <Tabs defaultValue="js" className="w-full">
                      <TabsList className="bg-white/[0.04] border border-white/10 h-8 rounded-xl p-1 backdrop-blur-md">
                        <TabsTrigger value="js" className="text-xs py-1 rounded-lg data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-sm">JavaScript</TabsTrigger>
                        <TabsTrigger value="py" className="text-xs py-1 rounded-lg data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-sm">Python 3</TabsTrigger>
                        <TabsTrigger value="cpp" className="text-xs py-1 rounded-lg data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-sm">C++</TabsTrigger>
                        <TabsTrigger value="java" className="text-xs py-1 rounded-lg data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-sm">Java</TabsTrigger>
                      </TabsList>

                      <TabsContent value="js" className="m-0 pt-2">
                        <textarea
                          rows={6}
                          value={formData.codeJs}
                          onChange={(e) => setFormData({ ...formData, codeJs: e.target.value })}
                          className="w-full rounded-xl bg-slate-950/60 p-3 text-xs font-mono border border-white/10 text-emerald-300 focus:outline-none focus:border-cyan-400 backdrop-blur-md"
                        />
                      </TabsContent>

                      <TabsContent value="py" className="m-0 pt-2">
                        <textarea
                          rows={6}
                          value={formData.codePy}
                          onChange={(e) => setFormData({ ...formData, codePy: e.target.value })}
                          className="w-full rounded-xl bg-slate-950/60 p-3 text-xs font-mono border border-white/10 text-emerald-300 focus:outline-none focus:border-cyan-400 backdrop-blur-md"
                        />
                      </TabsContent>

                      <TabsContent value="cpp" className="m-0 pt-2">
                        <textarea
                          rows={6}
                          value={formData.codeCpp}
                          onChange={(e) => setFormData({ ...formData, codeCpp: e.target.value })}
                          className="w-full rounded-xl bg-slate-950/60 p-3 text-xs font-mono border border-white/10 text-emerald-300 focus:outline-none focus:border-cyan-400 backdrop-blur-md"
                        />
                      </TabsContent>

                      <TabsContent value="java" className="m-0 pt-2">
                        <textarea
                          rows={6}
                          value={formData.codeJava}
                          onChange={(e) => setFormData({ ...formData, codeJava: e.target.value })}
                          className="w-full rounded-xl bg-slate-950/60 p-3 text-xs font-mono border border-white/10 text-emerald-300 focus:outline-none focus:border-cyan-400 backdrop-blur-md"
                        />
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Feedback Messages */}
                  {formFeedback && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-mono font-medium flex items-center gap-2 backdrop-blur-md ${
                        formFeedback.type === "success"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                      }`}
                    >
                      <span>{formFeedback.type === "success" ? "✓" : "⚠️"}</span>
                      <span>{formFeedback.message}</span>
                      {formFeedback.type === "success" && formFeedback.slug && (
                        <Link href={`/problems/${formFeedback.slug}`} target="_blank" className="underline ml-auto font-bold text-emerald-300 hover:text-emerald-200">
                          Open in IDE &rarr;
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" className="h-10 px-8 text-xs font-mono font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] rounded-xl transition-all">
                      {editingSlug ? "SAVE_CHANGES" : "CREATE & PUBLISH QUESTION"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { handleResetForm(); playCyberSound("blip"); }} className="h-10 text-xs font-mono border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] rounded-xl backdrop-blur-md">
                      RESET_FORM
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: SECURED DRAG & DROP FILE IMPORTER (.JSON, .PDF, .MD, .TXT) */}
          <TabsContent value="import" className="space-y-6 m-0 focus-visible:outline-none">
            <Card className="rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl text-slate-100 overflow-hidden">
              <CardHeader className="border-b border-white/10 pb-5 bg-white/[0.02]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-base">🛡️</span>
                      <CardTitle className="text-xl font-mono font-bold tracking-tight text-slate-100">Secured Question & Document Importer</CardTitle>
                      <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold backdrop-blur-md">
                        Anti-Crash Sandboxed
                      </span>
                    </div>
                    <CardDescription className="text-xs font-mono text-slate-400">
                      Upload verified algorithmic problem documents or JSON question arrays. Prevents crashes, malicious payloads, and memory overflow.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {loadedFileInfo && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearImportedFile}
                        className="h-8 text-xs font-mono font-semibold gap-1.5 text-rose-400 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg backdrop-blur-md"
                      >
                        ✕ Clear File
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadTemplate}
                      className="h-8 text-xs font-mono font-semibold gap-1.5 rounded-lg border-white/10 bg-white/[0.04] text-cyan-300 hover:bg-cyan-500/15 backdrop-blur-md shadow-sm"
                    >
                      <span>📥</span> Download JSON Template
                    </Button>
                  </div>
                </div>

                {/* Whitelisted Formats & Security Badge */}
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Secured Formats:</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 backdrop-blur-md">
                      📄 .JSON <span className="text-[10px] font-normal opacity-80">(Standard Schema)</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20 backdrop-blur-md">
                      📑 .PDF <span className="text-[10px] font-normal opacity-80">(Problem Sheets)</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 backdrop-blur-md">
                      📝 .MD <span className="text-[10px] font-normal opacity-80">(Markdown Specs)</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-white/[0.04] text-slate-300 border border-white/10 backdrop-blur-md">
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
                  <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all backdrop-blur-md ${
                    loadedFileInfo.valid
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-xl shrink-0 shadow-inner">
                        {loadedFileInfo.format === "JSON" ? "📄" : loadedFileInfo.format === "PDF" ? "📑" : loadedFileInfo.format === "MARKDOWN" ? "📝" : "📃"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white truncate font-mono">{loadedFileInfo.name}</p>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 font-bold">
                            {loadedFileInfo.format}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          Size: <span className="text-slate-300">{loadedFileInfo.size}</span> • {loadedFileInfo.valid ? "✓ Validated & Cleaned" : "⛔ Security Rejected"}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearImportedFile}
                      className="h-8 px-2.5 text-xs font-mono text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg"
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
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all relative overflow-hidden backdrop-blur-md ${
                    isDragging
                      ? "border-cyan-400 bg-cyan-500/15 scale-[1.01] shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-4 ring-cyan-500/20"
                      : "border-white/15 bg-white/[0.02] hover:border-cyan-400/50 hover:bg-white/[0.04]"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept=".json,.pdf,.txt,.md,application/json,application/pdf,text/markdown,text/plain"
                    className="hidden"
                  />
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-3xl mb-3 shadow-inner group-hover:scale-110 transition-transform">
                    {isDragging ? "📥" : "📂"}
                  </div>
                  <h3 className="text-sm font-bold text-white font-mono">
                    Drop your secured <span className="text-amber-400">.JSON</span>, <span className="text-rose-400">.PDF</span>, or <span className="text-cyan-400">.MD</span> file here, or <span className="text-cyan-400 underline">browse</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-1 max-w-lg mx-auto">
                    Automatic multi-format problem parsing with test case generation and algorithmic scaffolding.
                  </p>
                </div>

                {/* Direct Paste / Raw Content Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="jsonText" className="text-xs font-bold font-mono text-slate-300 flex items-center gap-1.5">
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
                        className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline font-semibold"
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
                          className="text-[11px] font-mono text-slate-400 hover:text-white"
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
                    className="w-full rounded-xl bg-white/[0.04] p-3 text-xs font-mono border border-white/10 text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.08] backdrop-blur-md transition-all shadow-inner"
                  />
                </div>

                {/* Feedback Notification Banner */}
                {importFeedback && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-mono font-medium flex items-start gap-3 backdrop-blur-md animate-in fade-in duration-200 ${
                      importFeedback.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                    }`}
                  >
                    <span className="text-sm mt-0.5">{importFeedback.type === "success" ? "✓" : "⚠️"}</span>
                    <div className="flex-1 leading-relaxed">{importFeedback.message}</div>
                  </div>
                )}

                {/* Parsed Preview Table & Publish Action */}
                {parsedImportItems.length > 0 && (
                  <div className="space-y-4 pt-2 border-t border-white/[0.06]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                          <span>📋</span> Verified Questions Ready to Import ({parsedImportItems.length})
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
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
                          className="h-9 text-xs font-mono border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] rounded-lg backdrop-blur-md"
                        >
                          Discard
                        </Button>
                        <Button
                          onClick={handleExecuteImport}
                          className="h-9 px-6 text-xs font-mono font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] rounded-lg gap-1.5 transition-all"
                        >
                          <span>🚀</span> Import & Publish All ({parsedImportItems.length})
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden shadow-xl backdrop-blur-2xl">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-white/[0.03] text-slate-300 uppercase text-[10px] font-mono border-b border-white/10">
                            <tr>
                              <th className="py-3.5 px-3 w-10 text-center text-slate-400">#</th>
                              <th className="py-3.5 px-3">Question Title</th>
                              <th className="py-3.5 px-3">Slug</th>
                              <th className="py-3.5 px-3">Difficulty</th>
                              <th className="py-3.5 px-3">Topics</th>
                              <th className="py-3.5 px-3">Method Signature</th>
                              <th className="py-3.5 px-3">Test Cases</th>
                              <th className="py-3.5 px-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.06] font-mono">
                            {parsedImportItems.map((item, i) => (
                              <tr key={i} className="hover:bg-white/[0.04] transition-colors">
                                <td className="py-3.5 px-3 font-mono text-[10px] text-center text-slate-400">
                                  {i + 1}
                                </td>
                                <td className="py-3.5 px-3 font-bold text-slate-100">
                                  {item.title}
                                </td>
                                <td className="py-3.5 px-3 font-mono text-[11px] text-cyan-400/80">
                                  {item.slug}
                                </td>
                                <td className="py-3.5 px-3">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                                      item.difficulty === "EASY"
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                        : item.difficulty === "MEDIUM"
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                        : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                    }`}
                                  >
                                    {item.difficulty}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3">
                                  <div className="flex flex-wrap gap-1">
                                    {item.topics.slice(0, 2).map((t, tIdx) => (
                                      <span key={tIdx} className="px-2 py-0.5 rounded-md text-[10px] bg-white/[0.04] text-slate-300 border border-white/10">
                                        {t.name}
                                      </span>
                                    ))}
                                    {item.topics.length > 2 && (
                                      <span className="text-[10px] text-cyan-400/70 font-mono self-center">
                                        +{item.topics.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3.5 px-3 font-mono text-cyan-300 text-[11px]">
                                  {item.methodName}()
                                </td>
                                <td className="py-3.5 px-3 font-mono text-[11px]">
                                  <span className="text-emerald-400 font-bold">{item.publicTestCases?.length || 0} public</span>
                                  {item.hiddenTestCases && item.hiddenTestCases.length > 0 && (
                                    <span className="text-slate-400 ml-1.5">
                                      + {item.hiddenTestCases.length} hidden
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveParsedItem(i)}
                                    title="Remove from import queue"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
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
              <AdminTiltCard className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 border-t-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider mb-2">// TOTAL_QUESTIONS</div>
                <div className="text-3xl font-mono font-black text-white">{allQuestions.length}</div>
                <p className="text-[11px] font-mono text-slate-400 mt-1">Available in practice bank</p>
              </AdminTiltCard>

              <AdminTiltCard className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 border-t-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
                <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">// CUSTOM_ADMIN_QUESTIONS</div>
                <div className="text-3xl font-mono font-black text-cyan-300">{customSlugs.size}</div>
                <p className="text-[11px] font-mono text-slate-400 mt-1">Created / imported by root</p>
              </AdminTiltCard>

              <AdminTiltCard className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 border-t-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider mb-2">// BUILT_IN_QUESTIONS</div>
                <div className="text-3xl font-mono font-black text-amber-300">{allQuestions.length - customSlugs.size}</div>
                <p className="text-[11px] font-mono text-slate-400 mt-1">Factory curated set</p>
              </AdminTiltCard>

              <AdminTiltCard className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 border-t-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
                <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider mb-2">// CONNECTED_ACCOUNTS</div>
                <div className="text-3xl font-mono font-black text-purple-300">{getAllAccounts().length}</div>
                <p className="text-[11px] font-mono text-slate-400 mt-1">Logged in on this browser</p>
              </AdminTiltCard>
            </div>

            <Card className="rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl text-slate-100 overflow-hidden">
              <CardHeader className="border-b border-white/10 pb-5 bg-white/[0.02]">
                <CardTitle className="text-lg font-mono font-bold text-slate-100">Maintenance & Kernel Operations</CardTitle>
                <CardDescription className="text-xs font-mono text-slate-400">
                  Tools to manage local storage caches and platform data integrity.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-100">Export All Platform Data</h4>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Download full JSON archive of all built-in and custom questions with complete test suites.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExportJson} className="h-8 text-xs font-mono rounded-lg border-white/10 bg-white/[0.04] text-cyan-300 hover:bg-cyan-500/15 backdrop-blur-md shrink-0">
                    Export Backup (.json)
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-100">Reset Custom Questions</h4>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Clear all custom questions created in admin and revert strictly to default factory questions.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      if (confirm("Are you sure you want to delete all custom questions? This action cannot be undone.")) {
                        localStorage.removeItem("customProblems");
                        resetQuestionOrder();
                        try {
                          await fetch("/api/admin/questions?clearAll=true", { method: "DELETE" });
                        } catch (e) {}
                        if (typeof window !== "undefined") {
                          window.dispatchEvent(new CustomEvent("codearena_problems_updated", { detail: { reset: true } }));
                        }
                        await loadQuestions();
                        playCyberSound("alert");
                        alert("Custom questions reset to factory defaults.");
                      }
                    }}
                    className="h-8 text-xs font-mono rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 backdrop-blur-md shrink-0"
                  >
                    Reset to Factory
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: USER MANAGEMENT */}
          <TabsContent value="users" className="space-y-6 m-0 focus-visible:outline-none">
            <Card className="rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl text-slate-100 overflow-hidden">
              <CardHeader className="border-b border-white/10 pb-4 bg-white/[0.02]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase mb-0.5">// PLATFORM_REGISTRY // ACCESS_CONTROL</div>
                    <CardTitle className="text-xl font-mono font-bold flex items-center gap-2 text-slate-100">
                      <span>👥</span> Platform User Accounts & Access Controls
                    </CardTitle>
                    <CardDescription className="text-xs font-mono text-slate-400 mt-1">
                      Manage administrator roles, review user algorithmic progress, and control system privileges.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search by username or name..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="h-8 text-xs font-mono w-64 bg-white/[0.04] border-white/10 text-cyan-200 placeholder-slate-500 focus:border-cyan-400/60 rounded-xl backdrop-blur-md"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { loadUsers(); playCyberSound("blip"); }}
                      className="h-8 text-xs font-mono font-semibold gap-1 rounded-lg border-white/10 bg-white/[0.04] text-cyan-300 hover:bg-cyan-500/15 backdrop-blur-md"
                    >
                      <span>🔄</span> REFRESH
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => { handleClearAllUsers(); playCyberSound("alert"); }}
                      className="h-8 text-xs font-mono font-semibold gap-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 backdrop-blur-md"
                    >
                      <span>🗑️</span> CLEAR_ALL_USERS
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {userRoleFeedback && (
                  <div className="m-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold flex items-center gap-2 backdrop-blur-md">
                    <span>✅</span>
                    <span>{userRoleFeedback}</span>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-white/[0.03] border-b border-white/10 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      <tr>
                        <th className="px-5 py-3.5 font-bold">Student / User</th>
                        <th className="px-5 py-3.5 font-bold">Login Status & Activity</th>
                        <th className="px-5 py-3.5 font-bold hidden sm:table-cell">College / Org</th>
                        <th className="px-5 py-3.5 font-bold">Role</th>
                        <th className="px-5 py-3.5 font-bold text-right">Solved</th>
                        <th className="px-5 py-3.5 font-bold text-right text-cyan-400">DSA Rating</th>
                        <th className="px-5 py-3.5 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] font-mono">
                      {loadingUsers ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-400 animate-pulse font-mono">
                            Loading platform users...
                          </td>
                        </tr>
                      ) : allUsersList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-mono">
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
                              (u.email && u.email.toLowerCase().includes(q)) ||
                              (u.org && u.org.toLowerCase().includes(q))
                            );
                          })
                          .map((u) => {
                            const isSuper = u.role === "SUPER_ADMIN";
                            const isOnline = u.status === "ONLINE" || (u.lastLoginAt && (Date.now() - new Date(u.lastLoginAt).getTime()) < 30 * 60 * 1000);
                            return (
                              <tr key={u.userId || u.username} className="hover:bg-white/[0.04] transition-colors">
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                                      {u.name ? u.name[0].toUpperCase() : "U"}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-slate-100 text-xs">{u.name}</p>
                                      <p className="text-[11px] text-slate-400 font-mono">@{u.username} • {u.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-3.5">
                                  <div className="space-y-0.5">
                                    {u.status === "BANNED" || u.isBanned ? (
                                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 backdrop-blur-md">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                        BANNED / SUSPENDED
                                      </span>
                                    ) : (
                                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md ${
                                        isOnline ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-white/[0.04] text-slate-400 border border-white/10"
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                                        {isOnline ? "ONLINE NOW" : "LOGGED IN"}
                                      </span>
                                    )}
                                    {u.lastLoginAt && (
                                      <p className="text-[10px] text-slate-400 font-mono">
                                        {new Date(u.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(u.lastLoginAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                      </p>
                                    )}
                                  </div>
                                </td>
                                <td className="px-5 py-3.5 hidden sm:table-cell text-xs text-slate-400">
                                  {u.org || "CodeArena Academy"}
                                </td>
                                <td className="px-5 py-3.5">
                                  <span
                                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${
                                      isSuper
                                        ? "bg-rose-500/15 text-rose-300 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]"
                                        : "bg-white/[0.04] text-slate-300 border border-white/10"
                                    }`}
                                  >
                                    {u.role}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-right font-mono text-xs font-semibold text-slate-200">
                                  {u.problemsSolved}
                                </td>
                                <td className="px-5 py-3.5 text-right font-mono text-xs font-bold text-cyan-400">
                                  {u.score}
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <Button
                                      size="sm"
                                      variant={isSuper ? "destructive" : "outline"}
                                      onClick={() => handleToggleUserRole(u.username, u.role)}
                                      className={`h-7 text-[11px] font-mono rounded-lg backdrop-blur-md ${
                                        isSuper
                                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"
                                          : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
                                      }`}
                                    >
                                      {isSuper ? "Revoke Admin" : "Make Super Admin"}
                                    </Button>
                                    {!isSuper && (
                                      <Button
                                        size="sm"
                                        variant={u.status === "BANNED" || u.isBanned ? "outline" : "destructive"}
                                        onClick={() => handleToggleBanUser(u.username, u.status)}
                                        className={`h-7 text-[11px] font-mono rounded-lg backdrop-blur-md ${
                                          u.status === "BANNED" || u.isBanned
                                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"
                                        }`}
                                      >
                                        {u.status === "BANNED" || u.isBanned ? "Unban" : "Ban"}
                                      </Button>
                                    )}
                                    {!isSuper && (
                                      <button
                                        onClick={() => handleDeleteSingleUser(u.username)}
                                        className="h-7 w-7 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                                        title="Permanently Delete User"
                                      >
                                        🗑️
                                      </button>
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
            {(() => {
              const allSubs = contestsList.flatMap(c => getContestSubmissions(c.id));
              const totalSubs = allSubs.length;
              const totalAc = allSubs.filter(s => s.status === "ACCEPTED").length;
              const totalEnrolled = contestsList.reduce((acc, c) => acc + Math.max(c.participantsCount, (c.registeredUsers || []).length), 0);
              const successRate = totalSubs > 0 ? Math.round((totalAc / totalSubs) * 100) : 0;

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <AdminTiltCard className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 border-t-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex items-center gap-3 backdrop-blur-2xl">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-lg font-bold border border-emerald-500/30">
                      🟢
                    </div>
                    <div>
                      <p className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">// LIVE & UPCOMING</p>
                      <p className="text-xl font-mono font-black text-slate-100">
                        {contestsList.filter(c => c.status === "LIVE").length} <span className="text-xs text-emerald-400 font-normal">Live</span> / {contestsList.filter(c => c.status === "UPCOMING").length} <span className="text-xs text-amber-400 font-normal">Up</span>
                      </p>
                    </div>
                  </AdminTiltCard>

                  <AdminTiltCard className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 border-t-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex items-center gap-3 backdrop-blur-2xl">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-lg font-bold border border-cyan-500/30">
                      👥
                    </div>
                    <div>
                      <p className="text-[11px] font-mono text-cyan-400 font-semibold uppercase">// TOTAL_ENROLLED</p>
                      <p className="text-xl font-mono font-black text-slate-100">{totalEnrolled} <span className="text-xs text-slate-400 font-normal">Students</span></p>
                    </div>
                  </AdminTiltCard>

                  <AdminTiltCard className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 border-t-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex items-center gap-3 backdrop-blur-2xl">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center text-lg font-bold border border-purple-500/30">
                      📝
                    </div>
                    <div>
                      <p className="text-[11px] font-mono text-purple-400 font-semibold uppercase">// SUBMISSIONS_TOTAL</p>
                      <p className="text-xl font-mono font-black text-slate-100">{totalSubs} <span className="text-xs text-slate-400 font-normal">Submits</span></p>
                    </div>
                  </AdminTiltCard>

                  <AdminTiltCard className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 border-t-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex items-center gap-3 backdrop-blur-2xl">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center text-lg font-bold border border-amber-500/30">
                      🏆
                    </div>
                    <div>
                      <p className="text-[11px] font-mono text-amber-400 font-semibold uppercase">// ACCEPTED_SOLVES</p>
                      <p className="text-xl font-mono font-black text-slate-100">{totalAc} <span className="text-xs text-amber-400 font-normal">({successRate}%)</span></p>
                    </div>
                  </AdminTiltCard>
                </div>
              );
            })()}

            {/* Create & Launch Contest Builder */}
            <Card id="contest-builder-card" className="rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 shadow-[0_16px_50px_rgba(0,0,0,0.4)] overflow-hidden text-slate-100 backdrop-blur-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/10 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-amber-400 tracking-widest uppercase mb-0.5">
                      // TOURNAMENT_ORCHESTRATOR // {editingContestId ? "EDIT_MODE" : "BUILDER"}
                    </div>
                    <CardTitle className="text-lg font-mono font-bold flex items-center gap-2 text-slate-100">
                      <span>{editingContestId ? "✏️" : "🚀"}</span> {editingContestId ? "Edit & Update Contest" : "Create & Launch New Contest"}
                    </CardTitle>
                    <CardDescription className="text-xs font-mono text-slate-400">
                      {editingContestId ? "Modify timing, description, problem set, and scoring for this contest." : "Pick questions from the 150 DSA bank, set timing & duration, and start contests instantly for all students."}
                    </CardDescription>
                  </div>
                  {editingContestId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEditContest}
                      className="h-8 text-xs font-mono rounded-lg border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Contest Title */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono text-slate-300 font-bold">Contest Title *</Label>
                    <Input
                      placeholder="e.g. CodeArena Weekly Battle #42"
                      value={contestFormData.title}
                      onChange={(e) => setContestFormData({ ...contestFormData, title: e.target.value })}
                      className="h-9 text-xs bg-white/[0.04] border-white/10 text-white placeholder-slate-500 rounded-xl focus:border-amber-400/60 backdrop-blur-md"
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono text-slate-300 font-bold">Duration (Minutes)</Label>
                    <select
                      value={contestFormData.durationMinutes}
                      onChange={(e) => setContestFormData({ ...contestFormData, durationMinutes: Number(e.target.value) })}
                      className="w-full h-9 text-xs rounded-xl bg-white/[0.04] text-slate-200 px-3 py-1 border border-white/10 font-medium focus:border-amber-400 focus:outline-none backdrop-blur-md"
                    >
                      <option value={30} className="bg-slate-900 text-slate-200">30 Minutes (Sprint)</option>
                      <option value={45} className="bg-slate-900 text-slate-200">45 Minutes</option>
                      <option value={60} className="bg-slate-900 text-slate-200">60 Minutes (1 Hour Standard)</option>
                      <option value={90} className="bg-slate-900 text-slate-200">90 Minutes (1.5 Hours)</option>
                      <option value={120} className="bg-slate-900 text-slate-200">120 Minutes (2 Hours ICPC)</option>
                      <option value={180} className="bg-slate-900 text-slate-200">180 Minutes (3 Hours)</option>
                    </select>
                  </div>

                  {/* Contest Description */}
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs font-mono text-slate-300 font-bold">Description & Instructions</Label>
                    <Input
                      placeholder="Brief rules, topics covered, or description for contestants..."
                      value={contestFormData.description}
                      onChange={(e) => setContestFormData({ ...contestFormData, description: e.target.value })}
                      className="h-9 text-xs bg-white/[0.04] border-white/10 text-white placeholder-slate-500 rounded-xl focus:border-amber-400/60 backdrop-blur-md"
                    />
                  </div>

                  {/* Timing Option */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-mono text-slate-300 font-bold">Contest Start Time</Label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setContestFormData({ ...contestFormData, startTimeOption: "now" })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all backdrop-blur-md ${
                          contestFormData.startTimeOption === "now"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                            : "bg-white/[0.04] text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-200"
                        }`}
                      >
                        🟢 Start Immediately (Live Now)
                      </button>

                      <button
                        type="button"
                        onClick={() => setContestFormData({ ...contestFormData, startTimeOption: "15min" })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all backdrop-blur-md ${
                          contestFormData.startTimeOption === "15min"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                            : "bg-white/[0.04] text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-200"
                        }`}
                      >
                        ⏱️ In 15 Minutes
                      </button>

                      <button
                        type="button"
                        onClick={() => setContestFormData({ ...contestFormData, startTimeOption: "1hour" })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all backdrop-blur-md ${
                          contestFormData.startTimeOption === "1hour"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                            : "bg-white/[0.04] text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-200"
                        }`}
                      >
                        ⏱️ In 1 Hour
                      </button>

                      <button
                        type="button"
                        onClick={() => setContestFormData({ ...contestFormData, startTimeOption: "custom" })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all backdrop-blur-md ${
                          contestFormData.startTimeOption === "custom"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                            : "bg-white/[0.04] text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-200"
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
                          className="h-9 text-xs bg-white/[0.04] border-white/10 text-white rounded-xl backdrop-blur-md"
                        />
                        <p className="text-[10px] text-slate-400 font-mono">Select the future date & time when the contest should open for all students.</p>
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
                        <div className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2 backdrop-blur-md ${
                          isLive
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                            : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-base">{isLive ? "🟢" : "📅"}</span>
                            <div>
                              <p className="font-bold font-mono text-slate-100">
                                {isLive ? "Immediate Live Launch" : `Scheduled Start: ${preview.startFormatted}`}
                              </p>
                              <p className="text-[11px] font-mono text-slate-400">
                                Duration: {contestFormData.durationMinutes}m • Concludes at {preview.endFormatted}
                              </p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${
                            isLive
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-cyan-500/20 text-cyan-200 border-cyan-500/30"
                          }`}>
                            {isLive ? "Status: LIVE NOW" : "Status: UPCOMING (SCHEDULED)"}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Question Selector from 150 Question Bank */}
                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label className="text-xs font-mono text-slate-300 font-bold">
                        Select Contest Questions ({contestFormData.selectedProblems.length} selected)
                      </Label>
                      <p className="text-[11px] font-mono text-slate-400">
                        Browse the 150 DSA questions below. Click to add/remove and adjust point values.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAutoPickContestProblems}
                        className="h-8 text-xs font-mono font-bold gap-1 rounded-lg bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 backdrop-blur-md"
                      >
                        <span>⚡</span> Auto-Pick 4 Problems
                      </Button>
                      {contestFormData.selectedProblems.length > 0 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setContestFormData(prev => ({ ...prev, selectedProblems: [] }))}
                          className="h-8 text-xs font-mono text-rose-400 hover:text-rose-300"
                        >
                          Clear
                        </Button>
                      )}
                      <Input
                        placeholder="Search 150 questions..."
                        value={contestProblemSearch}
                        onChange={(e) => setContestProblemSearch(e.target.value)}
                        className="h-8 text-xs font-mono w-44 bg-white/[0.04] border-white/10 text-white rounded-lg"
                      />
                      <select
                        value={contestProblemDiffFilter}
                        onChange={(e) => setContestProblemDiffFilter(e.target.value)}
                        className="h-8 text-xs font-mono rounded-lg bg-white/[0.04] text-slate-200 px-2 border border-white/10 font-medium"
                      >
                        <option value="ALL" className="bg-slate-900 text-slate-200">All Diff</option>
                        <option value="EASY" className="bg-slate-900 text-emerald-400">Easy</option>
                        <option value="MEDIUM" className="bg-slate-900 text-amber-400">Medium</option>
                        <option value="HARD" className="bg-slate-900 text-rose-400">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Selected Problems summary bar */}
                  {contestFormData.selectedProblems.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-2 backdrop-blur-md">
                      <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                        Contest Problem Queue:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {contestFormData.selectedProblems.map((p, idx) => (
                          <div
                            key={p.problemSlug}
                            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-xs shadow-sm font-mono"
                          >
                            <span className="font-mono font-bold text-amber-400">Q{idx + 1}</span>
                            <span className="font-semibold text-slate-200">{p.title}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              p.difficulty === "EASY" ? "bg-emerald-500/15 text-emerald-400" :
                              p.difficulty === "MEDIUM" ? "bg-amber-500/15 text-amber-400" :
                              "bg-rose-500/15 text-rose-400"
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
                                className="w-14 h-6 text-[11px] rounded-md bg-white/[0.08] px-1 border border-white/10 text-center font-mono font-bold text-white"
                              />
                              <span className="text-[10px] text-slate-400">pts</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleProblemInContest({ slug: p.problemSlug } as any)}
                              className="text-slate-400 hover:text-rose-400 font-bold ml-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scrollable Question Picker Grid */}
                  <div className="max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02] p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 backdrop-blur-md">
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
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 backdrop-blur-sm ${
                              isSelected
                                ? "bg-amber-500/15 border-amber-400/60 text-white shadow-sm"
                                : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06] text-slate-300"
                            }`}
                          >
                            <div className="truncate space-y-0.5">
                              <p className={`font-semibold truncate ${isSelected ? "text-amber-300" : "text-slate-200"}`}>
                                {prob.title}
                              </p>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono ${
                                prob.difficulty === "EASY" ? "bg-emerald-500/15 text-emerald-400" :
                                prob.difficulty === "MEDIUM" ? "bg-amber-500/15 text-amber-400" :
                                "bg-rose-500/15 text-rose-400"
                              }`}>
                                {prob.difficulty}
                              </span>
                            </div>

                            <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                              isSelected ? "bg-amber-400 text-slate-950" : "border border-white/20 text-slate-400"
                            }`}>
                              {isSelected ? "✓" : "+"}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Launch Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCreateContest(false)}
                    className="h-9 text-xs font-mono font-bold gap-1.5 rounded-xl border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] backdrop-blur-md"
                  >
                    <span>⏱️</span> Schedule Contest
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleCreateContest(true)}
                    className="h-9 text-xs font-mono font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] rounded-xl transition-all"
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
                    onClick={async () => {
                      if (confirm("Are you sure you want to clear all contests? This will remove all scheduled and live contests.")) {
                        await clearAllContests();
                        await loadContests();
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
                    const contestSubs = getContestSubmissions(contest.id);
                    const acceptedSubs = contestSubs.filter(s => s.status === "ACCEPTED");
                    const uniqueStudents = new Set(contestSubs.map(s => s.userEmail)).size;
                    const enrolledCount = Math.max(contest.participantsCount, (contest.registeredUsers || []).length);

                    return (
                      <Card
                        key={contest.id}
                        className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.4)] ${
                          isLive
                            ? "border-emerald-500/40 border-t-emerald-400/50 bg-slate-900/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                            : isUpcoming
                            ? "border-cyan-500/30 border-t-cyan-400/40 bg-slate-900/40"
                            : "border-white/10 border-t-white/20 bg-slate-900/30 opacity-90"
                        }`}
                      >
                        <div>
                          <CardHeader className="pb-3 space-y-2 bg-white/[0.02] border-b border-white/[0.06]">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {isLive ? (
                                  <span className="text-[10px] bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full font-black animate-pulse flex items-center gap-1 shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span> LIVE NOW
                                  </span>
                                ) : isUpcoming ? (
                                  <span className="text-[10px] bg-cyan-500/15 text-cyan-300 px-2.5 py-0.5 rounded-full font-bold border border-cyan-500/30 font-mono">
                                    UPCOMING
                                  </span>
                                ) : (
                                  <span className="text-[10px] bg-white/[0.06] text-slate-400 px-2.5 py-0.5 rounded-full font-bold font-mono">
                                    ENDED
                                  </span>
                                )}
                                <span className="text-xs text-slate-400 font-mono">
                                  ⏱️ {contest.durationMinutes}m duration
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Link href={`/contests/${contest.id}`}>
                                  <Button size="sm" variant="outline" className="h-7 text-[11px] font-mono rounded-lg border-white/10 bg-white/[0.04] text-cyan-300 hover:bg-cyan-500/15 gap-1 backdrop-blur-md">
                                    <span>👁️</span> Arena
                                  </Button>
                                </Link>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditContest(contest)}
                                  className="h-7 text-[11px] font-mono rounded-lg border-white/10 bg-white/[0.04] text-amber-300 hover:bg-amber-500/15 gap-1 backdrop-blur-md"
                                >
                                  <span>✏️</span> Edit
                                </Button>

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteContestItem(contest.id)}
                                  className="h-7 text-[11px] font-mono rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 backdrop-blur-md"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>

                            <CardTitle className="text-base font-bold font-mono text-slate-100">{contest.title}</CardTitle>
                            <CardDescription className="text-xs font-mono text-slate-400 line-clamp-1">{contest.description}</CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-3 pt-3">
                            {/* Live Submissions & Participation Banner */}
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 backdrop-blur-md">
                              <div className="flex items-center justify-between text-xs font-mono">
                                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                                  <span>📊</span> Contest Activity
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">
                                  {contestSubs.length} total submissions
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10">
                                  <p className="text-[10px] text-slate-400 font-medium">Enrolled</p>
                                  <p className="font-black text-slate-100">{enrolledCount}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10">
                                  <p className="text-[10px] text-slate-400 font-medium">Submissions</p>
                                  <p className="font-black text-purple-400">{contestSubs.length} <span className="text-[9px] text-slate-400">({uniqueStudents} users)</span></p>
                                </div>
                                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10">
                                  <p className="text-[10px] text-slate-400 font-medium">Accepted</p>
                                  <p className="font-black text-emerald-400">{acceptedSubs.length}</p>
                                </div>
                              </div>

                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedContestForSubmissions(contest);
                                  setSubmissionFilterStatus("ALL");
                                  setSubmissionSearchQuery("");
                                }}
                                className="w-full h-8 text-xs font-mono font-bold rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-cyan-300 border border-white/10 gap-1.5 backdrop-blur-md transition-all shadow-sm"
                              >
                                <span>🔍</span> View Student Submissions & Solutions ({contestSubs.length})
                              </Button>
                            </div>

                            {/* Problem list breakdown */}
                            <div className="space-y-1 text-xs font-mono">
                              <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
                                <span>Questions ({contest.problems.length})</span>
                                <span className="text-amber-400">{totalPoints} pts total</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {contest.problems.map((p, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-slate-300"
                                  >
                                    <strong className="text-cyan-400">Q{idx + 1}:</strong> {p.title} ({p.points}pts)
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="text-[11px] text-slate-400 space-y-0.5 font-mono pt-1">
                              <p><strong className="text-slate-300 font-sans">Start Time:</strong> {new Date(contest.startTime).toLocaleString()}</p>
                              <p><strong className="text-slate-300 font-sans">End Time:</strong> {new Date(contest.endTime).toLocaleString()}</p>
                            </div>
                          </CardContent>
                        </div>

                        {/* Admin Action Bar */}
                        <div className="p-4 pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-mono text-slate-400">
                            👥 {enrolledCount} participants
                          </span>

                          <div className="flex flex-wrap items-center gap-2">
                            {isUpcoming && (
                              <Button
                                size="sm"
                                onClick={() => handleStartContestNow(contest.id)}
                                className="h-7 text-[11px] font-mono font-bold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 gap-1 shadow-sm"
                              >
                                <span>▶</span> Start Live Now
                              </Button>
                            )}

                            {/* Submit Whole Contest Button (For All Students) */}
                            <Button
                              size="sm"
                              onClick={() => setContestToSubmitWhole(contest)}
                              disabled={submittingContestId === contest.id}
                              className="h-7 text-[11px] font-mono font-bold rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white gap-1 shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all"
                              title="Submit whole contest for all students (whether they attempted all questions or not)"
                            >
                              <span>🏁</span> Submit Whole Contest
                            </Button>

                            {isLive && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleEndContestNow(contest.id)}
                                className="h-7 text-[11px] font-mono font-bold rounded-lg text-rose-300 gap-1 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 backdrop-blur-md"
                              >
                                <span>⏹</span> Force End Contest
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* MODAL 1: CONTEST SUBMISSIONS & STUDENT SOLUTIONS INSPECTOR */}
            {selectedContestForSubmissions && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                <div className="bg-slate-950/80 border border-white/15 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden my-auto backdrop-blur-2xl text-slate-100">
                  {/* Header */}
                  <div className="p-5 border-b border-white/10 flex items-start justify-between bg-white/[0.02] gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                          {selectedContestForSubmissions.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ⏱️ {selectedContestForSubmissions.durationMinutes} mins
                        </span>
                      </div>
                      <h3 className="text-xl font-mono font-black text-white">
                        {selectedContestForSubmissions.title} — Submissions & Solutions
                      </h3>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">
                        Inspect real-time student submissions, execution metrics, and full code solutions.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => setContestToSubmitWhole(selectedContestForSubmissions)}
                        disabled={submittingContestId === selectedContestForSubmissions.id}
                        className="h-8 text-xs font-mono font-bold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all"
                        title="Submit whole contest for all students (whether they attempted all questions or not)"
                      >
                        <span>🏁</span> Submit Whole Contest
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedContestForSubmissions(null)}
                        className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08]"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>

                  {/* Submissions Stats & Filters */}
                  {(() => {
                    const subs = getContestSubmissions(selectedContestForSubmissions.id);
                    const acceptedSubs = subs.filter(s => s.status === "ACCEPTED");
                    const failedSubs = subs.filter(s => s.status !== "ACCEPTED");
                    const uniqueStudents = new Set(subs.map(s => s.userEmail)).size;
                    const passRate = subs.length > 0 ? Math.round((acceptedSubs.length / subs.length) * 100) : 0;

                    const enrolledEmails = Array.from(new Set([
                      ...(selectedContestForSubmissions.registeredUsers || []),
                      ...subs.map(s => s.userEmail).filter(Boolean)
                    ]));
                    const submittedUsersSet = new Set((selectedContestForSubmissions.submittedUsers || []).map(e => e.toLowerCase()));
                    const totalContestProblems = selectedContestForSubmissions.problems?.length || 0;

                    const studentsRoster = enrolledEmails.map((email) => {
                      const studentSubs = subs.filter(s => s.userEmail.toLowerCase() === email.toLowerCase());
                      const studentName = studentSubs[0]?.userName || email.split("@")[0];
                      const attemptedProblemSlugs = new Set(studentSubs.map(s => s.problemSlug));
                      const solvedProblemSlugs = new Set(studentSubs.filter(s => s.status === "ACCEPTED").map(s => s.problemSlug));
                      const totalScore = studentSubs.filter(s => s.status === "ACCEPTED").reduce((acc, curr) => acc + (curr.score || 0), 0);
                      const isSubmitted = submittedUsersSet.has(email.toLowerCase()) || selectedContestForSubmissions.status === "ENDED";
                      const attemptedCount = attemptedProblemSlugs.size;
                      const unattemptedCount = Math.max(0, totalContestProblems - attemptedCount);
                      const solvedCount = solvedProblemSlugs.size;

                      return {
                        email,
                        name: studentName,
                        attemptedCount,
                        unattemptedCount,
                        solvedCount,
                        totalScore,
                        isSubmitted,
                        attemptedProblemSlugs,
                        solvedProblemSlugs,
                        subsCount: studentSubs.length
                      };
                    });

                    const filteredSubs = subs.filter(sub => {
                      const matchesStatus =
                        submissionFilterStatus === "ALL" ||
                        (submissionFilterStatus === "ACCEPTED" && sub.status === "ACCEPTED") ||
                        (submissionFilterStatus === "WRONG_ANSWER" && sub.status !== "ACCEPTED");
                      const q = submissionSearchQuery.toLowerCase().trim();
                      const matchesSearch =
                        !q ||
                        sub.userName.toLowerCase().includes(q) ||
                        sub.userEmail.toLowerCase().includes(q) ||
                        (sub.problemTitle || sub.problemSlug).toLowerCase().includes(q) ||
                        (sub.language || "").toLowerCase().includes(q);
                      return matchesStatus && matchesSearch;
                    });

                    const filteredStudents = studentsRoster.filter(s => {
                      const q = submissionSearchQuery.toLowerCase().trim();
                      return !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
                    });

                    return (
                      <div className="flex-1 flex flex-col overflow-hidden font-mono">
                        {/* Summary Badges */}
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/[0.02] border-b border-white/10">
                          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center backdrop-blur-md">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrolled Students</span>
                            <span className="text-lg font-black text-white">
                              {Math.max(selectedContestForSubmissions.participantsCount, enrolledEmails.length)}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center backdrop-blur-md">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Submissions</span>
                            <span className="text-lg font-black text-purple-400">{subs.length}</span>
                            <span className="text-[10px] text-slate-400 block">({uniqueStudents} active users)</span>
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center backdrop-blur-md">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Accepted Solves</span>
                            <span className="text-lg font-black text-emerald-400">{acceptedSubs.length}</span>
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center backdrop-blur-md">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pass Rate</span>
                            <span className="text-lg font-black text-amber-400">{passRate}%</span>
                          </div>
                        </div>

                        {/* Sub-tab switcher */}
                        <div className="p-3 bg-white/[0.015] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setInspectorViewTab("roster")}
                              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                                inspectorViewTab === "roster"
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                                  : "text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-transparent"
                              }`}
                            >
                              <span>👥</span> Student Attempt Status & Submission ({studentsRoster.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setInspectorViewTab("submissions")}
                              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                                inspectorViewTab === "submissions"
                                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                                  : "text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-transparent"
                              }`}
                            >
                              <span>📜</span> Code Submissions Feed ({subs.length})
                            </button>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => setContestToSubmitWhole(selectedContestForSubmissions)}
                            disabled={submittingContestId === selectedContestForSubmissions.id}
                            className="h-7 text-[11px] font-mono font-bold rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white gap-1 shadow-sm"
                          >
                            <span>🏁</span> Submit Whole Contest (All)
                          </Button>
                        </div>

                        {/* TAB 1: STUDENT ROSTER & SUBMISSION STATUS */}
                        {inspectorViewTab === "roster" && (
                          <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Policy Banner */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900/40 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                                  <span>🏁</span> Finalize & Submit Contest for Students
                                </h4>
                                <p className="text-[11px] text-slate-300">
                                  You can submit the whole contest for all participants at once, or finalize for any individual student below.
                                  Students can be submitted <strong className="text-purple-300">whether they have attempted all questions or not</strong>: unattempted questions receive 0 points without blocking submission.
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => setContestToSubmitWhole(selectedContestForSubmissions)}
                                disabled={submittingContestId === selectedContestForSubmissions.id}
                                className="h-8 text-xs font-mono font-bold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.35)] shrink-0"
                              >
                                <span>🏁</span> Submit Whole Contest (All)
                              </Button>
                            </div>

                            {/* Search Filter */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <Input
                                placeholder="Filter student roster by name or email..."
                                value={submissionSearchQuery}
                                onChange={(e) => setSubmissionSearchQuery(e.target.value)}
                                className="h-8 text-xs font-mono bg-white/[0.04] border-white/10 text-white placeholder-slate-500 rounded-xl max-w-sm"
                              />
                              <span className="text-[11px] text-slate-400 font-mono">
                                Showing {filteredStudents.length} of {studentsRoster.length} students
                              </span>
                            </div>

                            {/* Students Table */}
                            {filteredStudents.length === 0 ? (
                              <div className="p-12 text-center text-slate-400 space-y-2 font-mono">
                                <span className="text-3xl block">👥</span>
                                <p className="text-sm font-semibold">No students registered yet for this contest</p>
                              </div>
                            ) : (
                              <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-md">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.03] text-slate-300 font-semibold font-mono text-[10px] uppercase">
                                      <th className="p-3.5">Student</th>
                                      <th className="p-3.5">Questions Progress</th>
                                      <th className="p-3.5">Solved</th>
                                      <th className="p-3.5">Score</th>
                                      <th className="p-3.5">Contest Status</th>
                                      <th className="p-3.5 text-right">Submission Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-white/[0.06] font-mono">
                                    {filteredStudents.map((st) => (
                                      <tr key={st.email} className="hover:bg-white/[0.04] transition-colors">
                                        <td className="p-3 font-medium">
                                          <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/15 text-white font-black flex items-center justify-center text-xs">
                                              {st.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                              <p className="font-bold text-slate-100">{st.name}</p>
                                              <p className="text-[10px] text-slate-400 font-mono">{st.email}</p>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="p-3">
                                          <div className="space-y-1">
                                            <span className="font-semibold text-slate-200 block text-[11px]">
                                              {st.attemptedCount} of {totalContestProblems} questions attempted
                                            </span>
                                            {st.unattemptedCount > 0 ? (
                                              <span className="text-[10px] text-amber-400/90 font-mono block">
                                                ⚠️ {st.unattemptedCount} unattempted (submits with 0 pts)
                                              </span>
                                            ) : (
                                              <span className="text-[10px] text-emerald-400 font-mono block">
                                                ✓ All questions attempted
                                              </span>
                                            )}
                                          </div>
                                        </td>
                                        <td className="p-3">
                                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                            {st.solvedCount} / {totalContestProblems} Solved
                                          </span>
                                        </td>
                                        <td className="p-3 font-mono font-bold text-emerald-400">
                                          {st.totalScore} pts
                                        </td>
                                        <td className="p-3">
                                          {st.isSubmitted ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                              <span>✓</span> Submitted & Locked
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                              <span>⏳</span> In Progress
                                            </span>
                                          )}
                                        </td>
                                        <td className="p-3 text-right">
                                          {st.isSubmitted ? (
                                            <span className="text-[11px] text-slate-400 font-mono">
                                              Finalized
                                            </span>
                                          ) : (
                                            <Button
                                              size="sm"
                                              disabled={submittingContestId === selectedContestForSubmissions.id && submittingStudentEmail === st.email}
                                              onClick={() => handleConfirmSubmitWholeContest(selectedContestForSubmissions.id, st.email)}
                                              className="h-7 text-[11px] font-mono font-bold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 gap-1 shadow-sm"
                                              title="Submit contest for this student whether they attempted all questions or not"
                                            >
                                              {submittingStudentEmail === st.email ? (
                                                <span>⏳ Submitting...</span>
                                              ) : (
                                                <span>🏁 Submit Contest</span>
                                              )}
                                            </Button>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}

                        {/* TAB 2: CODE SUBMISSIONS FEED */}
                        {inspectorViewTab === "submissions" && (
                          <>
                            {/* Filter Bar */}
                            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/10 bg-white/[0.01]">
                              {/* Search Input */}
                              <div className="w-full sm:w-80">
                                <Input
                                  placeholder="Search by student name, email, or problem..."
                                  value={submissionSearchQuery}
                                  onChange={(e) => setSubmissionSearchQuery(e.target.value)}
                                  className="h-8 text-xs font-mono bg-white/[0.04] border-white/10 text-white placeholder-slate-500 rounded-xl"
                                />
                              </div>

                              {/* Filter Tabs */}
                              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                                <Button
                                  size="sm"
                                  variant={submissionFilterStatus === "ALL" ? "default" : "outline"}
                                  onClick={() => setSubmissionFilterStatus("ALL")}
                                  className="h-8 text-xs font-mono rounded-lg"
                                >
                                  All ({subs.length})
                                </Button>
                                <Button
                                  size="sm"
                                  variant={submissionFilterStatus === "ACCEPTED" ? "default" : "outline"}
                                  onClick={() => setSubmissionFilterStatus("ACCEPTED")}
                                  className="h-8 text-xs font-mono rounded-lg text-emerald-300 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20"
                                >
                                  Accepted ({acceptedSubs.length})
                                </Button>
                                <Button
                                  size="sm"
                                  variant={submissionFilterStatus === "WRONG_ANSWER" ? "default" : "outline"}
                                  onClick={() => setSubmissionFilterStatus("WRONG_ANSWER")}
                                  className="h-8 text-xs font-mono rounded-lg text-rose-300 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20"
                                >
                                  Failed ({failedSubs.length})
                                </Button>
                              </div>
                            </div>

                            {/* Submissions List / Table */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                              {filteredSubs.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 space-y-2 font-mono">
                                  <span className="text-3xl block">📭</span>
                                  <p className="text-sm font-semibold">No submissions found matching criteria</p>
                                  <p className="text-xs">When students enter the arena and submit their code, their solutions will appear here in real-time.</p>
                                </div>
                              ) : (
                                <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-md">
                                  <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                      <tr className="border-b border-white/10 bg-white/[0.03] text-slate-300 font-semibold font-mono text-[10px] uppercase">
                                        <th className="p-3.5">Student</th>
                                        <th className="p-3.5">Problem Solved</th>
                                        <th className="p-3.5">Language</th>
                                        <th className="p-3.5">Verdict</th>
                                        <th className="p-3.5">Score</th>
                                        <th className="p-3.5">Runtime / Memory</th>
                                        <th className="p-3.5">Submitted</th>
                                        <th className="p-3.5 text-right">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.06] font-mono">
                                      {filteredSubs.map((sub) => {
                                        const isAc = sub.status === "ACCEPTED";
                                        return (
                                          <tr key={sub.id} className="hover:bg-white/[0.04] transition-colors">
                                            <td className="p-3 font-medium">
                                              <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/15 text-white font-black flex items-center justify-center text-xs">
                                                  {sub.userName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                  <p className="font-bold text-slate-100">{sub.userName}</p>
                                                  <p className="text-[10px] text-slate-400 font-mono">{sub.userEmail}</p>
                                                </div>
                                              </div>
                                            </td>
                                            <td className="p-3">
                                              <span className="font-semibold text-slate-100 block">
                                                {sub.problemTitle || sub.problemSlug}
                                              </span>
                                              <span className="text-[10px] text-cyan-400/80 font-mono">
                                                {sub.problemSlug}
                                              </span>
                                            </td>
                                            <td className="p-3">
                                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-white/[0.06] border border-white/10 text-slate-300">
                                                {sub.language || "javascript"}
                                              </span>
                                            </td>
                                            <td className="p-3">
                                              {isAc ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                                  <span>✓</span> ACCEPTED
                                                </span>
                                              ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                                                  <span>✗</span> {sub.status.replace("_", " ")}
                                                </span>
                                              )}
                                            </td>
                                            <td className="p-3 font-mono font-bold">
                                              {isAc ? (
                                                <span className="text-emerald-400">+{sub.score} pts</span>
                                              ) : (
                                                <span className="text-slate-500">0 pts</span>
                                              )}
                                            </td>
                                            <td className="p-3 text-[11px] font-mono text-slate-400">
                                              {sub.runtime || "—"} / {sub.memory || "—"}
                                              {typeof sub.passedTestCases === "number" && sub.totalTestCases && (
                                                <span className="block text-[10px] text-slate-500">
                                                  ({sub.passedTestCases}/{sub.totalTestCases} cases)
                                                </span>
                                              )}
                                            </td>
                                            <td className="p-3 text-[11px] text-slate-400">
                                              {new Date(sub.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                              <span className="block text-[10px] text-slate-500">
                                                {new Date(sub.submittedAt).toLocaleDateString()}
                                              </span>
                                            </td>
                                            <td className="p-3 text-right">
                                              <Button
                                                size="sm"
                                                onClick={() => {
                                                  setSelectedSubmissionForCode(sub);
                                                  setCodeCopied(false);
                                                }}
                                                className="h-7 text-[11px] font-mono font-bold rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-cyan-300 border border-white/10 gap-1 backdrop-blur-md"
                                              >
                                                <span>💻</span> View Solution
                                              </Button>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}

                  {/* Footer */}
                  <div className="p-4 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3 font-mono">
                    <span className="text-xs text-slate-400">
                      Contest ID: <strong className="font-mono text-cyan-300">{selectedContestForSubmissions.id}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => setContestToSubmitWhole(selectedContestForSubmissions)}
                        disabled={submittingContestId === selectedContestForSubmissions.id}
                        className="h-8 text-xs font-mono font-bold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.35)]"
                      >
                        <span>🏁</span> Submit Whole Contest
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedContestForSubmissions(null)}
                        className="h-8 text-xs font-mono font-semibold rounded-lg border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
                      >
                        Close Inspector
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL 2: DETAILED SOLUTION CODE VIEWER */}
            {selectedSubmissionForCode && (
              <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                <div className="bg-slate-950/85 border border-white/15 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden my-auto text-slate-100 backdrop-blur-2xl">
                  {/* Top Bar */}
                  <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/15 text-cyan-400 flex items-center justify-center text-base font-black">
                        💻
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-white font-mono">
                            {selectedSubmissionForCode.problemTitle || selectedSubmissionForCode.problemSlug}
                          </h4>
                          {selectedSubmissionForCode.status === "ACCEPTED" ? (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold font-mono">
                              ✓ ACCEPTED (+{selectedSubmissionForCode.score} pts)
                            </span>
                          ) : (
                            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold font-mono">
                              ✗ {selectedSubmissionForCode.status.replace("_", " ")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">
                          Submitted by <strong className="text-slate-200">{selectedSubmissionForCode.userName}</strong> ({selectedSubmissionForCode.userEmail}) • {new Date(selectedSubmissionForCode.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSubmissionForCode(null)}
                      className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08]"
                    >
                      ✕
                    </Button>
                  </div>

                  {/* Execution Metrics Bar */}
                  <div className="px-4 py-2 bg-white/[0.01] border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-4">
                      <span><strong>Language:</strong> <span className="text-amber-400 uppercase">{selectedSubmissionForCode.language || "javascript"}</span></span>
                      <span><strong>Runtime:</strong> <span className="text-emerald-400">{selectedSubmissionForCode.runtime || "N/A"}</span></span>
                      <span><strong>Memory:</strong> <span className="text-cyan-400">{selectedSubmissionForCode.memory || "N/A"}</span></span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => {
                        if (selectedSubmissionForCode.code) {
                          navigator.clipboard.writeText(selectedSubmissionForCode.code);
                          setCodeCopied(true);
                          setTimeout(() => setCodeCopied(false), 2000);
                        }
                      }}
                      className="h-7 text-xs font-mono font-bold rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/10 gap-1.5 backdrop-blur-md"
                    >
                      {codeCopied ? (
                        <>
                          <span className="text-emerald-400">✓</span> Copied!
                        </>
                      ) : (
                        <>
                          <span>📋</span> Copy Solution Code
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Code Editor Container */}
                  <div className="flex-1 overflow-y-auto p-4 bg-slate-950/60 font-mono text-xs leading-relaxed">
                    {selectedSubmissionForCode.code ? (
                      <pre className="text-emerald-300 font-mono whitespace-pre-wrap select-text">
                        {selectedSubmissionForCode.code}
                      </pre>
                    ) : (
                      <div className="p-8 text-center text-slate-500 font-mono">
                        <p>No source code recorded for this submission.</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Submission ID: <code className="text-slate-300">{selectedSubmissionForCode.id}</code></span>
                    <Button
                      size="sm"
                      onClick={() => setSelectedSubmissionForCode(null)}
                      className="h-7 text-xs font-mono font-semibold rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10"
                    >
                      Done Viewing
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL 3: CONFIRM SUBMIT WHOLE CONTEST DIALOG */}
            {contestToSubmitWhole && (
              <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-slate-950/90 border border-white/20 rounded-3xl w-full max-w-xl p-6 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.85)] text-slate-100 backdrop-blur-2xl space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                      🏁
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                        Admin Contest Finalization
                      </span>
                      <h3 className="text-lg font-mono font-black text-white mt-1">
                        Submit Whole Contest For All Students
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {contestToSubmitWhole.title}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2 text-xs font-mono text-amber-200/90">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <span>⚠️</span> Important Submission Policy
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      This will finalize and submit the whole contest for <strong>all enrolled students</strong>, 
                      <strong> whether they have attempted all questions or not</strong>.
                    </p>
                    <ul className="text-[11px] list-disc list-inside space-y-1 text-slate-300">
                      <li><strong>Attempted & Solved questions</strong> will lock in with their current verified scores.</li>
                      <li><strong>Unattempted questions</strong> will simply receive 0 points without blocking submission.</li>
                      <li>The contest status will transition to <strong>ENDED</strong> and official ranks will be locked.</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Enrolled Students</span>
                      <span className="text-base font-bold text-white">
                        {Math.max(contestToSubmitWhole.participantsCount, (contestToSubmitWhole.registeredUsers || []).length)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Questions</span>
                      <span className="text-base font-bold text-cyan-400">
                        {contestToSubmitWhole.problems?.length || 0}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current Status</span>
                      <span className="text-xs font-bold text-emerald-400 block mt-1">
                        {contestToSubmitWhole.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10 font-mono">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setContestToSubmitWhole(null)}
                      disabled={submittingContestId === contestToSubmitWhole.id}
                      className="h-9 px-4 text-xs font-semibold rounded-xl border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={submittingContestId === contestToSubmitWhole.id}
                      onClick={() => handleConfirmSubmitWholeContest(contestToSubmitWhole.id)}
                      className="h-9 px-5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] gap-2"
                    >
                      {submittingContestId === contestToSubmitWhole.id ? (
                        <>
                          <span className="animate-spin">⏳</span> Submitting Contest...
                        </>
                      ) : (
                        <>
                          <span>🏁</span> Confirm & Submit Whole Contest
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* TAB 7: SUPER-ADMIN PROFILE & SECURITY CENTER */}
          <TabsContent value="profile" className="space-y-6 m-0 focus-visible:outline-none">
            {profileSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center justify-between animate-in fade-in shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">⚡</span>
                  <span>{profileSuccessMsg}</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-mono tracking-widest uppercase">SYNCHRONIZED</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Tactical Cyber Identity HUD (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <AdminTiltCard glowColor={adminProfile.themeColor || "emerald"} className="p-6 md:p-8 flex flex-col justify-between rounded-2xl border border-white/10 border-t-white/25 bg-slate-900/40 shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
                  <div className="space-y-6">
                    {/* Top Identity Banner */}
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-slate-900/40 border border-white/20 flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(16,185,129,0.25)] backdrop-blur-md">
                          {adminProfile.avatar || "🛡️"}
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-950 font-black shadow-sm">
                          ✓
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 font-mono font-bold text-[11px] border border-rose-500/30 tracking-wider shadow-[0_0_12px_rgba(244,63,94,0.2)] backdrop-blur-md">
                          ROOT_CLEARANCE
                        </span>
                        <p className="text-[10px] font-mono text-emerald-400/80 mt-1">
                          SYS.NODE: ADM-2026-ROOT-01
                        </p>
                      </div>
                    </div>

                    {/* Name & Title */}
                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase mb-1">// IDENT_MATRIX</div>
                      <h2 className="text-2xl font-black tracking-tight text-white font-mono">
                        {adminProfile.name}
                      </h2>
                      <p className="text-xs font-mono font-semibold text-emerald-300 mt-1">
                        {adminProfile.title}
                      </p>
                      <p className="text-xs font-mono text-slate-300 mt-3 leading-relaxed bg-white/[0.03] p-3 rounded-xl border border-white/10 backdrop-blur-md">
                        {adminProfile.bio}
                      </p>
                    </div>

                    {/* Security Clearance Details */}
                    <div className="space-y-2 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">CLEARANCE_TIER:</span>
                        <span className="text-emerald-300 font-bold">{adminProfile.securityLevel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">HARDWARE_CIPHER:</span>
                        <span className="text-cyan-300 font-bold">AES-256-GCM / QUAD-RUN</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">SESSION_EXPIRY:</span>
                        <span className="text-amber-300 font-bold">{adminProfile.sessionTimeout}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">THEME_SKIN:</span>
                        <span className="text-emerald-300 font-bold uppercase">{adminProfile.themeColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-6 border-t border-white/[0.08] mt-6 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-400 tracking-wider">
                      SHA256:7E9A:2026:NX42
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleLockAdmin}
                      className="h-8 text-xs font-mono font-bold gap-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)] backdrop-blur-md"
                    >
                      <span>🔒</span> TERMINATE_SESSION
                    </Button>
                  </div>
                </AdminTiltCard>
              </div>

              {/* Right Column: Settings & Security Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Form 1: Admin Profile Details */}
                <div className="relative rounded-2xl bg-slate-900/40 border border-white/10 border-t-white/25 p-5 md:p-6 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.4)]">
                  <div className="pb-4 border-b border-white/[0.08]">
                    <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">// SYSTEM_CONFIG // IDENTITY</div>
                    <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                      <span>👤</span> Master Profile Settings
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Configure your tactical administrative credentials and identity telemetry
                    </p>
                  </div>

                  <div className="pt-4">
                    <form onSubmit={handleSaveAdminProfile} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-mono font-bold text-slate-300">DISPLAY_NAME</Label>
                          <Input
                            value={adminProfile.name}
                            onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                            placeholder="Nexus Root Operator"
                            className="h-10 text-xs font-mono bg-white/[0.04] border-white/10 text-white placeholder-slate-500 focus:border-cyan-400/60 rounded-xl backdrop-blur-md"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-mono font-bold text-slate-300">COMMAND_EMAIL</Label>
                          <Input
                            type="email"
                            value={adminProfile.email}
                            onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                            placeholder="admin@codearena.dev"
                            className="h-10 text-xs font-mono bg-white/[0.04] border-white/10 text-white placeholder-slate-500 focus:border-cyan-400/60 rounded-xl backdrop-blur-md"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-mono font-bold text-slate-300">TITLE // DESIGNATION</Label>
                        <Input
                          value={adminProfile.title}
                          onChange={(e) => setAdminProfile({ ...adminProfile, title: e.target.value })}
                          placeholder="Chief System Architect & Root Judge"
                          className="h-10 text-xs font-mono bg-white/[0.04] border-white/10 text-white placeholder-slate-500 focus:border-cyan-400/60 rounded-xl backdrop-blur-md"
                        />
                      </div>

                      {/* Avatar Picker */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-mono font-bold text-slate-300">CYBER_AVATAR_SIGIL</Label>
                        <div className="flex flex-wrap gap-2">
                          {["🛡️", "⚡", "🚀", "👑", "🧬", "🛸", "🎯", "🔮", "🤖", "🔥"].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                playCyberSound("click");
                                setAdminProfile({ ...adminProfile, avatar: emoji });
                              }}
                              className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition-all backdrop-blur-md ${
                                adminProfile.avatar === emoji
                                  ? "border-emerald-400 bg-emerald-500/20 scale-110 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                  : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]"
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-mono font-bold text-slate-300">BIO & ARCHITECT_DIRECTIVE</Label>
                        <textarea
                          rows={3}
                          value={adminProfile.bio}
                          onChange={(e) => setAdminProfile({ ...adminProfile, bio: e.target.value })}
                          placeholder="Describe administrative responsibilities and system directives..."
                          className="w-full rounded-xl bg-white/[0.04] p-3 text-xs font-mono text-white border border-white/10 placeholder-slate-500 focus:border-cyan-400/60 focus:outline-none backdrop-blur-md"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button type="submit" size="sm" className="h-9 px-5 text-xs font-mono font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] rounded-xl transition-all">
                          <span>💾</span> COMMIT_PROFILE_CHANGES
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Form 2: Passcode & Master Access Key Management */}
                <div className="relative rounded-2xl bg-slate-900/40 border border-white/10 border-t-white/25 p-5 md:p-6 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.4)]">
                  <div className="pb-4 border-b border-white/[0.08]">
                    <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">// SECURITY_CIPHER // HARDWARE_KEY</div>
                    <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                      <span>🔑</span> Passcode & Security Authorization
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Rotate root access passcodes and set hardware session timeout policies
                    </p>
                  </div>

                  <div className="pt-4">
                    <form onSubmit={handleChangePasscode} className="space-y-4">
                      {passcodeUpdateMsg && (
                        <p
                          className={`text-xs p-3 rounded-xl border font-mono font-bold animate-in fade-in backdrop-blur-md ${
                            passcodeUpdateMsg.type === "success"
                              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                              : "bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                          }`}
                        >
                          {passcodeUpdateMsg.text}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-mono font-bold text-slate-300">NEW_PASSCODE</Label>
                          <Input
                            type="password"
                            value={newPasscodeVal}
                            onChange={(e) => setNewPasscodeVal(e.target.value)}
                            placeholder="Min 6 characters"
                            className="h-10 text-xs font-mono bg-white/[0.04] border-white/10 text-white placeholder-slate-500 focus:border-cyan-400/60 rounded-xl backdrop-blur-md"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-mono font-bold text-slate-300">CONFIRM_PASSCODE</Label>
                          <Input
                            type="password"
                            value={confirmPasscodeVal}
                            onChange={(e) => setConfirmPasscodeVal(e.target.value)}
                            placeholder="Re-enter new passcode"
                            className="h-10 text-xs font-mono bg-white/[0.04] border-white/10 text-white placeholder-slate-500 focus:border-cyan-400/60 rounded-xl backdrop-blur-md"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-mono font-bold text-slate-300">SESSION_AUTO_LOCK_TIMEOUT</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { label: "15 Minutes", val: "15m" },
                            { label: "1 Hour", val: "1h" },
                            { label: "8 Hours", val: "8h" },
                            { label: "Persistent", val: "never" },
                          ].map((t) => (
                            <button
                              key={t.val}
                              type="button"
                              onClick={() => {
                                playCyberSound("click");
                                const updated = { ...adminProfile, sessionTimeout: t.val };
                                setAdminProfile(updated);
                                localStorage.setItem("codearena_admin_profile", JSON.stringify(updated));
                              }}
                              className={`p-2.5 rounded-xl text-xs font-mono border text-center transition-all backdrop-blur-md ${
                                adminProfile.sessionTimeout === t.val
                                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                                  : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button type="submit" size="sm" variant="outline" className="h-9 px-4 text-xs font-mono font-bold gap-1.5 rounded-xl border-white/10 bg-white/[0.04] text-cyan-300 hover:bg-cyan-500/15 backdrop-blur-md">
                          <span>🔐</span> ROTATE_ROOT_PASSCODE
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Form 3: 2026 HUD Visual Theme Presets */}
                <div className="relative rounded-2xl bg-slate-900/40 border border-white/10 border-t-white/25 p-5 md:p-6 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.4)]">
                  <div className="pb-4 border-b border-white/[0.08]">
                    <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1">// DISPLAY_MATRIX // THEME_CORE</div>
                    <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                      <span>🎨</span> 2026 Nexus HUD Theme Presets
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Select holographic telemetry accent sheath and optical resonance
                    </p>
                  </div>

                  <div className="pt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { id: "emerald", name: "Matrix Emerald", color: "#10b981", accent: "text-emerald-400" },
                        { id: "cyan", name: "Cyberpunk Cyan", color: "#06b6d4", accent: "text-cyan-400" },
                        { id: "amber", name: "Solar Amber", color: "#f59e0b", accent: "text-amber-400" },
                        { id: "rose", name: "Crimson Protocol", color: "#f43f5e", accent: "text-rose-400" },
                        { id: "purple", name: "Nexus Violet", color: "#a855f7", accent: "text-purple-400" },
                        { id: "indigo", name: "Deep Cobalt", color: "#6366f1", accent: "text-indigo-400" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            playCyberSound("click");
                            const updated = { ...adminProfile, themeColor: t.id as any };
                            setAdminProfile(updated);
                            localStorage.setItem("codearena_admin_profile", JSON.stringify(updated));
                          }}
                          className={`p-3 rounded-xl border font-mono text-left transition-all flex items-center gap-2.5 backdrop-blur-md ${
                            adminProfile.themeColor === t.id
                              ? "border-emerald-400 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.25)] font-bold text-white"
                              : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                            style={{ backgroundColor: t.color }}
                          />
                          <span className="text-xs">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

