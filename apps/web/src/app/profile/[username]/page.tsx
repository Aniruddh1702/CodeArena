"use client";

import { useEffect, useState, useRef, MouseEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getPublicProfileData, LeaderboardUser } from "@/lib/leaderboard-data";
import { getActiveAccount, getUserStats } from "@/lib/auth-session";
import { NotificationCenter } from "@/components/NotificationCenter";
import { AccountSwitcher } from "@/components/AccountSwitcher";

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

    const particleCount = 45;
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

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  const router = useRouter();
  const [profile, setProfile] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let currentUserStats: any = undefined;

    if (typeof window !== "undefined") {
      const active = getActiveAccount();
      const activeId = active?.id || "default";
      const stats = getUserStats(activeId);

      currentUserStats = {
        username: active?.username || "student",
        name: active?.name || "CodeArena Student",
        org: active?.college || "CodeArena Academy",
        score: stats.dsaRating,
        problemsSolved: stats.problemsSolved,
      };
    }

    const localData = getPublicProfileData(params.username, currentUserStats);
    if (localData) {
      setProfile(localData);
      setLoading(false);
    }

    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.success && Array.isArray(resData.items)) {
          const match = resData.items.find(
            (u: any) => u.username?.toLowerCase() === (params.username || "").toLowerCase()
          );
          if (match) {
            setProfile((prev) => ({
              ...(prev || {}),
              userId: match.userId || match.id,
              username: match.username,
              name: match.name,
              score: match.score || 1450,
              problemsSolved: match.problemsSolved || 0,
              accuracy: (match.problemsSolved || 0) > 0 ? 88.0 : 0.0,
              tier: match.score >= 1900 ? "Candidate Master" : match.score >= 1600 ? "Expert" : match.score >= 1400 ? "Specialist" : "Pupil",
              org: match.org || "CodeArena Academy",
              bio: `Competitive programmer @${match.username} on CodeArena.`,
              joinedAt: "Registered Coder",
            } as LeaderboardUser));
          } else if (!localData) {
            setProfile(null);
          }
        } else if (!localData) {
          setProfile(null);
        }
      })
      .catch(() => {
        if (!localData) {
          setProfile(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070913] flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 animate-spin blur-md opacity-70" />
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest animate-pulse">
            Fetching Profile Telemetry...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#070913] text-foreground selection:bg-indigo-500/30 relative overflow-x-hidden flex flex-col justify-between">
        <CyberMesh3D />

        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-[20%] left-[20%] w-[650px] h-[650px] rounded-full bg-rose-600/10 blur-[150px] animate-glow-pulse" />
          <div className="absolute top-[35%] -right-[10%] w-[550px] h-[550px] rounded-full bg-purple-600/12 blur-[150px] animate-glow-pulse" />
          <div className="absolute bottom-[10%] left-[10%] w-[550px] h-[550px] rounded-full bg-indigo-600/10 blur-[140px] animate-glow-pulse" />
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/leaderboard")}
                className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all"
              >
                ← Back to Leaderboard
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all"
              >
                My Dashboard
              </button>
            </div>
          </div>
        </header>

        {/* Main 404 Container */}
        <main className="relative z-10 container mx-auto px-6 py-20 flex items-center justify-center flex-1">
          <div className="w-full max-w-lg">
            <TiltCard glowColor="rose" className="p-8 md:p-10 border-rose-500/30 bg-gradient-to-b from-card/90 via-card/80 to-[#0e101f]/90 text-center">
              <div className="flex flex-col items-center gap-5">
                {/* 404 Visual Icon */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-500/20 via-purple-500/20 to-indigo-500/20 border border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.3)] flex items-center justify-center">
                    <span className="text-3xl select-none">👤❓</span>
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md bg-rose-500/30 border border-rose-500/60 text-[10px] font-mono font-bold text-rose-300">
                    404
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-semibold">
                    <span>STATUS: PROFILE_NOT_FOUND</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    User Not Found
                  </h1>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                    No active coder profile found for{" "}
                    <span className="font-mono font-bold text-slate-200 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      @{params.username}
                    </span>
                    . The coder may have deleted their account, changed handles, or never existed.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-3">
                  <button
                    onClick={() => router.push("/leaderboard")}
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Return to Leaderboard</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-sm transition-all hover:border-white/20"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </TiltCard>
          </div>
        </main>

        <footer className="relative z-10 border-t border-white/5 py-4 text-center text-xs text-muted-foreground">
          CodeArena Telemetry Protocol • Active Status System
        </footer>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const getRatingTier = (rating: number) => {
    if (rating >= 2200) return { title: "Grandmaster", color: "text-rose-400", bg: "from-rose-500 to-red-700", glow: "rose" as const };
    if (rating >= 1900) return { title: "Candidate Master", color: "text-purple-400", bg: "from-purple-500 to-indigo-700", glow: "purple" as const };
    if (rating >= 1600) return { title: "Expert", color: "text-blue-400", bg: "from-blue-500 to-cyan-700", glow: "blue" as const };
    if (rating >= 1400) return { title: "Specialist", color: "text-cyan-400", bg: "from-cyan-500 to-teal-700", glow: "cyan" as const };
    if (rating >= 1200) return { title: "Pupil", color: "text-emerald-400", bg: "from-emerald-500 to-green-700", glow: "emerald" as const };
    return { title: "Newbie", color: "text-slate-400", bg: "from-slate-500 to-gray-700", glow: "indigo" as const };
  };

  const tier = getRatingTier(profile.score);

  const achievements = [
    { name: "First Blood", desc: "Solved an algorithm challenge", icon: "🎯", unlocked: profile.problemsSolved > 0, xp: "+100 XP" },
    { name: "Specialist Rank", desc: "Reached 1400+ competitive rating", icon: "🏆", unlocked: profile.score >= 1400, xp: "+500 XP" },
    { name: "Algorithm Master", desc: "Solved multiple core DSA challenges", icon: "💎", unlocked: profile.problemsSolved >= 5, xp: "+800 XP" },
    { name: "Arena Contender", desc: "Competed in live arena matches", icon: "⚔️", unlocked: true, xp: "+300 XP" },
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/leaderboard")}
              className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all"
            >
              ← Back to Leaderboard
            </button>
            {profile.isCurrentUser ? (
              <button
                onClick={() => router.push("/profile")}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/30"
              >
                Edit My Profile
              </button>
            ) : (
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all"
              >
                My Dashboard
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8 space-y-8 max-w-5xl">
        <TiltCard glowColor={tier.glow} className="p-6 md:p-8 bg-gradient-to-r from-indigo-950/50 via-card/85 to-purple-950/50 border-indigo-500/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative shrink-0">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${tier.bg} p-1 shadow-[0_0_35px_rgba(99,102,241,0.4)] flex items-center justify-center`}>
                <div className="w-full h-full rounded-2xl bg-[#0b0e1b] flex items-center justify-center text-3xl font-black text-white">
                  {initials}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.name}</h1>
                <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/5 border border-white/10 ${tier.color}`}>
                  ✦ {tier.title}
                </span>
                {profile.isCurrentUser && (
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    You
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-mono">
                @{profile.username} • {profile.org}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                {profile.bio || `Competitive programmer @${profile.username} solving algorithmic challenges.`}
              </p>
            </div>
          </div>
        </TiltCard>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <TiltCard glowColor="indigo" className="p-5">
            <p className="text-xs text-slate-400 font-semibold mb-1">DSA Rating</p>
            <p className="text-3xl font-black text-indigo-400">{profile.score}</p>
            <span className={`text-[11px] font-bold ${tier.color}`}>✦ {tier.title}</span>
          </TiltCard>

          <TiltCard glowColor="emerald" className="p-5">
            <p className="text-xs text-slate-400 font-semibold mb-1">Problems Solved</p>
            <p className="text-3xl font-black text-emerald-400">{profile.problemsSolved}</p>
            <span className="text-[11px] text-slate-400">/ 150 Core DSA</span>
          </TiltCard>

          <TiltCard glowColor="purple" className="p-5">
            <p className="text-xs text-slate-400 font-semibold mb-1">Accuracy Rate</p>
            <p className="text-3xl font-black text-purple-400">{profile.accuracy}%</p>
            <span className="text-[11px] text-slate-400">Submission Precision</span>
          </TiltCard>
        </div>

        {/* Honors & Achievements */}
        <TiltCard glowColor="purple" className="p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span>🏅</span> Achievements & Honors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {achievements.map((ach, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                  ach.unlocked
                    ? "bg-white/[0.04] border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                    : "bg-white/[0.01] border-white/5 opacity-40 grayscale"
                }`}
              >
                <div className="text-2xl p-2 rounded-xl bg-card border border-white/10 shrink-0 shadow-md">
                  {ach.icon}
                </div>
                <div>
                  <p className="font-bold text-xs text-white">{ach.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </TiltCard>
      </main>
    </div>
  );
}
