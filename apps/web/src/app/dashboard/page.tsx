"use client";

import { useEffect, useState, useRef, MouseEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getLeaderboards } from "@/lib/leaderboard-data";
import { getActiveAccount, getUserStats, UserAccount } from "@/lib/auth-session";
import { getContests, Contest } from "@/lib/contests-data";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { NotificationCenter } from "@/components/NotificationCenter";

// ── 3D Interactive Tilt Card Component with Depth Parallax ──
function TiltCard({
  children,
  className = "",
  glowColor = "indigo",
  maxTilt = 8,
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
    indigo: "rgba(99, 102, 241, 0.28)",
    emerald: "rgba(16, 185, 129, 0.28)",
    purple: "rgba(168, 85, 247, 0.28)",
    blue: "rgba(59, 130, 246, 0.28)",
    amber: "rgba(245, 158, 11, 0.28)",
    rose: "rgba(244, 63, 94, 0.28)",
    cyan: "rgba(6, 182, 212, 0.28)",
  };

  const borderMap: Record<string, string> = {
    indigo: "hover:border-indigo-500/60 hover:shadow-[0_20px_45px_rgba(99,102,241,0.25)]",
    emerald: "hover:border-emerald-500/60 hover:shadow-[0_20px_45px_rgba(16,185,129,0.25)]",
    purple: "hover:border-purple-500/60 hover:shadow-[0_20px_45px_rgba(168,85,247,0.25)]",
    blue: "hover:border-blue-500/60 hover:shadow-[0_20px_45px_rgba(59,130,246,0.25)]",
    amber: "hover:border-amber-500/60 hover:shadow-[0_20px_45px_rgba(245,158,11,0.25)]",
    rose: "hover:border-rose-500/60 hover:shadow-[0_20px_45px_rgba(244,63,94,0.25)]",
    cyan: "hover:border-cyan-500/60 hover:shadow-[0_20px_45px_rgba(6,182,212,0.25)]",
  };

  return (
    <div style={{ perspective: "1200px" }} className="w-full h-full">
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${sheen.opacity ? "16px" : "0px"})`,
          transition: sheen.opacity ? "transform 0.08s ease-out" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          transformStyle: "preserve-3d",
        }}
        className={`relative rounded-2xl border border-white/10 bg-card/85 backdrop-blur-2xl shadow-[0_12px_35px_rgba(0,0,0,0.4)] transition-all duration-300 overflow-hidden ${borderMap[glowColor]} ${className}`}
      >
        {/* Dynamic 3D Specular Light Reflection */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-10"
          style={{
            opacity: sheen.opacity,
            background: `radial-gradient(circle 360px at ${sheen.x}% ${sheen.y}%, ${glowMap[glowColor]}, transparent 75%)`,
          }}
        />

        {/* 3D Content Container with true depth */}
        <div className="relative z-20 w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── 3D Ambient Particle Grid Canvas Horizon ──
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

// ── 3D Dashboard Holographic Arena Skill Radar Matrix ──
function DashboardRadarChart({
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
  const size = 220;
  const center = size / 2;
  const radius = 76;

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
            fill={idx === 3 ? "rgba(99, 102, 241, 0.05)" : "none"}
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
          fill="url(#dashRadarGrad)"
          stroke="#818cf8"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]"
        />

        <defs>
          <radialGradient id="dashRadarGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.6)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.15)" />
          </radialGradient>
        </defs>

        {points.map((p, idx) => {
          const labelDist = radius + 18;
          const lx = center + labelDist * Math.cos(p.angle);
          const ly = center + labelDist * Math.sin(p.angle);

          return (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r="3.5"
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
                fill="#94a3b8"
                fontSize="8.5"
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
    if (rating >= 2200) return { title: "Grandmaster", color: "text-rose-400", bg: "from-rose-500 to-red-700", glow: "rose" as const, nextRating: 2400 };
    if (rating >= 1900) return { title: "Candidate Master", color: "text-purple-400", bg: "from-purple-500 to-indigo-700", glow: "purple" as const, nextRating: 2200 };
    if (rating >= 1600) return { title: "Expert", color: "text-blue-400", bg: "from-blue-500 to-cyan-700", glow: "blue" as const, nextRating: 1900 };
    if (rating >= 1400) return { title: "Specialist", color: "text-cyan-400", bg: "from-cyan-500 to-teal-700", glow: "cyan" as const, nextRating: 1600 };
    if (rating >= 1200) return { title: "Pupil", color: "text-emerald-400", bg: "from-emerald-500 to-green-700", glow: "emerald" as const, nextRating: 1400 };
    return { title: "Newbie", color: "text-slate-400", bg: "from-slate-500 to-gray-700", glow: "indigo" as const, nextRating: 1200 };
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
          radarStats: {
            algorithms: Math.min(95, 45 + solvedCount * 5),
            dataStructures: Math.min(92, 50 + solvedCount * 4),
            speed: Math.min(88, 60 + solvedCount * 3),
            problemSolving: Math.min(96, 55 + solvedCount * 4),
            dpOptimization: Math.min(85, 35 + solvedCount * 5),
            mathLogic: Math.min(90, 48 + solvedCount * 4),
          },
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
              icon: "🛡️",
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
              icon: "🌳",
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
              icon: "🕸️",
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
              icon: "🧠",
            },
          ],
          companyTracks: [
            { name: "Google Top 50", icon: "🔴", count: "50 Questions", glow: "blue" as const },
            { name: "Meta Fast-Track", icon: "🔵", count: "40 Questions", glow: "indigo" as const },
            { name: "Amazon High-Freq", icon: "🟠", count: "45 Questions", glow: "amber" as const },
            { name: "Microsoft Core", icon: "🟢", count: "35 Questions", glow: "emerald" as const },
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
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 animate-spin blur-md opacity-70" />
            <div className="relative h-full w-full rounded-2xl bg-card border border-white/20 flex items-center justify-center text-primary text-xl font-black">
              C
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
            Constructing 3D Arena Station...
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
    <div className="min-h-screen bg-[#070913] text-foreground selection:bg-indigo-500/30 relative overflow-x-hidden">
      {/* 3D Ambient Particle Mesh Horizon */}
      <CyberMesh3D />

      {/* Ambient 3D Lighting Glow Spheres */}
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
            <Link
              href="/profile"
              className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Profile
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <NotificationCenter />
            <AccountSwitcher />
          </div>
        </div>
      </header>

      {/* Main 3D Interactive Container */}
      <main className="relative z-10 container mx-auto px-6 py-8 space-y-8 max-w-7xl">
        {/* ── 3D HERO COMMAND BRIDGE ── */}
        <TiltCard glowColor={tier.glow} className="p-6 md:p-8 bg-gradient-to-r from-indigo-950/50 via-card/85 to-purple-950/50 border-indigo-500/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* 3D Tier Crystal Hologram */}
              <div className="relative shrink-0">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr ${tier.bg} p-1 shadow-[0_0_35px_rgba(99,102,241,0.5)] animate-float-3d flex items-center justify-center`}>
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
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border border-white/10 ${tier.color} bg-white/5`}>
                    ✦ {tier.title}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
                    Rank #{data.userRank}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-300 max-w-xl">
                  Next-generation 3D interactive arena. Enter live 1v1 duels, conquer algorithm milestones, and climb global leaderboards.
                </p>
              </div>
            </div>

            {/* 3D Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => router.push("/problems")}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-bold text-xs tracking-wide shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] transition-all flex items-center justify-center gap-2"
              >
                <span>⚡</span> Practice (150 DSA)
              </button>

              <button
                onClick={() => router.push("/battles")}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-card/80 hover:bg-white/10 border border-white/15 text-slate-200 font-bold text-xs hover:border-purple-500/50 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <span>⚔️</span> 1v1 Battle Arena
              </button>
            </div>
          </div>
        </TiltCard>

        {/* ── 4 DISTINCT 3D HOLOGRAM METRIC CUBES (JUST LIKE PROFILE) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <TiltCard glowColor="indigo" className="p-5">
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

          <TiltCard glowColor="emerald" className="p-5">
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
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px]">
              <span className="text-slate-300">Acceptance Rate</span>
              <span className="font-mono text-emerald-400 font-bold">{data.accuracy}%</span>
            </div>
          </TiltCard>

          <TiltCard glowColor="purple" className="p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                Global Standing
              </span>
              <span className="text-purple-400 font-mono text-[11px]">Top 5%</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400">
              #{data.userRank}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px]">
              <span className="text-slate-300">Competitive Division</span>
              <Link href="/leaderboard" className="text-indigo-400 hover:underline font-bold">
                Leaderboard &rarr;
              </Link>
            </div>
          </TiltCard>

          <TiltCard glowColor="amber" className="p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                Daily Streak
              </span>
              <span className="text-amber-400 font-mono text-[11px]">Active</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-amber-200 to-amber-400 flex items-center gap-2">
              {data.currentStreak} <span className="text-2xl">🔥</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px]">
              <span className="text-slate-300">XP Multiplier</span>
              <span className="font-mono text-amber-400 font-bold">1.5x Boost</span>
            </div>
          </TiltCard>
        </div>

        {/* ── SECTION 1: 3D DUAL LIVE COMBAT & CONTEST ARENA ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card A: 3D 1v1 Matchmaking Duelist */}
          <TiltCard glowColor="purple" className="p-6 bg-gradient-to-br from-purple-950/40 via-card/90 to-card/90 border-purple-500/30 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(168,85,247,0.4)] animate-float-3d">
                    ⚔️
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
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
                onClick={() => setMatchmakingActive(!matchmakingActive)}
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

          {/* Card B: 3D Live Contest Stage */}
          {liveContest ? (
            <TiltCard glowColor="amber" className="p-6 bg-gradient-to-br from-amber-950/40 via-card/90 to-card/90 border-amber-500/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-float-3d">
                      🏆
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        {liveContest.title}
                      </h2>
                      <p className="text-xs text-slate-400 line-clamp-1">{liveContest.description}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      liveContest.status === "LIVE"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {liveContest.status === "LIVE" ? "● LIVE NOW" : "⏱️ UPCOMING"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
                    <span className="text-xs font-black text-white">{liveContest.problems.length} Challenges</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrolled</span>
                    <span className="text-xs font-black text-amber-300">{Math.max(liveContest.participantsCount, (liveContest.registeredUsers || []).length)} Users</span>
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
                  ⏱️ {liveContest.durationMinutes}m Tournament Arena
                </span>

                <button
                  onClick={() => router.push(`/contests/${liveContest.id}`)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>🏆</span> Enter Arena
                </button>
              </div>
            </TiltCard>
          ) : (
            <TiltCard glowColor="blue" className="p-6 bg-gradient-to-br from-blue-950/30 via-card/90 to-card/90 border-blue-500/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(59,130,246,0.4)] animate-float-3d">
                    🏆
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Upcoming Tournament Arena</h2>
                    <p className="text-xs text-slate-400">No active contest at the moment. Explore the 150 DSA bank or check back soon.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">150 Curated Problems Ready</span>
                <button
                  onClick={() => router.push("/problems")}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Practice Problems &rarr;
                </button>
              </div>
            </TiltCard>
          )}
        </div>

        {/* ── SECTION 2: 3D POTD CHALLENGE & 3D HOLOGRAPHIC RADAR STAGE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Problem of the Day (7 cols) */}
          <div className="lg:col-span-7">
            <TiltCard glowColor="indigo" className="p-6 bg-gradient-to-r from-indigo-950/40 via-card/90 to-card/90 border-indigo-500/30 flex flex-col justify-between h-full">
              <div className="space-y-3">
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

                <h3 className="text-xl font-black text-white">
                  {data.dailyChallenge.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {data.dailyChallenge.snippet}
                </p>

                <div className="flex items-center gap-2 pt-2 flex-wrap">
                  {data.dailyChallenge.topics.map((t: string, i: number) => (
                    <span key={i} className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  +200 XP upon passing test cases
                </span>

                <button
                  onClick={() => router.push(`/problems/${data.dailyChallenge.slug}`)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all flex items-center justify-center gap-2"
                >
                  <span>🚀</span> Solve Daily Challenge
                </button>
              </div>
            </TiltCard>
          </div>

          {/* 3D Holographic Skill Matrix Radar (5 cols) */}
          <div className="lg:col-span-5">
            <TiltCard glowColor="purple" className="p-6 bg-card/85 flex flex-col items-center justify-between h-full">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  3D Holographic Skill Radar
                </span>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  Live Matrix
                </span>
              </div>

              <div className="my-auto py-1">
                <DashboardRadarChart stats={data.radarStats} />
              </div>

              <div className="w-full pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span>Calculated from solved challenges</span>
                <Link href="/profile" className="text-indigo-400 hover:underline font-bold">
                  View Profile &rarr;
                </Link>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* ── SECTION 3: 3D DSA CONQUEST ROADMAP & PRACTICE MODULES ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 4 3D Roadmap Conquest Tiers (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🗺️</span> 150 Core DSA Roadmap
                </h3>
                <p className="text-xs text-slate-400">Progressive conquest path through 4 algorithmic tiers</p>
              </div>
              <Link href="/problems" className="text-xs text-indigo-400 hover:underline">
                View All 150 &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.roadmapLevels.map((lvl: any) => (
                <TiltCard
                  key={lvl.id}
                  glowColor="indigo"
                  onClick={() => router.push(`/problems?topic=${encodeURIComponent(lvl.tag)}`)}
                  className="p-5 cursor-pointer flex flex-col justify-between bg-card/85"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{lvl.icon}</span>
                        <span className="text-xs font-bold text-white">{lvl.name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-indigo-300">
                        {lvl.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug">{lvl.desc}</p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-white/10 mt-3">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{lvl.problems}</span>
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

          {/* 3D Company Packs & Recent Submissions (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🏢</span> Curated Company Tracks
              </h3>
              <span className="text-xs text-slate-400 font-mono">High Frequency</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {data.companyTracks.map((comp: any, i: number) => (
                <TiltCard
                  key={i}
                  glowColor={comp.glow}
                  onClick={() => router.push("/problems")}
                  className="p-4 cursor-pointer flex items-center justify-between bg-card/80"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{comp.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{comp.name}</h4>
                      <p className="text-[10px] text-slate-400">{comp.count}</p>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-400 font-bold">&rarr;</span>
                </TiltCard>
              ))}
            </div>

            {/* Recent Solves Feed */}
            <TiltCard glowColor="emerald" className="p-4 bg-card/85 space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/10">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  Recent Submissions
                </span>
                <Link href="/profile" className="text-[10px] text-slate-400 hover:text-white">
                  Full History &rarr;
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
                    className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between cursor-pointer transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                      <span className="font-semibold text-slate-200">{act.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {act.language || "Accepted"}
                    </span>
                  </div>
                ))
              )}
            </TiltCard>
          </div>
        </div>
      </main>
    </div>
  );
}
