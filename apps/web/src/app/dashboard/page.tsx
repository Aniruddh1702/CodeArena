"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getLeaderboards } from "@/lib/leaderboard-data";
import { getActiveAccount, getUserStats, UserAccount } from "@/lib/auth-session";
import { getContests, Contest } from "@/lib/contests-data";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { NotificationCenter } from "@/components/NotificationCenter";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [activeAccount, setActiveAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contestsList, setContestsList] = useState<Contest[]>([]);
  const [now, setNow] = useState(Date.now());
  const [matchmakingActive, setMatchmakingActive] = useState(false);
  const [matchmakingTime, setMatchmakingTime] = useState(0);

  const getRatingTier = (rating: number) => {
    if (rating >= 2200) return { title: "Grandmaster", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", nextRating: 2400 };
    if (rating >= 1900) return { title: "Candidate Master", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", nextRating: 2200 };
    if (rating >= 1600) return { title: "Expert", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", nextRating: 1900 };
    if (rating >= 1400) return { title: "Specialist", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30", nextRating: 1600 };
    if (rating >= 1200) return { title: "Pupil", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", nextRating: 1400 };
    return { title: "Newbie", color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/30", nextRating: 1200 };
  };

  const formatCountdown = (targetTimeStr: string) => {
    const diff = new Date(targetTimeStr).getTime() - now;
    if (diff <= 0) return "00:00:00";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    setContestsList(getContests());
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    const handleUpdate = () => {
      setContestsList(getContests());
    };

    window.addEventListener("codearena_contests_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      clearInterval(timer);
      window.removeEventListener("codearena_contests_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // 1v1 Matchmaking simulation
  useEffect(() => {
    let interval: any;
    if (matchmakingActive) {
      interval = setInterval(() => {
        setMatchmakingTime((prev) => {
          if (prev >= 3) {
            setMatchmakingActive(false);
            router.push("/battles/match-quick-clash");
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setMatchmakingTime(0);
    }
    return () => clearInterval(interval);
  }, [matchmakingActive, router]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const active = getActiveAccount();
        if (!active) {
          router.push("/login");
          return;
        }

        setActiveAccount(active);
        const currentUserName = active.name || active.username || "Learner";

        const userStats = getUserStats(active.id);
        let solvedCount = userStats.problemsSolved;
        let currentRating = userStats.dsaRating || 1450;
        let activities = userStats.recentActivity || [];

        const leaderboardStandings = getLeaderboards({
          username: active.username,
          name: currentUserName,
          score: currentRating,
          problemsSolved: solvedCount,
        });
        const dynamicUserRank = leaderboardStandings.currentUserGlobalRank || 1;

        try {
          const res = await fetch("/api/analytics/student-dashboard", {
            headers: {
              "Content-Type": "application/json",
              ...(active.token ? { Authorization: `Bearer ${active.token}` } : {}),
            },
          });

          if (res.ok) {
            const json = await res.json();
            const payload = json.data;
            if (payload) {
              if (payload.problemsSolved && payload.problemsSolved > solvedCount) {
                solvedCount = payload.problemsSolved;
                currentRating = payload.dsaRating || currentRating;
              }
              if (payload.recentActivity && payload.recentActivity.length > 0 && activities.length === 0) {
                activities = payload.recentActivity;
              }
            }
          }
        } catch (apiErr) {}

        const baseAccuracy = solvedCount > 0 ? 88.4 : 0.0;
        const currentStreak = solvedCount > 0 ? 2 : 0;

        setData({
          greeting: `Welcome back, ${currentUserName}!`,
          currentUserName,
          dsaRating: currentRating,
          userRank: dynamicUserRank,
          problemsSolved: solvedCount,
          accuracy: baseAccuracy,
          currentStreak: currentStreak,
          recentActivity: activities,
          dailyChallenge: {
            title: "Container With Most Water",
            slug: "container-with-most-water",
            difficulty: "MEDIUM",
            points: 200,
            topics: ["Arrays", "Two Pointers", "Greedy"],
            snippet: "Find two lines that together with the x-axis form a container such that the container contains the most water.",
            bonus: "+100 XP Daily Boost",
          },
          roadmapLevels: [
            {
              id: "lvl_1",
              name: "Arrays & Two Pointers",
              desc: "Sliding Window, Prefix Sum & Hash Maps",
              problems: "18 Problems",
              progress: Math.min(100, Math.max(15, solvedCount * 25)),
              badge: "FOUNDATION",
              color: "from-blue-500 to-indigo-600",
              tag: "Arrays",
            },
            {
              id: "lvl_2",
              name: "Trees & Binary Search",
              desc: "Binary Search Trees, DFS/BFS & Recursion",
              problems: "24 Problems",
              progress: Math.min(100, Math.max(10, solvedCount * 18)),
              badge: "CORE",
              color: "from-emerald-500 to-teal-600",
              tag: "Trees",
            },
            {
              id: "lvl_3",
              name: "Graphs & Shortest Path",
              desc: "Dijkstra, Topological Sort & Disjoint Set",
              problems: "20 Problems",
              progress: Math.min(100, Math.max(5, solvedCount * 12)),
              badge: "ADVANCED",
              color: "from-purple-500 to-pink-600",
              tag: "Graphs",
            },
            {
              id: "lvl_4",
              name: "Dynamic Programming",
              desc: "1D/2D DP, Subsequences & Knapsack",
              problems: "28 Problems",
              progress: Math.min(100, Math.max(0, solvedCount * 8)),
              badge: "GRANDMASTER",
              color: "from-amber-500 to-red-600",
              tag: "Dynamic Programming",
            },
          ],
          companyTracks: [
            { name: "Google Top 50", icon: "🔴", count: "50 Questions" },
            { name: "Meta Fast-Track", icon: "🔵", count: "40 Questions" },
            { name: "Amazon High-Freq", icon: "🟠", count: "45 Questions" },
            { name: "Microsoft Core", icon: "🟢", count: "35 Questions" },
          ],
        });
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

    const handleAccountChange = () => {
      setLoading(true);
      fetchDashboard();
    };

    window.addEventListener("codearena_account_changed", handleAccountChange);
    return () => {
      window.removeEventListener("codearena_account_changed", handleAccountChange);
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070913] text-foreground flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Loading Arena Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#070913] text-foreground p-8 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-400 font-medium">{error || "Unable to load dashboard data."}</p>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const tier = getRatingTier(data?.dsaRating || 1450);
  const liveContest = contestsList.find((c) => c.status === "LIVE") || contestsList.find((c) => c.status === "UPCOMING") || contestsList[0];

  return (
    <div className="min-h-screen bg-[#070913] text-foreground selection:bg-indigo-500/30 relative">
      {/* Top Glass Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070913]/90 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-md">
              <span className="text-white text-base font-black">C</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Code<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Arena</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-white/15 transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/problems"
              className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              Practice (150 DSA)
            </Link>
            <Link
              href="/contests"
              className="px-4 py-1.5 rounded-full text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-all"
            >
              <span>🏆</span> Contests
            </Link>
            <Link
              href="/battles"
              className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              Battles
            </Link>
            <Link
              href="/leaderboard"
              className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Link href="/profile">
              <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200">
                <span>👤</span> Profile
              </button>
            </Link>
            <AccountSwitcher />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-6 py-8 space-y-7 max-w-7xl">
        {/* ── COMPONENT 1: HERO COMMAND CARD & TELEMETRY ── */}
        <div className="p-6 md:p-7 rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-950/40 via-card to-purple-950/40 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shrink-0">
                💎
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl md:text-2xl font-extrabold text-white">
                    {data.greeting}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${tier.bg} ${tier.color} ${tier.border}`}>
                    ✦ {tier.title}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                    Global Rank #{data.userRank}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Ready to code? Compete in live 1v1 arenas, solve daily algorithm challenges, and level up your rating.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => router.push("/problems")}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>⚡</span> Practice (150 DSA)
              </button>
              <button
                onClick={() => router.push("/battles")}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs border border-purple-500/40 transition-all flex items-center justify-center gap-2"
              >
                <span>⚔️</span> 1v1 Arena
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-[11px] text-slate-400 font-medium">DSA Rating</p>
              <p className="text-lg font-black text-indigo-400 font-mono">{data.dsaRating}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-[11px] text-slate-400 font-medium">Problems Solved</p>
              <p className="text-lg font-black text-emerald-400 font-mono">{data.problemsSolved} <span className="text-xs text-slate-500">/ 150</span></p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-[11px] text-slate-400 font-medium">Acceptance Rate</p>
              <p className="text-lg font-black text-purple-400 font-mono">{data.accuracy}%</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-[11px] text-slate-400 font-medium">Daily Streak</p>
              <p className="text-lg font-black text-amber-400 font-mono">{data.currentStreak} Days 🔥</p>
            </div>
          </div>
        </div>

        {/* ── COMPONENT 2: DUAL LIVE COMBAT & CONTEST ARENA ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card A: 1v1 Clash Matchmaker */}
          <div className="p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-card to-card shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xl">
                    ⚔️
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">1v1 Speed Battle Arena</h2>
                    <p className="text-xs text-slate-400">Head-to-head live coding duel against engineers worldwide</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                  LIVE MATCHMAKER
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Format</span>
                  <span className="font-bold text-white">1v1 Duel</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Duration</span>
                  <span className="font-bold text-purple-300">10 Mins</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Stakes</span>
                  <span className="font-bold text-emerald-400">±35 Rating</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                48 Coders in Queue
              </span>

              <button
                onClick={() => setMatchmakingActive(!matchmakingActive)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                  matchmakingActive
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30"
                }`}
              >
                {matchmakingActive ? `Searching (${matchmakingTime}s)... Cancel` : "Find 1v1 Opponent"}
              </button>
            </div>
          </div>

          {/* Card B: Live / Upcoming Contest */}
          {liveContest && (
            <div className="p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-card to-card shadow-lg flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl">
                      🏆
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">{liveContest.title}</h2>
                      <p className="text-xs text-slate-400 line-clamp-1">{liveContest.description}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      liveContest.status === "LIVE"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {liveContest.status === "LIVE" ? "● LIVE NOW" : "⏱️ UPCOMING"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Questions</span>
                    <span className="font-bold text-white">{liveContest.problems.length} Problems</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Enrolled</span>
                    <span className="font-bold text-amber-300">{Math.max(liveContest.participantsCount, (liveContest.registeredUsers || []).length)} Users</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Countdown</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {formatCountdown(liveContest.status === "LIVE" ? liveContest.endTime : liveContest.startTime)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-mono">
                  ⏱️ {liveContest.durationMinutes}m Tournament
                </span>

                <button
                  onClick={() => router.push(`/contests/${liveContest.id}`)}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/30 transition-all flex items-center gap-2"
                >
                  <span>🏆</span> Enter Arena
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── COMPONENT 3: PROBLEM OF THE DAY (POTD) ── */}
        <div className="p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/25 via-card to-card shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase">
                ⭐ Challenge of the Day
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {data.dailyChallenge.difficulty}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {data.dailyChallenge.bonus}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">
              {data.dailyChallenge.title}
            </h3>

            <p className="text-xs text-slate-300 max-w-2xl">
              {data.dailyChallenge.snippet}
            </p>

            <div className="flex items-center gap-2 pt-1">
              {data.dailyChallenge.topics.map((t: string, i: number) => (
                <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push(`/problems/${data.dailyChallenge.slug}`)}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <span>🚀</span> Solve Daily Challenge
          </button>
        </div>

        {/* ── COMPONENT 4: DSA ROADMAP & PRACTICE MODULES ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 4 Roadmap Domains (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🗺️</span> 150 Core DSA Roadmap
                </h3>
                <p className="text-xs text-slate-400">Progress through 4 essential algorithmic tiers</p>
              </div>
              <Link href="/problems" className="text-xs text-indigo-400 hover:underline">
                View All 150 &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {data.roadmapLevels.map((lvl: any) => (
                <div
                  key={lvl.id}
                  onClick={() => router.push(`/problems?topic=${encodeURIComponent(lvl.tag)}`)}
                  className="p-4 rounded-xl bg-card border border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{lvl.name}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-indigo-300">
                      {lvl.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">{lvl.desc}</p>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{lvl.problems}</span>
                      <span className="text-indigo-400 font-bold">{lvl.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${lvl.color} rounded-full`}
                        style={{ width: `${Math.max(6, lvl.progress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Curated Packs & Recent Solves (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🏢</span> Curated Company Tracks
              </h3>
              <span className="text-xs text-slate-400 font-mono">High Frequency</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {data.companyTracks.map((comp: any, i: number) => (
                <div
                  key={i}
                  onClick={() => router.push("/problems")}
                  className="p-3 rounded-xl bg-card border border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{comp.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{comp.name}</h4>
                      <p className="text-[10px] text-slate-400">{comp.count}</p>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-400">&rarr;</span>
                </div>
              ))}
            </div>

            {/* Recent Solves Feed */}
            <div className="p-4 rounded-xl bg-card border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-white/10">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span>⚡</span> Recent Submissions
                </span>
                <Link href="/profile" className="text-[10px] text-slate-400 hover:text-white">
                  Full History
                </Link>
              </div>

              {data.recentActivity.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  <p>No recent submissions yet.</p>
                  <button
                    onClick={() => router.push("/problems")}
                    className="mt-1 text-indigo-400 hover:underline font-semibold"
                  >
                    Solve your first challenge &rarr;
                  </button>
                </div>
              ) : (
                data.recentActivity.slice(0, 3).map((act: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => router.push(act.slug ? `/problems/${act.slug}` : "/problems")}
                    className="p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-between cursor-pointer transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="font-semibold text-slate-200">{act.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {act.language || "Accepted"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
