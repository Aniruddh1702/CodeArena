"use client";

import { useEffect, useState, useRef, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getActiveAccount, getUserStats, UserAccount } from "@/lib/auth-session";
import { getLeaderboards } from "@/lib/leaderboard-data";
import { getContests, Contest } from "@/lib/contests-data";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { NotificationCenter } from "@/components/NotificationCenter";

// ── 3D Interactive Parallax Tilt Card Component ──
function Tilt3DCard({
  children,
  className = "",
  glowColor = "indigo",
  maxTilt = 9,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: "indigo" | "purple" | "amber" | "rose" | "emerald" | "cyan";
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
    indigo: "rgba(99, 102, 241, 0.32)",
    purple: "rgba(168, 85, 247, 0.32)",
    amber: "rgba(245, 158, 11, 0.32)",
    rose: "rgba(244, 63, 94, 0.32)",
    emerald: "rgba(16, 185, 129, 0.32)",
    cyan: "rgba(6, 182, 212, 0.32)",
  };

  const borderGlowMap: Record<string, string> = {
    indigo: "hover:border-indigo-500/60 hover:shadow-[0_20px_50px_rgba(99,102,241,0.3)]",
    purple: "hover:border-purple-500/60 hover:shadow-[0_20px_50px_rgba(168,85,247,0.3)]",
    amber: "hover:border-amber-500/60 hover:shadow-[0_20px_50px_rgba(245,158,11,0.3)]",
    rose: "hover:border-rose-500/60 hover:shadow-[0_20px_50px_rgba(244,63,94,0.3)]",
    emerald: "hover:border-emerald-500/60 hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)]",
    cyan: "hover:border-cyan-500/60 hover:shadow-[0_20px_50px_rgba(6,182,212,0.3)]",
  };

  return (
    <div style={{ perspective: "1200px" }} className="w-full h-full">
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${sheen.opacity ? "18px" : "0px"})`,
          transition: sheen.opacity ? "transform 0.08s ease-out" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          transformStyle: "preserve-3d",
        }}
        className={`relative rounded-3xl border border-white/10 bg-[#0c1024]/85 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden ${borderGlowMap[glowColor]} ${className}`}
      >
        {/* Specular Radial Light Sheen */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-10"
          style={{
            opacity: sheen.opacity,
            background: `radial-gradient(circle 420px at ${sheen.x}% ${sheen.y}%, ${glowMap[glowColor]}, transparent 70%)`,
          }}
        />

        {/* 3D Content Wrapper */}
        <div className="relative z-20 w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── 3D Ambient Constellation Particle Canvas ──
function CyberParticleMesh3D() {
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

    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.3,
      y: (Math.random() - 0.5) * height * 1.3,
      z: Math.random() * 850 + 80,
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
        const alpha = Math.min(0.75, Math.max(0.1, (1 - p.z / 950) * 0.65));

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
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
    />
  );
}

// ── 3D Holographic Skill Radar Matrix ──
function HolographicRadar({ stats }: { stats: { algorithms: number; dataStructures: number; speed: number; problemSolving: number; dpOptimization: number; mathLogic: number } }) {
  const size = 200;
  const center = size / 2;
  const radius = 70;

  const skills = [
    { label: "Algorithms", value: stats.algorithms, color: "#6366f1" },
    { label: "Data Structs", value: stats.dataStructures, color: "#10b981" },
    { label: "Speed & Perf", value: stats.speed, color: "#f59e0b" },
    { label: "Problem Solving", value: stats.problemSolving, color: "#a855f7" },
    { label: "DP & Trees", value: stats.dpOptimization, color: "#ec4899" },
    { label: "Math & Logic", value: stats.mathLogic, color: "#06b6d4" },
  ];

  const totalPoints = skills.length;
  const angleStep = (Math.PI * 2) / totalPoints;

  const points = skills.map((skill, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (Math.min(100, Math.max(25, skill.value)) / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle, skill };
  });

  const polygonPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible select-none">
        {[0.33, 0.66, 1].map((lvl, idx) => (
          <polygon
            key={idx}
            points={Array.from({ length: totalPoints })
              .map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const r = radius * lvl;
                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
              })
              .join(" ")}
            fill={idx === 2 ? "rgba(99, 102, 241, 0.06)" : "none"}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
            strokeDasharray={idx < 2 ? "3 3" : undefined}
          />
        ))}

        {Array.from({ length: totalPoints }).map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
            />
          );
        })}

        <path
          d={polygonPath}
          fill="url(#homeRadarGrad2026)"
          stroke="#818cf8"
          strokeWidth="2"
          className="transition-all duration-700 drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]"
        />

        <defs>
          <radialGradient id="homeRadarGrad2026" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.7)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.2)" />
          </radialGradient>
        </defs>

        {points.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill={p.skill.color}
            stroke="#ffffff"
            strokeWidth="1.5"
            className="drop-shadow-[0_0_8px_rgba(99,102,241,0.9)]"
          />
        ))}
      </svg>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [activeAccount, setActiveAccount] = useState<UserAccount | null>(null);
  const [userStats, setUserStats] = useState({ rating: 1450, solved: 24, rank: 1, streak: 2 });
  const [matchmakingActive, setMatchmakingActive] = useState(false);
  const [matchmakingTime, setMatchmakingTime] = useState(0);
  const [contests, setContests] = useState<Contest[]>([]);
  const [activeSectionTab, setActiveSectionTab] = useState<"ALL" | "DASHBOARD" | "BATTLES" | "CONTESTS">("ALL");

  // Load account & dynamic data
  useEffect(() => {
    const active = getActiveAccount();
    setActiveAccount(active);

    const stats = active ? getUserStats(active.id) : { dsaRating: 1450, problemsSolved: 12 };
    const leaderboard = getLeaderboards({
      username: active?.username || "guest",
      name: active?.name || active?.username || "Learner",
      score: stats.dsaRating || 1450,
      problemsSolved: stats.problemsSolved || 12,
    });

    setUserStats({
      rating: stats.dsaRating || 1450,
      solved: stats.problemsSolved || 12,
      rank: leaderboard.currentUserGlobalRank || 1,
      streak: stats.problemsSolved > 0 ? 2 : 0,
    });

    setContests(getContests());

    const handleAccountChange = () => {
      const updated = getActiveAccount();
      setActiveAccount(updated);
      if (updated) {
        const uStats = getUserStats(updated.id);
        setUserStats((prev) => ({
          ...prev,
          rating: uStats.dsaRating || 1450,
          solved: uStats.problemsSolved || 0,
        }));
      }
    };

    window.addEventListener("codearena_account_changed", handleAccountChange);
    return () => {
      window.removeEventListener("codearena_account_changed", handleAccountChange);
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

  const getRatingTier = (rating: number) => {
    if (rating >= 2200) return { title: "Grandmaster", color: "text-rose-400", bg: "from-rose-500 to-red-700", glow: "rose" as const };
    if (rating >= 1900) return { title: "Candidate Master", color: "text-purple-400", bg: "from-purple-500 to-indigo-700", glow: "purple" as const };
    if (rating >= 1600) return { title: "Expert", color: "text-blue-400", bg: "from-blue-500 to-cyan-700", glow: "cyan" as const };
    if (rating >= 1400) return { title: "Specialist", color: "text-cyan-400", bg: "from-cyan-500 to-teal-700", glow: "cyan" as const };
    if (rating >= 1200) return { title: "Pupil", color: "text-emerald-400", bg: "from-emerald-500 to-green-700", glow: "emerald" as const };
    return { title: "Newbie", color: "text-slate-400", bg: "from-slate-500 to-gray-700", glow: "indigo" as const };
  };

  const tier = getRatingTier(userStats.rating);

  return (
    <div className="min-h-screen bg-[#05070e] text-foreground selection:bg-indigo-500/30 relative overflow-x-hidden">
      {/* 3D Horizon Constellation Canvas */}
      <CyberParticleMesh3D />

      {/* Atmospheric 2026 Cosmic Glow Fields */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-[15%] w-[680px] h-[680px] rounded-full bg-indigo-600/15 blur-[150px] animate-glow-pulse" />
        <div className="absolute top-[35%] -right-[10%] w-[580px] h-[580px] rounded-full bg-purple-600/15 blur-[160px] animate-glow-pulse" />
        <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-cyan-600/12 blur-[150px] animate-glow-pulse" />
      </div>

      {/* ── 2026 Glassmorphism Top Navigation ── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070e]/80 backdrop-blur-2xl">
        <div className="container mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
              <span className="text-white text-lg font-black">C</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white leading-none">
                Code<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Arena</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold uppercase mt-0.5">
                2026 Nexus Home
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/problems"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Practice (150 DSA)
            </Link>
            <Link
              href="/contests"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 flex items-center gap-1 transition-all"
            >
              <span>🏆</span> Contests
            </Link>
            <Link
              href="/battles"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-1 transition-all"
            >
              <span>⚔️</span> 1v1 Battles
            </Link>
            <Link
              href="/leaderboard"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Leaderboard
            </Link>
            <Link
              href="/profile"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Profile
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ARENA 2026 LIVE
            </div>

            <NotificationCenter />
            <AccountSwitcher />
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8 space-y-12 max-w-7xl">
        {/* ── 1. 3D HERO COMMAND BRIDGE & LIVE NEXUS STATS ── */}
        <Tilt3DCard glowColor={tier.glow} className="p-6 md:p-8 bg-gradient-to-r from-indigo-950/60 via-[#0c1024]/90 to-purple-950/60 border-indigo-500/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* 3D Tier Crystal Hologram */}
              <div className="relative shrink-0">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr ${tier.bg} p-1 shadow-[0_0_35px_rgba(99,102,241,0.5)] animate-float-3d flex items-center justify-center`}>
                  <div className="w-full h-full rounded-2xl bg-[#080b18] flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl">💎</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider ${tier.color}`}>
                      {tier.title.split(" ")[0]}
                    </span>
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-emerald-500 text-[9px] font-black text-black shadow-md">
                  ONLINE
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                    {activeAccount ? `Welcome, ${activeAccount.name || activeAccount.username}!` : "CodeArena 2026 Command Nexus"}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border border-white/10 ${tier.color} bg-white/5`}>
                    ✦ {tier.title}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold font-mono">
                    Rank #{userStats.rank}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
                  All platform modules consolidated into a 3D command matrix. Engage in live 1v1 battle duels, conquer 150 DSA problems, enter high-stakes contests, and track your global standing.
                </p>
              </div>
            </div>

            {/* Quick Action Triggers */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => setMatchmakingActive(!matchmakingActive)}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-xs tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 ${
                  matchmakingActive
                    ? "bg-rose-500 text-white shadow-rose-500/40 animate-pulse"
                    : "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:shadow-[0_0_35px_rgba(244,63,94,0.7)]"
                }`}
              >
                {matchmakingActive ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-spin" />
                    Searching ({matchmakingTime}s)... Cancel
                  </>
                ) : (
                  <>
                    <span>⚔️</span> Quick 1v1 Duel
                  </>
                )}
              </button>

              <button
                onClick={() => router.push("/problems")}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all flex items-center justify-center gap-2"
              >
                <span>⚡</span> Practice 150 DSA
              </button>

              <button
                onClick={() => router.push("/contests")}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>🏆</span> Contests
              </button>
            </div>
          </div>
        </Tilt3DCard>

        {/* ── HERO 3D MODULES: 1V1 BATTLE ARENA & CONTESTS (WITH FIGHTING SWORDS & FLOATING TROPHY) ── */}
        {(activeSectionTab === "ALL" || activeSectionTab === "BATTLES" || activeSectionTab === "CONTESTS") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ════════════ 3D REAL-TIME BATTLE ARENA BLOCK (FIGHTING SWORDS) ════════════ */}
            <Tilt3DCard
              glowColor="rose"
              className="p-7 md:p-8 bg-gradient-to-br from-[#180816]/90 via-[#0c1024]/90 to-[#120a22]/90 border-rose-500/30 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black uppercase tracking-wider font-mono">
                      ⚔️ 1v1 Battle Arena
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold animate-pulse">
                      LIVE COMBAT
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">±35 Rating Stakes</span>
                </div>

                {/* ── 3D CONTINUOUSLY FIGHTING SWORDS VISUAL ── */}
                <div className="relative h-44 rounded-2xl bg-black/40 border border-rose-500/20 flex items-center justify-center overflow-hidden my-2 shadow-[inset_0_0_30px_rgba(244,63,94,0.15)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.15),transparent_70%)]" />

                  {/* Left Fighter Sword (Cyan Katana) */}
                  <div className="absolute z-10 animate-sword-left flex flex-col items-center">
                    <div className="w-2.5 h-24 rounded-full bg-gradient-to-t from-cyan-400 via-blue-300 to-white shadow-[0_0_20px_#22d3ee,0_0_35px_#38bdf8] relative">
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-3 rounded bg-cyan-700 border border-cyan-300" />
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2 h-4 bg-slate-800 rounded" />
                    </div>
                  </div>

                  {/* Clash Spark Explosion */}
                  <div className="absolute z-20 animate-clash-spark flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white blur-sm opacity-90 shadow-[0_0_30px_#fff,0_0_50px_#f43f5e]" />
                    <span className="absolute text-2xl font-black text-amber-300 drop-shadow-[0_0_10px_#f59e0b]">
                      💥
                    </span>
                  </div>

                  {/* Right Fighter Sword (Crimson Blade) */}
                  <div className="absolute z-10 animate-sword-right flex flex-col items-center">
                    <div className="w-2.5 h-24 rounded-full bg-gradient-to-t from-rose-500 via-pink-400 to-white shadow-[0_0_20px_#f43f5e,0_0_35px_#ec4899] relative">
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-3 rounded bg-rose-700 border border-rose-300" />
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2 h-4 bg-slate-800 rounded" />
                    </div>
                  </div>

                  {/* Fighter Overlay */}
                  <div className="absolute top-2.5 inset-x-4 flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-lg border border-cyan-500/30 text-cyan-300">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span>{activeAccount?.username || "Player_1"} ({userStats.rating})</span>
                    </div>
                    <span className="font-black text-rose-400 text-xs">VS</span>
                    <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-lg border border-rose-500/30 text-rose-300">
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                      <span>Challenger_AI (1480)</span>
                    </div>
                  </div>

                  <div className="absolute bottom-2 inset-x-4 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-black/50 px-2.5 py-1 rounded-md border border-white/5">
                    <span>Format: 1v1 Real-Time Speed Duel</span>
                    <span className="text-emerald-400 font-bold">48 Engineers In Queue</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-rose-300 transition-colors">
                    1v1 Real-Time Speed Duels
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                    Direct live matchmaker. Two coders enter the same problem lobby; the first to submit a 100% passing solution wins rating points.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => router.push("/battles")}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all"
                >
                  Custom Lobbies &rarr;
                </button>

                <button
                  onClick={() => setMatchmakingActive(!matchmakingActive)}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                    matchmakingActive
                      ? "bg-rose-500 shadow-rose-500/40 animate-pulse"
                      : "bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.7)] hover:scale-105"
                  }`}
                >
                  {matchmakingActive ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-white animate-spin" />
                      Searching ({matchmakingTime}s)... Cancel
                    </>
                  ) : (
                    <>
                      <span>⚔️</span> Find 1v1 Match Now
                    </>
                  )}
                </button>
              </div>
            </Tilt3DCard>

            {/* ════════════ 3D CHAMPIONSHIP CONTESTS BLOCK (FLOATING TROPHY & WINNER SHEET) ════════════ */}
            <Tilt3DCard
              glowColor="amber"
              className="p-7 md:p-8 bg-gradient-to-br from-[#191307]/90 via-[#0c1024]/90 to-[#1c1208]/90 border-amber-500/30 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider font-mono">
                      🏆 Championship Contests
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                      $5,000 PRIZE POOL
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">Series #42</span>
                </div>

                {/* ── 3D FLOATING TROPHY & WINNER SHEET VISUAL ── */}
                <div className="relative h-44 rounded-2xl bg-black/40 border border-amber-500/20 flex items-center justify-around px-4 overflow-hidden my-2 shadow-[inset_0_0_30px_rgba(245,158,11,0.15)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)]" />

                  {/* 1. Floating 3D Golden Trophy */}
                  <div className="relative z-10 animate-trophy-3d flex flex-col items-center">
                    <div className="text-6xl drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]">
                      🏆
                    </div>
                    <div className="w-16 h-2 rounded-full bg-amber-500/30 blur-sm mt-1" />
                    <span className="mt-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-black font-mono border border-amber-500/30">
                      CHAMPION CUP
                    </span>
                  </div>

                  {/* 2. Floating 3D Winner Certificate Sheet */}
                  <div className="relative z-10 animate-winner-sheet">
                    <div className="w-44 p-3 rounded-xl bg-gradient-to-b from-[#fff7ed] via-[#ffedd5] to-[#fed7aa] text-slate-900 border-2 border-amber-400/80 shadow-[0_15px_30px_rgba(245,158,11,0.35)] relative overflow-hidden">
                      <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-[10px] shadow-md border border-white font-black">
                        ★
                      </div>

                      <div className="text-[9px] font-mono uppercase font-black tracking-widest text-amber-800 text-center border-b border-amber-800/20 pb-1">
                        WINNER SHEET
                      </div>

                      <div className="my-1.5 text-center">
                        <div className="text-xs font-black text-slate-950 tracking-tight">
                          RANK #1 GRANDMASTER
                        </div>
                        <div className="text-[9px] font-bold text-amber-900 font-mono">
                          Score: 1000/1000 (00:24:12)
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[8px] font-mono text-slate-700 pt-1 border-t border-amber-800/15">
                        <span>Prize: $1,500</span>
                        <span className="text-emerald-700 font-bold">+120 Elo</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-3 right-6 text-sm animate-bounce text-amber-300">✨</div>
                  <div className="absolute bottom-4 left-6 text-sm animate-pulse text-amber-400">⭐</div>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    Global Tournament Arena
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                    Scheduled competitive championships. Full server-side synchronization, automatic penalty calculations, and verified winner credentials.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-amber-400 font-mono font-bold flex items-center gap-1.5">
                  <span>⏳</span> Next Live: Sunday 8:00 PM
                </span>
                <button
                  onClick={() => router.push("/contests")}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.7)] hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  <span>🏆</span> Enter Contests &rarr;
                </button>
              </div>
            </Tilt3DCard>
          </div>
        )}

        {/* ── 3D HOLOGRAPHIC SKILL RADAR MATRIX (PROMINENT CENTERPIECE) ── */}
        <div className="max-w-3xl mx-auto w-full">
          <Tilt3DCard glowColor="purple" className="p-7 md:p-8 bg-gradient-to-b from-[#120a22]/90 via-[#0c1024]/95 to-[#0c1024]/90 border-purple-500/30 flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.9)] animate-pulse" />
                <span className="text-sm font-black tracking-tight text-white">
                  3D Holographic Skill Radar Matrix
                </span>
              </div>
              <span className="text-[11px] font-mono text-purple-300 bg-purple-500/15 px-3 py-0.5 rounded-full border border-purple-500/30 font-bold">
                Live Telemetry
              </span>
            </div>

            <div className="my-4 py-3 scale-110">
              <HolographicRadar
                stats={{
                  algorithms: Math.min(95, 50 + userStats.solved * 4),
                  dataStructures: Math.min(92, 55 + userStats.solved * 3),
                  speed: 85,
                  problemSolving: Math.min(96, 60 + userStats.solved * 3),
                  dpOptimization: Math.min(88, 40 + userStats.solved * 4),
                  mathLogic: Math.min(90, 50 + userStats.solved * 3),
                }}
              />
            </div>

            <div className="w-full pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Real-time algorithm competency & performance index</span>
              <Link href="/profile" className="text-indigo-400 hover:text-indigo-300 hover:underline font-bold flex items-center gap-1">
                <span>View Full Profile</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </Tilt3DCard>
        </div>
      </main>

      {/* ── 2026 Glassmorphism Footer ── */}
      <footer className="relative z-10 border-t border-white/10 bg-[#05070e]/80 backdrop-blur-2xl py-12 mt-12">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm">
              C
            </div>
            <span className="font-extrabold text-white text-base">
              Code<span className="text-indigo-400">Arena</span> 2026 Nexus
            </span>
          </div>

          <p className="text-xs text-slate-400 text-center md:text-left">
            &copy; 2026 CodeArena. All rights reserved. Next-generation competitive programming matrix.
          </p>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <Link href="/problems" className="hover:text-white transition-colors">
              150 Problems
            </Link>
            <Link href="/contests" className="hover:text-amber-400 transition-colors">
              Contests
            </Link>
            <Link href="/battles" className="hover:text-rose-400 transition-colors">
              1v1 Battles
            </Link>
            <Link href="/leaderboard" className="hover:text-indigo-400 transition-colors">
              Leaderboard
            </Link>
            <Link href="/admin" className="hover:text-cyan-400 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
