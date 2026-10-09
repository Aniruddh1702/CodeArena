"use client";

import { useEffect, useState, useRef, MouseEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getLeaderboards } from "@/lib/leaderboard-data";
import { getActiveAccount, getUserStats, updateActiveAccount, UserAccount } from "@/lib/auth-session";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { NotificationCenter } from "@/components/NotificationCenter";

interface UserProfile {
  name: string;
  username: string;
  email?: string;
  bio: string;
  organization: string;
  github: string;
  joinedDate: string;
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

// ── Profile Holographic Radar Matrix ──
function ProfileRadarChart({
  stats,
}: {
  stats: {
    algorithms: number;
    dataStructures: number;
    speed: number;
    problemSolving: number;
    dpOptimization: number;
    mathLogic: number;
  };
}) {
  const size = 240;
  const center = size / 2;
  const radius = 88;

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
    const r = (Math.min(100, Math.max(20, skill.value)) / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle, skill };
  });

  const polygonPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible select-none">
        {[0.25, 0.5, 0.75, 1].map((lvl, idx) => (
          <polygon
            key={idx}
            points={Array.from({ length: totalPoints })
              .map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const r = radius * lvl;
                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
              })
              .join(" ")}
            fill={idx === 3 ? "rgba(99, 102, 241, 0.04)" : "none"}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
            strokeDasharray={idx < 3 ? "3 3" : undefined}
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
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

        <path
          d={polygonPath}
          fill="url(#profileRadarGrad)"
          stroke="#818cf8"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]"
        />

        <defs>
          <radialGradient id="profileRadarGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.55)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.15)" />
          </radialGradient>
        </defs>

        {points.map((p, idx) => {
          const labelDist = radius + 20;
          const lx = center + labelDist * Math.cos(p.angle);
          const ly = center + labelDist * Math.sin(p.angle);

          return (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill={p.skill.color}
                stroke="#ffffff"
                strokeWidth="1.5"
                className="drop-shadow-[0_0_8px_rgba(99,102,241,0.9)] transition-all duration-700"
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#cbd5e1"
                fontSize="9"
                fontWeight="700"
                className="font-mono tracking-tight"
              >
                {p.skill.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    name: "CodeArena Student",
    username: "student",
    bio: "Passionate competitive programmer & software engineer. Mastering advanced algorithms, system design, and competitive DSA.",
    organization: "CodeArena Academy",
    github: "codearena-student",
    joinedDate: "October 2026",
  });

  const [dsaRating, setDsaRating] = useState(1450);
  const [globalRank, setGlobalRank] = useState(1);
  const [solvedCount, setSolvedCount] = useState(0);
  const [accuracy, setAccuracy] = useState(85.5);
  const [currentStreak, setCurrentStreak] = useState(1);
  const [recentSolves, setRecentSolves] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadProfile = () => {
    if (typeof window === "undefined") return;
    const active = getActiveAccount();
    if (!active) {
      router.push("/login?redirect=/profile");
      return;
    }

    const activeProfile: UserProfile = {
      name: active.name || active.username,
      username: active.username,
      email: active.email,
      bio: active.bio || "Competitive Programmer & DSA Enthusiast",
      organization: active.college || "CodeArena University",
      github: active.github || active.username,
      joinedDate: "October 2026",
    };

    setProfile(activeProfile);
    setEditForm(activeProfile);

    // Isolated stats for this account
    const stats = getUserStats(active.id);
    setSolvedCount(stats.problemsSolved);
    setDsaRating(stats.dsaRating);
    setAccuracy(stats.problemsSolved > 0 ? 88.4 : 0.0);
    setCurrentStreak(stats.problemsSolved > 0 ? 2 : 0);
    setRecentSolves(stats.recentActivity);

    // Dynamic global rank
    const lb = getLeaderboards({
      username: active.username,
      name: active.name,
      org: activeProfile.organization,
      score: stats.dsaRating,
      problemsSolved: stats.problemsSolved,
    });
    setGlobalRank(lb.currentUserGlobalRank);
  };

  useEffect(() => {
    loadProfile();

    const handleAccountChange = () => {
      loadProfile();
    };

    window.addEventListener("codearena_account_changed", handleAccountChange);
    return () => {
      window.removeEventListener("codearena_account_changed", handleAccountChange);
    };
  }, [router]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    if (typeof window !== "undefined") {
      localStorage.setItem("userProfile", JSON.stringify(editForm));
      updateActiveAccount({
        name: editForm.name,
        username: editForm.username,
        bio: editForm.bio,
        college: editForm.organization,
        github: editForm.github,
      });
    }
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getRatingTier = (rating: number) => {
    if (rating >= 2200) return { title: "Grandmaster", color: "text-rose-400", bg: "from-rose-500 to-red-700", glow: "rose" as const, nextTier: "Legendary", nextRating: 2400 };
    if (rating >= 1900) return { title: "Candidate Master", color: "text-purple-400", bg: "from-purple-500 to-indigo-700", glow: "purple" as const, nextTier: "Grandmaster", nextRating: 2200 };
    if (rating >= 1600) return { title: "Expert", color: "text-blue-400", bg: "from-blue-500 to-cyan-700", glow: "blue" as const, nextTier: "Candidate Master", nextRating: 1900 };
    if (rating >= 1400) return { title: "Specialist", color: "text-cyan-400", bg: "from-cyan-500 to-teal-700", glow: "cyan" as const, nextTier: "Expert", nextRating: 1600 };
    if (rating >= 1200) return { title: "Pupil", color: "text-emerald-400", bg: "from-emerald-500 to-green-700", glow: "emerald" as const, nextTier: "Specialist", nextRating: 1400 };
    return { title: "Newbie", color: "text-slate-400", bg: "from-slate-500 to-gray-700", glow: "indigo" as const, nextTier: "Pupil", nextRating: 1200 };
  };

  const tier = getRatingTier(dsaRating);

  // Generate 90-day heatmap grid
  const heatmapData = useMemo(() => {
    const weeks = 14;
    const days = 7;
    const grid: { level: number; date: string; solves: number }[][] = [];

    const now = new Date();
    for (let w = 0; w < weeks; w++) {
      const weekCols = [];
      for (let d = 0; d < days; d++) {
        const dayOffset = (weeks - 1 - w) * 7 + (6 - d);
        const cellDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
        const seed = (w * 7 + d * 3 + solvedCount) % 19;
        let level = 0;
        let solves = 0;

        if (seed > 14) {
          level = 3;
          solves = 4;
        } else if (seed > 10) {
          level = 2;
          solves = 2;
        } else if (seed > 6 || (w === weeks - 1 && d === days - 1 && solvedCount > 0)) {
          level = 1;
          solves = 1;
        }

        weekCols.push({
          level,
          solves,
          date: cellDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        });
      }
      grid.push(weekCols);
    }
    return grid;
  }, [solvedCount]);

  const levelColors = [
    "bg-white/[0.04] border-white/5",
    "bg-emerald-500/30 border-emerald-500/40 shadow-[0_0_6px_rgba(16,185,129,0.3)]",
    "bg-emerald-500/60 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
    "bg-emerald-400 border-white shadow-[0_0_14px_rgba(52,211,153,0.8)]",
  ];

  const radarStats = {
    algorithms: Math.min(95, 45 + solvedCount * 5),
    dataStructures: Math.min(92, 50 + solvedCount * 4),
    speed: Math.min(88, 60 + solvedCount * 3),
    problemSolving: Math.min(96, 55 + solvedCount * 4),
    dpOptimization: Math.min(85, 35 + solvedCount * 5),
    mathLogic: Math.min(90, 48 + solvedCount * 4),
  };

  const achievements = [
    { name: "First Blood", desc: "Successfully solved your first algorithmic challenge", icon: "🎯", unlocked: solvedCount > 0, rarity: "COMMON", xp: "+100 XP" },
    { name: "Arena Gladiator", desc: "Competed in real-time 1v1 Battle Arena", icon: "⚔️", unlocked: true, rarity: "RARE", xp: "+250 XP" },
    { name: "Specialist Rank", desc: "Surpassed 1400+ competitive DSA rating", icon: "🏆", unlocked: dsaRating >= 1400, rarity: "EPIC", xp: "+500 XP" },
    { name: "Speed Demon", desc: "Submitted an accepted solution under 50ms", icon: "⚡", unlocked: true, rarity: "RARE", xp: "+300 XP" },
    { name: "Problem Crusher", desc: "Solved 10+ Data Structures problems", icon: "💎", unlocked: solvedCount >= 10, rarity: "LEGENDARY", xp: "+1000 XP" },
    { name: "Consistency King", desc: "Maintained a 7-day active coding streak", icon: "🔥", unlocked: currentStreak >= 7, rarity: "EPIC", xp: "+600 XP" },
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-foreground selection:bg-indigo-500/30 relative overflow-x-hidden">
      <CyberMesh3D />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-[20%] w-[650px] h-[650px] rounded-full bg-indigo-600/15 blur-[140px] animate-glow-pulse" />
        <div className="absolute top-[35%] -right-[10%] w-[550px] h-[550px] rounded-full bg-purple-600/15 blur-[150px] animate-glow-pulse" />
        <div className="absolute bottom-[10%] left-[10%] w-[550px] h-[550px] rounded-full bg-cyan-600/12 blur-[140px] animate-glow-pulse" />
      </div>

      {/* Header */}
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
            <Link href="/dashboard" className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
              Dashboard
            </Link>
            <Link href="/problems" className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
              Practice (150 DSA)
            </Link>
            <Link href="/contests" className="px-4 py-1.5 rounded-full text-xs font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 flex items-center gap-1.5 transition-all">
              <span>🏆</span> Contests
            </Link>
            <Link href="/battles" className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
              Battles
            </Link>
            <Link href="/leaderboard" className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
              Leaderboard
            </Link>
            <Link href="/profile" className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-white/10 shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all">
              Profile
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <NotificationCenter />
            <AccountSwitcher />
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8 space-y-8 max-w-6xl">
        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <span>✓</span> Profile details updated successfully!
          </div>
        )}

        {/* ── 3D Profile Hero Hologram Card ── */}
        <TiltCard glowColor={tier.glow} className="p-6 md:p-8 bg-gradient-to-r from-indigo-950/50 via-card/85 to-purple-950/50 border-indigo-500/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* 3D Holographic Avatar Crystal */}
              <div className="relative group shrink-0">
                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr ${tier.bg} p-1 shadow-[0_0_40px_rgba(99,102,241,0.5)] animate-float-3d flex items-center justify-center`}>
                  <div className="w-full h-full rounded-2xl bg-[#0b0e1b] flex items-center justify-center text-3xl sm:text-4xl font-black text-white">
                    {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2) || "U"}
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-black text-black shadow-lg">
                  ONLINE
                </span>
              </div>

              {/* Profile Identity Text */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    {profile.name}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/5 border border-white/10 ${tier.color} shadow-sm`}>
                    ✦ {tier.title}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
                    Global Rank #{globalRank}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-mono">
                  @{profile.username} • {profile.organization}
                </p>

                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed pt-1">
                  {profile.bio}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 font-mono">
                  <span>📅 Joined {profile.joinedDate}</span>
                  {profile.github && (
                    <span className="text-indigo-400 hover:underline">
                      🐙 github.com/{profile.github}
                    </span>
                  )}
                  {profile.email && (
                    <span>✉️ {profile.email}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>✏️</span> {isEditing ? "Close Editor" : "Edit Profile"}
              </button>

              <button
                onClick={() => router.push("/problems")}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <span>⚡</span> Practice DSA
              </button>
            </div>
          </div>
        </TiltCard>

        {/* Edit Profile Drawer */}
        {isEditing && (
          <TiltCard glowColor="purple" className="p-6 bg-card/95 border-purple-500/40 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <span>🛠️</span> Edit Profile Information
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Update your public persona, organization, bio, and social handles across CodeArena.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Full Name</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                    className="w-full h-9 rounded-xl bg-white/5 border border-white/10 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Username</label>
                  <input
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    required
                    className="w-full h-9 rounded-xl bg-white/5 border border-white/10 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Organization / University</label>
                  <input
                    value={editForm.organization}
                    onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                    className="w-full h-9 rounded-xl bg-white/5 border border-white/10 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">GitHub Handle</label>
                  <input
                    value={editForm.github}
                    onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                    className="w-full h-9 rounded-xl bg-white/5 border border-white/10 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-md shadow-indigo-600/30"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </TiltCard>
        )}

        {/* ── 4 3D Hologram Metric Cubes ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <TiltCard glowColor="indigo" className="p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                DSA Rating
              </span>
              <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                Rank #{globalRank}
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-400">
              {dsaRating}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px]">
              <span className={`font-bold ${tier.color}`}>✦ {tier.title}</span>
              <span className="text-slate-400">Target: {tier.nextRating} pts</span>
            </div>
          </TiltCard>

          <TiltCard glowColor="emerald" className="p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                Problems Solved
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">+15 pts / solve</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-200 to-emerald-400">
              {solvedCount}
              <span className="text-lg font-normal text-slate-500 ml-1.5">/ 150</span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(6, (solvedCount / 150) * 100))}%` }}
                />
              </div>
            </div>
          </TiltCard>

          <TiltCard glowColor="purple" className="p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                Accuracy Rate
              </span>
              <span className="text-purple-400 text-[11px] font-semibold">Precision</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-pink-400">
              {accuracy}%
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400">
              <span>Verified Submissions</span>
              <span className="text-purple-300 font-semibold">High Precision</span>
            </div>
          </TiltCard>

          <TiltCard glowColor="amber" className="p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                Active Streak
              </span>
              <span className="text-amber-400 text-[11px] font-semibold">Momentum</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-amber-200 to-orange-400 flex items-center gap-2">
              {currentStreak} <span className="text-2xl drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">🔥</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400">
              <span>Daily Habits</span>
              <span className="text-amber-300 font-semibold">Level Up!</span>
            </div>
          </TiltCard>
        </div>

        {/* ── Main 2-Column Visual Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (7 cols): Holographic Skill Radar & Telemetry Heatmap */}
          <div className="lg:col-span-7 space-y-6">
            <TiltCard glowColor="indigo" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🔮</span> Algorithmic Skill Radar
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live multi-axis evaluation of cognitive and algorithmic execution metrics.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  Telemetry Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="flex justify-center">
                  <ProfileRadarChart stats={radarStats} />
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      <span className="text-xs font-bold text-white">Algorithms & Complexity</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-400">{radarStats.algorithms}%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-white">Data Structures</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">{radarStats.dataStructures}%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-xs font-bold text-white">Speed & Execution</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">{radarStats.speed}%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                      <span className="text-xs font-bold text-white">Dynamic Programming</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-pink-400">{radarStats.dpOptimization}%</span>
                  </div>
                </div>
              </div>

              {/* 90-Day Activity Heatmap */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <span>🗓️</span> 90-Day Submission Matrix
                  </span>
                  <span className="font-mono text-emerald-400">{solvedCount > 0 ? `${solvedCount + 8} contributions` : "Active Coder"}</span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {heatmapData.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1.5">
                      {week.map((day, dIdx) => (
                        <div
                          key={dIdx}
                          title={`${day.date}: ${day.solves} solves`}
                          className={`w-3.5 h-3.5 rounded-[4px] border transition-all duration-300 hover:scale-125 cursor-pointer ${levelColors[day.level]}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-white/[0.05]" />
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/30" />
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/60" />
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
                    <span>More</span>
                  </div>
                  <span className="font-mono text-slate-400">Consistent Daily Progress</span>
                </div>
              </div>
            </TiltCard>

            {/* Recent Solves Console */}
            <TiltCard glowColor="emerald" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚡</span>
                  <h3 className="text-base font-bold text-white">Recent Accepted Solutions</h3>
                </div>
                <button
                  onClick={() => router.push("/problems")}
                  className="text-xs font-semibold text-emerald-400 hover:underline"
                >
                  Explore DSA Arena &rarr;
                </button>
              </div>

              {recentSolves.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs space-y-2">
                  <span className="text-2xl block">🎯</span>
                  <p>No recent submissions logged yet.</p>
                  <button
                    onClick={() => router.push("/problems")}
                    className="mt-1 text-indigo-400 hover:underline font-semibold"
                  >
                    Solve your first problem &rarr;
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentSolves.map((solve, i) => (
                    <div
                      key={i}
                      onClick={() => router.push(solve.slug ? `/problems/${solve.slug}` : "/problems")}
                      className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <div>
                          <p className="text-xs font-bold text-white hover:text-indigo-300 transition-colors">
                            {solve.title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {solve.date || "Just now"} • {solve.runtime || "38ms"} runtime
                          </p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {solve.language || "JavaScript"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </TiltCard>
          </div>

          {/* Right Column (5 cols): 3D Badges & Achievements Hall of Fame */}
          <div className="lg:col-span-5 space-y-6">
            <TiltCard glowColor="purple" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🏅</span> Badges & Honors Hall
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Collectible milestones unlocked through arena conquests.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  {achievements.filter((a) => a.unlocked).length} / {achievements.length} Unlocked
                </span>
              </div>

              <div className="space-y-3">
                {achievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all ${
                      ach.unlocked
                        ? "bg-white/[0.04] border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                        : "bg-white/[0.01] border-white/5 opacity-40 grayscale"
                    }`}
                  >
                    <div className="text-2xl p-2.5 rounded-xl bg-card border border-white/10 shrink-0 shadow-md">
                      {ach.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs text-white">{ach.name}</p>
                          {ach.unlocked && <span className="text-[11px] text-emerald-400">✓</span>}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-400">
                          {ach.xp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{ach.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </div>
        </div>
      </main>
    </div>
  );
}
