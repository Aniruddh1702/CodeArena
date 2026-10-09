"use client";

import { useEffect, useState, useRef, MouseEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PROBLEMS_DATABASE } from "@/lib/problems-data";
import { getLeaderboards } from "@/lib/leaderboard-data";
import { getActiveAccount, getUserStats, UserAccount } from "@/lib/auth-session";
import { getContests, Contest } from "@/lib/contests-data";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { NotificationCenter } from "@/components/NotificationCenter";

// ── 3D Interactive Tilt Card Component ──
function TiltCard({
  children,
  className = "",
  glowColor = "indigo",
  maxTilt = 7,
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

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
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
    indigo: "rgba(99, 102, 241, 0.25)",
    emerald: "rgba(16, 185, 129, 0.25)",
    purple: "rgba(168, 85, 247, 0.25)",
    blue: "rgba(59, 130, 246, 0.25)",
    amber: "rgba(245, 158, 11, 0.25)",
    rose: "rgba(244, 63, 94, 0.25)",
    cyan: "rgba(6, 182, 212, 0.25)",
  };

  const borderMap: Record<string, string> = {
    indigo: "hover:border-indigo-500/50 hover:shadow-[0_20px_45px_rgba(99,102,241,0.22)]",
    emerald: "hover:border-emerald-500/50 hover:shadow-[0_20px_45px_rgba(16,185,129,0.22)]",
    purple: "hover:border-purple-500/50 hover:shadow-[0_20px_45px_rgba(168,85,247,0.22)]",
    blue: "hover:border-blue-500/50 hover:shadow-[0_20px_45px_rgba(59,130,246,0.22)]",
    amber: "hover:border-amber-500/50 hover:shadow-[0_20px_45px_rgba(245,158,11,0.22)]",
    rose: "hover:border-rose-500/50 hover:shadow-[0_20px_45px_rgba(244,63,94,0.22)]",
    cyan: "hover:border-cyan-500/50 hover:shadow-[0_20px_45px_rgba(6,182,212,0.22)]",
  };

  return (
    <div style={{ perspective: "1200px" }} className="w-full h-full">
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${sheen.opacity ? "14px" : "0px"})`,
          transition: sheen.opacity ? "transform 0.08s ease-out" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          transformStyle: "preserve-3d",
        }}
        className={`relative rounded-2xl border border-white/10 bg-card/80 backdrop-blur-2xl shadow-[0_12px_35px_rgba(0,0,0,0.4)] transition-all duration-300 overflow-hidden ${borderMap[glowColor]} ${className}`}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-10"
          style={{
            opacity: sheen.opacity,
            background: `radial-gradient(circle 340px at ${sheen.x}% ${sheen.y}%, ${glowMap[glowColor]}, transparent 75%)`,
          }}
        />

        <div className="relative z-20 w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── 3D Ambient Particle Grid Canvas ──
function CyberMesh3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 50;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.3,
      y: (Math.random() - 0.5) * height * 1.3,
      z: Math.random() * 800 + 100,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      size: Math.random() * 2.4 + 1,
      color: Math.random() > 0.5 ? "rgba(99, 102, 241, " : "rgba(168, 85, 247, ",
    }));

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      mouseX = (e.clientX - width / 2) * 0.05;
      mouseY = (e.clientY - height / 2) * 0.05;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const fov = 420;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -width) p.x = width;
        if (p.x > width) p.x = -width;
        if (p.y < -height) p.y = height;
        if (p.y > height) p.y = -height;

        const scale = fov / (fov + p.z);
        const px = cx + (p.x + mouseX) * scale;
        const py = cy + (p.y + mouseY) * scale;
        const radius = Math.max(0.6, p.size * scale);
        const alpha = Math.min(0.75, Math.max(0.1, (1 - p.z / 900) * 0.65));

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.shadowColor = "rgba(99, 102, 241, 0.6)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const scale2 = fov / (fov + p2.z);
          const px2 = cx + (p2.x + mouseX) * scale2;
          const py2 = cy + (p2.y + mouseY) * scale2;
          const dist = Math.hypot(px - px2, py - py2);

          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px2, py2);
            ctx.strokeStyle = `rgba(129, 140, 248, ${(1 - dist / 115) * 0.14})`;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-65"
    />
  );
}

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
    if (rating >= 2200) return { title: "Grandmaster", color: "text-rose-400", bg: "from-rose-500 to-red-700", glow: "rose" as const, nextTier: "Legendary", nextRating: 2400 };
    if (rating >= 1900) return { title: "Candidate Master", color: "text-purple-400", bg: "from-purple-500 to-indigo-700", glow: "purple" as const, nextTier: "Grandmaster", nextRating: 2200 };
    if (rating >= 1600) return { title: "Expert", color: "text-blue-400", bg: "from-blue-500 to-cyan-700", glow: "blue" as const, nextTier: "Candidate Master", nextRating: 1900 };
    if (rating >= 1400) return { title: "Specialist", color: "text-cyan-400", bg: "from-cyan-500 to-teal-700", glow: "cyan" as const, nextTier: "Expert", nextRating: 1600 };
    if (rating >= 1200) return { title: "Pupil", color: "text-emerald-400", bg: "from-emerald-500 to-green-700", glow: "emerald" as const, nextTier: "Specialist", nextRating: 1400 };
    return { title: "Newbie", color: "text-slate-400", bg: "from-slate-500 to-gray-700", glow: "indigo" as const, nextTier: "Pupil", nextRating: 1200 };
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
      setContestsList(getContests());
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

  // 1v1 Matchmaking Simulation
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
            timeEstimate: "15 mins",
            bonus: "+100 XP Daily Multiplier",
          },
          roadmapLevels: [
            {
              id: "lvl_1",
              name: "Tier 1: Foundational Array & Pointer Patterns",
              desc: "Two Pointers, Sliding Window, Prefix Sum & Hashing",
              problems: "18 Problems",
              progress: Math.min(100, Math.max(15, solvedCount * 25)),
              badge: "NOVICE",
              color: "from-blue-500 to-indigo-600",
              tag: "Arrays",
            },
            {
              id: "lvl_2",
              name: "Tier 2: Core Data Structure Trees & Lists",
              desc: "Binary Search, Linked Lists, Tree Traversals & Recursion",
              problems: "24 Problems",
              progress: Math.min(100, Math.max(10, solvedCount * 18)),
              badge: "ADEPT",
              color: "from-emerald-500 to-teal-600",
              tag: "Trees",
            },
            {
              id: "lvl_3",
              name: "Tier 3: Graph Traversal & Shortest Path",
              desc: "BFS, DFS, Dijkstra, Union-Find & Topological Sort",
              problems: "20 Problems",
              progress: Math.min(100, Math.max(5, solvedCount * 12)),
              badge: "VANGUARD",
              color: "from-purple-500 to-pink-600",
              tag: "Graphs",
            },
            {
              id: "lvl_4",
              name: "Tier 4: Dynamic Programming & Optimization",
              desc: "1D/2D DP, Subsequences, Knapsack & Memoization",
              problems: "28 Problems",
              progress: Math.min(100, Math.max(0, solvedCount * 8)),
              badge: "GRANDMASTER",
              color: "from-amber-500 to-red-600",
              tag: "Dynamic Programming",
            },
          ],
          companyTracks: [
            { name: "Google Top 50", icon: "🔴", count: "50 Qs", color: "border-blue-500/30" },
            { name: "Meta Fast-Track", icon: "🔵", count: "40 Qs", color: "border-indigo-500/30" },
            { name: "Amazon High-Freq", icon: "🟠", count: "45 Qs", color: "border-amber-500/30" },
            { name: "Microsoft Core", icon: "🟢", count: "35 Qs", color: "border-emerald-500/30" },
          ],
          communityTicker: [
            { text: "Alex Dev solved 'Two Sum' in 18ms", time: "2m ago", icon: "⚡" },
            { text: "Vikram Singh won a 1v1 Battle Arena Duel (+32 pts)", time: "5m ago", icon: "⚔️" },
            { text: "Sarah Khan reached Specialist Rank (1450+ Rating)", time: "11m ago", icon: "🏆" },
            { text: "Contest 'Bi-Weekly Clash #1' is Live Now!", time: "Active", icon: "🟢" },
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
      <div className="min-h-screen bg-[#070913] text-foreground flex justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_70%)]" />
        <div className="flex flex-col items-center gap-5 z-10">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 animate-spin blur-lg opacity-70" />
            <div className="relative h-full w-full rounded-2xl bg-card border border-white/20 flex items-center justify-center text-primary text-xl font-black">
              C
            </div>
          </div>
          <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground animate-pulse">
            Connecting Arena Command Station...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#070913] text-foreground p-8 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-400 font-medium">{error || "Unable to load arena telemetry."}</p>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const tier = getRatingTier(data?.dsaRating || 1450);
  const liveContest = contestsList.find((c) => c.status === "LIVE") || contestsList.find((c) => c.status === "UPCOMING") || contestsList[0];

  return (
    <div className="min-h-screen bg-[#070913] text-foreground selection:bg-indigo-500/30 relative overflow-x-hidden">
      <CyberMesh3D />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-[20%] w-[650px] h-[650px] rounded-full bg-indigo-600/15 blur-[140px] animate-glow-pulse" />
        <div className="absolute top-[35%] -right-[10%] w-[550px] h-[550px] rounded-full bg-purple-600/15 blur-[150px] animate-glow-pulse" />
        <div className="absolute bottom-[10%] left-[10%] w-[550px] h-[550px] rounded-full bg-cyan-600/12 blur-[140px] animate-glow-pulse" />
      </div>

      {/* Modern 3D Glass Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070913]/70 backdrop-blur-2xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="group flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
              <span className="text-white text-base font-black">C</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Code<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Arena</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-white/10 shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/problems"
              className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Practice (150 DSA)
            </Link>
            <Link
              href="/contests"
              className="px-4 py-1.5 rounded-full text-xs font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 flex items-center gap-1.5 transition-all"
            >
              <span>🏆</span> Contests
            </Link>
            <Link
              href="/battles"
              className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Battles
            </Link>
            <Link
              href="/leaderboard"
              className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Link href="/profile">
              <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all">
                <span>👤</span> Profile
              </button>
            </Link>
            <AccountSwitcher />
          </div>
        </div>
      </header>

      {/* Main Command Hub */}
      <main className="relative z-10 container mx-auto px-6 py-8 space-y-8">
        {/* ── Top Telemetry Horizon Bar ── */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-2">
                <span>{data.greeting}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Global Rank #{data.userRank}
                </span>
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                CodeArena Matchmaking Active • Live Global Standings Updated
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Rating:</span>
              <span className="font-bold text-indigo-400">{data.dsaRating}</span>
              <span className={`text-[10px] font-black uppercase ${tier.color}`}>({tier.title})</span>
            </div>

            <div className="h-4 w-px bg-white/10" />

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Solved:</span>
              <span className="font-bold text-emerald-400">{data.problemsSolved}/150</span>
            </div>

            <div className="h-4 w-px bg-white/10" />

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Streak:</span>
              <span className="font-bold text-amber-400 flex items-center gap-1">
                {data.currentStreak} <span className="text-xs">🔥</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: DUAL LIVE COMBAT & CONTEST ARENA STAGE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: 1v1 Fast Matchmaking Duelist */}
          <TiltCard glowColor="purple" className="p-6 bg-gradient-to-br from-purple-950/40 via-card/90 to-card/90 border-purple-500/30 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    ⚔️
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                      1v1 Speed Battle Arena
                    </h2>
                    <p className="text-xs text-slate-400">
                      Real-time algorithm duel. First to pass all test cases wins rating points!
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Live Matchmaker
                </span>
              </div>

              {/* Mode Pills */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Format</span>
                  <span className="text-xs font-black text-white">1v1 Real-time</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Timer</span>
                  <span className="text-xs font-black text-purple-300">10 Minutes</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Stakes</span>
                  <span className="text-xs font-black text-emerald-400">±35 Rating</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>48 Engineers queuing right now</span>
              </div>

              <button
                onClick={() => {
                  setMatchmakingActive(!matchmakingActive);
                }}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                  matchmakingActive
                    ? "bg-rose-500 text-white shadow-rose-500/30 animate-pulse"
                    : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-purple-500/30"
                }`}
              >
                {matchmakingActive ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-spin" />
                    Searching Opponent ({matchmakingTime}s)... Cancel
                  </>
                ) : (
                  <>
                    <span>⚔️</span> Find 1v1 Match
                  </>
                )}
              </button>
            </div>
          </TiltCard>

          {/* Card 2: Featured Live Contest Stage */}
          {liveContest && (
            <TiltCard glowColor="amber" className="p-6 bg-gradient-to-br from-amber-950/40 via-card/90 to-card/90 border-amber-500/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                      🏆
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                        {liveContest.title}
                      </h2>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {liveContest.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      liveContest.status === "LIVE"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {liveContest.status === "LIVE" ? "● LIVE NOW" : "⏱️ SCHEDULED"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
                    <span className="text-xs font-black text-white">{liveContest.problems.length} Challenges</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrolled</span>
                    <span className="text-xs font-black text-amber-300">{Math.max(liveContest.participantsCount, (liveContest.registeredUsers || []).length)} Coders</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Countdown</span>
                    <span className="text-xs font-black text-emerald-400 font-mono">
                      {formatCountdown(liveContest.status === "LIVE" ? liveContest.endTime : liveContest.startTime)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-mono">
                  ⏱️ {liveContest.durationMinutes} mins • Rated Arena Tournament
                </span>

                <button
                  onClick={() => router.push(`/contests/${liveContest.id}`)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>🏆</span> Enter Contest Arena
                </button>
              </div>
            </TiltCard>
          )}
        </div>

        {/* ── SECTION 2: PROBLEM OF THE DAY (POTD) HIGHLIGHT ── */}
        <TiltCard glowColor="indigo" className="p-6 bg-gradient-to-r from-indigo-950/30 via-card/85 to-card/85 border-indigo-500/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black uppercase">
                  ⭐ Challenge of the Day
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                  {data.dailyChallenge.difficulty}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {data.dailyChallenge.bonus}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  {data.dailyChallenge.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {data.dailyChallenge.snippet}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 font-mono">
                {data.dailyChallenge.topics.map((t: string, i: number) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => router.push(`/problems/${data.dailyChallenge.slug}`)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] transition-all flex items-center justify-center gap-2"
              >
                <span>🚀</span> Solve Daily Challenge
              </button>
            </div>
          </div>
        </TiltCard>

        {/* ── SECTION 3: INTERACTIVE DSA QUEST ROADMAP GALAXY ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>🗺️</span> Algorithmic Conquest Roadmap
              </h2>
              <p className="text-xs text-slate-400">
                Four progressive conquest tiers covering the 150 Core DSA patterns.
              </p>
            </div>
            <Link href="/problems" className="text-xs font-semibold text-indigo-400 hover:underline">
              All 150 Problems &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.roadmapLevels.map((lvl: any, idx: number) => (
              <TiltCard
                key={lvl.id}
                glowColor="indigo"
                onClick={() => router.push(`/problems?topic=${encodeURIComponent(lvl.tag)}`)}
                className="p-5 cursor-pointer flex flex-col justify-between bg-card/85"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">0{idx + 1}</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-indigo-300">
                      {lvl.badge}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">
                    {lvl.name}
                  </h4>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {lvl.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">{lvl.problems}</span>
                    <span className="text-indigo-400 font-bold">{lvl.progress}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${lvl.color} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.max(6, lvl.progress)}%` }}
                    />
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* ── SECTION 4: FAST-TRACK COMPANY PACKS & DRILLS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Company Packs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🏢</span> Curated Company Practice Tracks
              </h3>
              <span className="text-xs text-slate-400 font-mono">Interview High-Freq</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {data.companyTracks.map((comp: any, i: number) => (
                <TiltCard
                  key={i}
                  glowColor="blue"
                  onClick={() => router.push("/problems")}
                  className="p-4 cursor-pointer flex items-center justify-between bg-card/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{comp.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{comp.name}</h4>
                      <p className="text-[10px] text-slate-400">{comp.count} interview questions</p>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-400 font-bold">&rarr;</span>
                </TiltCard>
              ))}
            </div>
          </div>

          {/* Live Arena Telemetry Stream (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>⚡</span> Arena Activity Stream
              </h3>
              <span className="text-xs text-emerald-400 font-mono">● Live Feed</span>
            </div>

            <TiltCard glowColor="emerald" className="p-4 bg-card/80 space-y-2.5">
              {data.communityTicker.map((item: any, i: number) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-slate-200 text-[11px]">{item.text}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                </div>
              ))}
            </TiltCard>
          </div>
        </div>
      </main>
    </div>
  );
}
