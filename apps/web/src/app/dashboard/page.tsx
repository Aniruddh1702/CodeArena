"use client";

import { useEffect, useState, useRef, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PROBLEMS_DATABASE } from "@/lib/problems-data";
import { getLeaderboards } from "@/lib/leaderboard-data";
import { getActiveAccount, getUserStats, UserAccount } from "@/lib/auth-session";
import { getContests, Contest } from "@/lib/contests-data";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { NotificationCenter } from "@/components/NotificationCenter";

interface FocusAreaItem {
  name: string;
  tag: string;
  accuracy: string;
  problemsCount: number;
  severity: "CRITICAL" | "MODERATE" | "RECOMMENDED";
  icon: string;
}

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
    indigo: "rgba(99, 102, 241, 0.22)",
    emerald: "rgba(16, 185, 129, 0.22)",
    purple: "rgba(168, 85, 247, 0.22)",
    blue: "rgba(59, 130, 246, 0.22)",
    amber: "rgba(245, 158, 11, 0.22)",
    rose: "rgba(244, 63, 94, 0.22)",
    cyan: "rgba(6, 182, 212, 0.22)",
  };

  const borderMap: Record<string, string> = {
    indigo: "hover:border-indigo-500/50 hover:shadow-[0_20px_45px_rgba(99,102,241,0.2)]",
    emerald: "hover:border-emerald-500/50 hover:shadow-[0_20px_45px_rgba(16,185,129,0.2)]",
    purple: "hover:border-purple-500/50 hover:shadow-[0_20px_45px_rgba(168,85,247,0.2)]",
    blue: "hover:border-blue-500/50 hover:shadow-[0_20px_45px_rgba(59,130,246,0.2)]",
    amber: "hover:border-amber-500/50 hover:shadow-[0_20px_45px_rgba(245,158,11,0.2)]",
    rose: "hover:border-rose-500/50 hover:shadow-[0_20px_45px_rgba(244,63,94,0.2)]",
    cyan: "hover:border-cyan-500/50 hover:shadow-[0_20px_45px_rgba(6,182,212,0.2)]",
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
        className={`relative rounded-2xl border border-white/10 bg-card/75 backdrop-blur-2xl shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-all duration-300 overflow-hidden ${borderMap[glowColor]} ${className}`}
      >
        {/* Dynamic 3D Specular Light Reflection */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-10"
          style={{
            opacity: sheen.opacity,
            background: `radial-gradient(circle 320px at ${sheen.x}% ${sheen.y}%, ${glowMap[glowColor]}, transparent 75%)`,
          }}
        />

        {/* 3D Content Container */}
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

    // Particle nodes in 3D space
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.2,
      y: (Math.random() - 0.5) * height * 1.2,
      z: Math.random() * 800 + 100,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.2 + 1,
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
      const fov = 400;

      // Draw faint 3D perspective grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;

      // Update and draw 3D particles
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
        const alpha = Math.min(0.7, Math.max(0.1, (1 - p.z / 900) * 0.6));

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.shadowColor = "rgba(99, 102, 241, 0.5)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const scale2 = fov / (fov + p2.z);
          const px2 = cx + (p2.x + mouseX) * scale2;
          const py2 = cy + (p2.y + mouseY) * scale2;
          const dist = Math.hypot(px - px2, py - py2);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px2, py2);
            ctx.strokeStyle = `rgba(129, 140, 248, ${(1 - dist / 110) * 0.12})`;
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
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
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

  const getRatingTier = (rating: number) => {
    if (rating >= 2200) return { title: "Grandmaster", color: "text-rose-400", bg: "from-rose-500 to-red-700", glow: "rose", nextTier: "Legendary", nextRating: 2400 };
    if (rating >= 1900) return { title: "Candidate Master", color: "text-purple-400", bg: "from-purple-500 to-indigo-700", glow: "purple", nextTier: "Grandmaster", nextRating: 2200 };
    if (rating >= 1600) return { title: "Expert", color: "text-blue-400", bg: "from-blue-500 to-cyan-700", glow: "blue", nextTier: "Candidate Master", nextRating: 1900 };
    if (rating >= 1400) return { title: "Specialist", color: "text-cyan-400", bg: "from-cyan-500 to-teal-700", glow: "cyan", nextTier: "Expert", nextRating: 1600 };
    if (rating >= 1200) return { title: "Pupil", color: "text-emerald-400", bg: "from-emerald-500 to-green-700", glow: "emerald", nextTier: "Specialist", nextRating: 1400 };
    return { title: "Newbie", color: "text-slate-400", bg: "from-slate-500 to-gray-700", glow: "indigo", nextTier: "Pupil", nextRating: 1200 };
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

        // 1. Authoritative isolated stats for THIS user account
        const userStats = getUserStats(active.id);
        const uniqueSolvedList = userStats.solvedProblems;
        let solvedCount = userStats.problemsSolved;
        let currentRating = userStats.dsaRating || 1450;
        let activities = userStats.recentActivity || [];

        // 2. Calculate topic mastery for THIS user account
        const countTopicSolved = (topicName: string): number => {
          let count = 0;
          uniqueSolvedList.forEach((p: any) => {
            const def = PROBLEMS_DATABASE[p.slug];
            if (def && def.topics && def.topics.some((t: any) => t.name.toLowerCase() === topicName.toLowerCase())) {
              count++;
            }
          });
          return count;
        };

        const arraysSolved = countTopicSolved("Arrays");
        const stringsSolved = countTopicSolved("Strings");
        const dpSolved = countTopicSolved("Dynamic Programming");
        const linkedListSolved = countTopicSolved("Linked List");

        const topicProgressData = [
          {
            topicName: "Arrays & Two Pointers",
            topicSlug: "arrays",
            solved: arraysSolved,
            total: 50,
            percentage: Math.min(100, Math.round((arraysSolved / 50) * 100)),
            icon: "📊",
            color: "from-blue-500 to-indigo-600",
          },
          {
            topicName: "Strings & Pattern Matching",
            topicSlug: "strings",
            solved: stringsSolved,
            total: 30,
            percentage: Math.min(100, Math.round((stringsSolved / 30) * 100)),
            icon: "🔤",
            color: "from-purple-500 to-pink-600",
          },
          {
            topicName: "Dynamic Programming",
            topicSlug: "dynamic-programming",
            solved: dpSolved,
            total: 40,
            percentage: Math.min(100, Math.round((dpSolved / 40) * 100)),
            icon: "🧠",
            color: "from-amber-500 to-orange-600",
          },
          {
            topicName: "Linked Lists & Pointers",
            topicSlug: "linked-list",
            solved: linkedListSolved,
            total: 40,
            percentage: Math.min(100, Math.round((linkedListSolved / 40) * 100)),
            icon: "⛓️",
            color: "from-emerald-500 to-teal-600",
          },
        ];

        // 3. Dynamic rank based on authentic leaderboard algorithm for THIS user
        const leaderboardStandings = getLeaderboards({
          username: active.username,
          name: currentUserName,
          score: currentRating,
          problemsSolved: solvedCount,
        });
        const dynamicUserRank = leaderboardStandings.currentUserGlobalRank || 1;

        // 4. Fetch live DB analytics with user's auth token
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

        const baseAccuracy = solvedCount > 0 ? 85.5 : 0.0;
        const currentStreak = solvedCount > 0 ? 1 : 0;

        setData({
          greeting: `Welcome back, ${currentUserName}!`,
          currentUserName,
          dsaRating: currentRating,
          userRank: dynamicUserRank,
          problemsSolved: solvedCount,
          accuracy: baseAccuracy,
          currentStreak: currentStreak,
          recentActivity: activities,
          topicProgress: topicProgressData,
          focusAreas: [
            { name: "Dynamic Programming", tag: "Dynamic Programming", accuracy: "35%", problemsCount: 8, severity: "CRITICAL", icon: "🧠" },
            { name: "Graphs & BFS/DFS", tag: "Graphs", accuracy: "42%", problemsCount: 5, severity: "CRITICAL", icon: "🕸️" },
            { name: "Binary Search", tag: "Binary Search", accuracy: "52%", problemsCount: 6, severity: "MODERATE", icon: "🔍" },
            { name: "Arrays & Two Pointers", tag: "Arrays", accuracy: "68%", problemsCount: 12, severity: "RECOMMENDED", icon: "📊" },
          ] as FocusAreaItem[],
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
        <div className="flex flex-col items-center gap-5 z-10">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 animate-spin blur-lg opacity-60" />
            <div className="relative h-full w-full rounded-2xl bg-card border border-white/20 flex items-center justify-center text-primary text-xl font-black">
              C
            </div>
          </div>
          <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground animate-pulse">
            Constructing 3D Arena...
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
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const tier = getRatingTier(data?.dsaRating || 1450);
  const liveOrUpcomingContests = contestsList.filter((c) => c.status === "LIVE" || c.status === "UPCOMING");

  return (
    <div className="min-h-screen bg-[#070913] text-foreground selection:bg-indigo-500/30 relative overflow-x-hidden">
      {/* 3D Cybernetic Background Horizon & Floating Particles */}
      <CyberMesh3D />

      {/* Ambient Lighting Mesh */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-[20%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[130px] animate-glow-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[140px] animate-glow-pulse" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[130px] animate-glow-pulse" />
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

      {/* Main 3D Interactive Workspace */}
      <main className="relative z-10 container mx-auto px-6 py-8 space-y-8">
        {/* ── 3D Hero Command Bridge ── */}
        <div className="relative">
          <TiltCard glowColor="indigo" className="p-6 md:p-8 bg-gradient-to-r from-indigo-950/40 via-card/80 to-purple-950/40 border-indigo-500/30">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left Identity Prism */}
              <div className="flex items-center gap-5">
                {/* 3D Tier Crystal Hologram */}
                <div className="relative shrink-0">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr ${tier.bg} p-0.5 shadow-[0_0_30px_rgba(99,102,241,0.4)] animate-float-3d flex items-center justify-center`}>
                    <div className="w-full h-full rounded-2xl bg-[#0b0e1b] flex flex-col items-center justify-center">
                      <span className="text-2xl md:text-3xl">💎</span>
                      <span className={`text-[9px] font-black uppercase tracking-wider ${tier.color}`}>
                        {tier.title.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-emerald-500 text-[10px] font-black text-black shadow-md">
                    LIVE
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                      {data.greeting}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
                      Rank #{data.userRank}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 max-w-xl">
                    Welcome to your next-generation 3D arena. Real-time telemetry, live contest matchmaking, and deep algorithmic mastery.
                  </p>
                </div>
              </div>

              {/* 3D Tactile Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={() => router.push("/problems")}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-bold text-xs tracking-wide shadow-[0_10px_25px_rgba(99,102,241,0.4)] hover:shadow-[0_15px_30px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  <span>⚡</span> Practice (150 DSA)
                </button>

                <button
                  onClick={() => router.push("/battles")}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-card/80 hover:bg-white/10 border border-white/15 text-slate-200 font-bold text-xs hover:border-purple-500/50 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <span>⚔️</span> 1v1 Battle Arena
                </button>

                <button
                  onClick={() => router.push("/contests")}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs hover:border-amber-400 transition-all flex items-center justify-center gap-2"
                >
                  <span>🏆</span> Contests
                </button>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* ── 4 Floating 3D Metric Cubes ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 3D DSA Rating */}
          <TiltCard
            glowColor="indigo"
            onClick={() => router.push("/profile")}
            className="p-5 cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                DSA Rating
              </span>
              <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                Rank #{data.userRank}
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-400">
              {data.dsaRating}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px]">
              <span className={`font-bold ${tier.color}`}>✦ {tier.title}</span>
              <span className="text-slate-400">Target: {tier.nextRating} pts</span>
            </div>
          </TiltCard>

          {/* 3D Solved Problems */}
          <TiltCard
            glowColor="emerald"
            onClick={() => router.push("/problems")}
            className="p-5 cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                Problems Solved
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">+15 pts / solve</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-200 to-emerald-400">
              {data.problemsSolved}
              <span className="text-lg font-normal text-slate-500 ml-1.5">/ 150</span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(5, (data.problemsSolved / 150) * 100))}%` }}
                />
              </div>
            </div>
          </TiltCard>

          {/* 3D Global Accuracy */}
          <TiltCard glowColor="purple" className="p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                Acceptance Rate
              </span>
              <span className="text-purple-400 text-[11px] font-semibold">Precision</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-pink-400">
              {data.accuracy}%
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400">
              <span>Clean Executions</span>
              <span className="text-purple-300 font-semibold">Verified</span>
            </div>
          </TiltCard>

          {/* 3D Daily Streak */}
          <TiltCard glowColor="amber" className="p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                Active Streak
              </span>
              <span className="text-amber-400 text-[11px] font-semibold">Momentum</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-amber-200 to-orange-400 flex items-center gap-2">
              {data.currentStreak} <span className="text-2xl drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">🔥</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400">
              <span>Daily Habit</span>
              <span className="text-amber-300 font-semibold">Keep it up!</span>
            </div>
          </TiltCard>
        </div>

        {/* ── Main 2-Column 3D Interactive Arena ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (7 cols): Topic Mastery Deck */}
          <div className="lg:col-span-7 space-y-6">
            <TiltCard glowColor="indigo" className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🧠</span> Core Topic Mastery
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Interactive progress tracking across standard DSA patterns.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/problems")}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  All 150 &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.topicProgress.map((topic: any) => (
                  <div
                    key={topic.topicSlug}
                    onClick={() => router.push(`/problems?topic=${encodeURIComponent(topic.topicSlug === "arrays" ? "Arrays" : topic.topicSlug === "strings" ? "Strings" : topic.topicSlug === "dynamic-programming" ? "Dynamic Programming" : "Linked List")}`)}
                    className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-indigo-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{topic.icon}</span>
                        <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {topic.topicName}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-indigo-400 font-bold">
                        {topic.percentage}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full bg-gradient-to-r ${topic.color} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.max(6, topic.percentage)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{topic.solved} / {topic.total} solved</span>
                      <span className="text-indigo-400 font-semibold group-hover:underline">Practice &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </TiltCard>

            {/* Quick Match Battle Hub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TiltCard
                glowColor="purple"
                onClick={() => router.push("/battles")}
                className="p-5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xl">
                    ⚔️
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">1v1 Speed Match</h3>
                    <p className="text-xs text-slate-400">Battle against another coder live</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-purple-400 font-semibold">Matchmaking Queue</span>
                  <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                    Find Match &rarr;
                  </span>
                </div>
              </TiltCard>

              <TiltCard
                glowColor="amber"
                onClick={() => router.push("/contests")}
                className="p-5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl">
                    🏆
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Weekly Global Cup</h3>
                    <p className="text-xs text-slate-400">Rating leaderboard competition</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-semibold">Leaderboard Event</span>
                  <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    Enter Lobby &rarr;
                  </span>
                </div>
              </TiltCard>
            </div>
          </div>

          {/* Right Column (5 cols): Live Contests & AI Focus Areas */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live / Upcoming Contests Deck */}
            {liveOrUpcomingContests.length > 0 && (
              <TiltCard glowColor="cyan" className="p-5 border-cyan-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
                    <h3 className="text-sm font-bold text-white">Live & Upcoming Contests</h3>
                  </div>
                  <Link href="/contests" className="text-[11px] text-cyan-400 hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {liveOrUpcomingContests.slice(0, 2).map((c) => {
                    const isLive = c.status === "LIVE";
                    return (
                      <div
                        key={c.id}
                        onClick={() => router.push(`/contests/${c.id}`)}
                        className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isLive
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse"
                                : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            }`}
                          >
                            {isLive ? "● LIVE NOW" : "⏱️ UPCOMING"}
                          </span>
                          <span className="font-mono text-xs text-white font-bold">
                            {formatCountdown(isLive ? c.endTime : c.startTime)}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white hover:text-cyan-300 transition-colors">
                          {c.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span>{c.problems.length} Challenges</span>
                          <span className="text-cyan-400 font-semibold">Enter Arena &rarr;</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TiltCard>
            )}

            {/* Smart Focus Areas (AI Diagnostics) */}
            <TiltCard glowColor="rose" className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎯</span>
                  <h3 className="text-sm font-bold text-white">Recommended Focus Topics</h3>
                </div>
                <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  Targeted
                </span>
              </div>

              <div className="space-y-2.5">
                {data.focusAreas.slice(0, 3).map((item: FocusAreaItem, i: number) => (
                  <div
                    key={i}
                    onClick={() => router.push(`/problems?topic=${encodeURIComponent(item.tag || item.name)}`)}
                    className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-rose-500/30 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {item.problemsCount} questions • {item.accuracy} accuracy
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-rose-400 font-semibold group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </div>
                ))}
              </div>
            </TiltCard>

            {/* Recent Activity Stream */}
            <TiltCard glowColor="emerald" className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚡</span>
                  <h3 className="text-sm font-bold text-white">Recent Activity</h3>
                </div>
                <Link href="/profile" className="text-[11px] text-slate-400 hover:text-white">
                  Full History
                </Link>
              </div>

              {data.recentActivity.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <p>No recent submissions yet.</p>
                  <button
                    onClick={() => router.push("/problems")}
                    className="mt-2 text-indigo-400 hover:underline font-semibold"
                  >
                    Solve your first problem &rarr;
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.recentActivity.slice(0, 4).map((act: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => router.push(act.slug ? `/problems/${act.slug}` : "/problems")}
                      className="p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                        <span className="text-xs font-semibold text-slate-200 hover:text-white transition-colors">
                          {act.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {act.language || "Accepted"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </TiltCard>
          </div>
        </div>
      </main>
    </div>
  );
}
