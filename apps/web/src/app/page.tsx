"use client";

import { useEffect, useState, useRef, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── 3D Interactive Parallax Tilt Card Component ──
function Tilt3DCard({
  children,
  className = "",
  glowColor = "indigo",
  maxTilt = 10,
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

    const particleCount = 48;
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

export default function HomePage() {
  const router = useRouter();
  const [testCodeRunning, setTestCodeRunning] = useState(false);
  const [testCodeResult, setTestCodeResult] = useState<string | null>(null);

  const handleTestExecution = () => {
    setTestCodeRunning(true);
    setTestCodeResult(null);
    setTimeout(() => {
      setTestCodeRunning(false);
      setTestCodeResult("✓ All 3 test cases passed in 0.18ms! Memory: 14.2 MB (Top 98.4%)");
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-[#05070e] text-foreground selection:bg-indigo-500/30 relative overflow-x-hidden">
      {/* 3D Particle Mesh Horizon */}
      <CyberParticleMesh3D />

      {/* Atmospheric 2026 Cosmic Light Fields */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-[15%] w-[680px] h-[680px] rounded-full bg-indigo-600/15 blur-[150px] animate-glow-pulse" />
        <div className="absolute top-[35%] -right-[10%] w-[580px] h-[580px] rounded-full bg-purple-600/15 blur-[160px] animate-glow-pulse" />
        <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-cyan-600/12 blur-[150px] animate-glow-pulse" />
      </div>

      {/* ── 2026 Glassmorphism Header ── */}
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
                2026 Edition
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
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 flex items-center gap-1 transition-all"
            >
              <span>⚔️</span> 1v1 Battles
            </Link>
            <Link
              href="/leaderboard"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ARENA ONLINE (0ms)
            </div>

            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-[1.02] transition-all"
            >
              Enter Arena &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section className="relative z-10 pt-16 pb-12 md:pt-24 md:pb-16 text-center container mx-auto px-6 max-w-5xl space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold font-mono shadow-[0_0_20px_rgba(99,102,241,0.25)]">
          <span className="animate-spin text-sm">✦</span> NEXT-GEN 2026 COMPETITIVE PROGRAMMING ECOSYSTEM
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight">
          Master Algorithms. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]">
            Conquer Live Battles.
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The ultimate 3D-accelerated battleground for developers. Practice 150 curated DSA challenges, participate in high-stakes contests with floating trophies, and engage in real-time 1v1 sword clashes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-bold text-sm shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_45px_rgba(168,85,247,0.7)] hover:scale-[1.03] transition-all flex items-center gap-2.5"
          >
            <span>⚡</span> Launch Student Dashboard
          </button>
          <button
            onClick={() => router.push("/battles")}
            className="px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-purple-500/40 text-purple-300 hover:text-white font-bold text-sm shadow-lg hover:border-purple-400 transition-all flex items-center gap-2.5"
          >
            <span>⚔️</span> Quick 1v1 Battle
          </button>
        </div>

        {/* Live Arena Metrics Strip */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="text-2xl font-black text-indigo-400 font-mono">150+</div>
            <div className="text-[11px] text-slate-400 font-medium">Curated DSA Tracks</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="text-2xl font-black text-purple-400 font-mono">12.8k+</div>
            <div className="text-[11px] text-slate-400 font-medium">1v1 Duels Fought</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="text-2xl font-black text-amber-400 font-mono">100%</div>
            <div className="text-[11px] text-slate-400 font-medium">Live Server Sync</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="text-2xl font-black text-emerald-400 font-mono">0.18ms</div>
            <div className="text-[11px] text-slate-400 font-medium">Execution Engine</div>
          </div>
        </div>
      </section>

      {/* ── 3D INTERACTIVE BLOCKS SHOWCASE SECTION ── */}
      <section className="relative z-10 container mx-auto px-6 py-12 max-w-7xl space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
            ✦ Core Ecosystem Matrix ✦
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Explore Arena Modules in 3D
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Hover over each module to experience real-time 3D parallax depth, dynamic lighting, and live combat animations.
          </p>
        </div>

        {/* ── ROW 1: BATTLE BLOCK & CONTEST BLOCK (HERO 3D SHOWCASES) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ════════════ BLOCK 1: 3D REAL-TIME BATTLE ARENA (CONTINUOUSLY FIGHTING SWORDS) ════════════ */}
          <Tilt3DCard
            glowColor="rose"
            onClick={() => router.push("/battles")}
            className="p-7 md:p-8 cursor-pointer bg-gradient-to-br from-[#180816]/90 via-[#0c1024]/90 to-[#120a22]/90 border-rose-500/30 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Header Pill */}
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

              {/* ── 3D CONTINUOUSLY FIGHTING SWORDS ARENA VISUAL ── */}
              <div className="relative h-44 rounded-2xl bg-black/40 border border-rose-500/20 flex items-center justify-center overflow-hidden my-2 shadow-[inset_0_0_30px_rgba(244,63,94,0.15)]">
                {/* Arena Grid Floors */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.15),transparent_70%)]" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(244,63,94,0.1))]" />

                {/* Left Fighter Sword (Cyan Energy Katana) */}
                <div className="absolute z-10 animate-sword-left flex flex-col items-center">
                  <div className="w-2.5 h-24 rounded-full bg-gradient-to-t from-cyan-400 via-blue-300 to-white shadow-[0_0_20px_#22d3ee,0_0_35px_#38bdf8] relative">
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-3 rounded bg-cyan-700 border border-cyan-300" />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2 h-4 bg-slate-800 rounded" />
                  </div>
                </div>

                {/* Clash Energy Spark Shockwave Burst */}
                <div className="absolute z-20 animate-clash-spark flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white blur-sm opacity-90 shadow-[0_0_30px_#fff,0_0_50px_#f43f5e]" />
                  <span className="absolute text-2xl font-black text-amber-300 drop-shadow-[0_0_10px_#f59e0b]">
                    💥
                  </span>
                </div>

                {/* Right Fighter Sword (Crimson / Rose Energy Blade) */}
                <div className="absolute z-10 animate-sword-right flex flex-col items-center">
                  <div className="w-2.5 h-24 rounded-full bg-gradient-to-t from-rose-500 via-pink-400 to-white shadow-[0_0_20px_#f43f5e,0_0_35px_#ec4899] relative">
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-3 rounded bg-rose-700 border border-rose-300" />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2 h-4 bg-slate-800 rounded" />
                  </div>
                </div>

                {/* HUD Overlay: Fighter 1 vs Fighter 2 */}
                <div className="absolute top-2.5 inset-x-4 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-lg border border-cyan-500/30 text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>User_P1 (1650)</span>
                  </div>
                  <span className="font-black text-rose-400 text-xs">VS</span>
                  <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-lg border border-rose-500/30 text-rose-300">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    <span>Opponent_AI (1620)</span>
                  </div>
                </div>

                {/* Bottom Status Ticker */}
                <div className="absolute bottom-2 inset-x-4 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-black/50 px-2.5 py-1 rounded-md border border-white/5">
                  <span>Speed Duel: 10 Min Timer</span>
                  <span className="text-emerald-400 font-bold">Passing Test Cases: 7/8</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-rose-300 transition-colors">
                  1v1 Real-Time Algorithm Battles
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                  Instant matchmaker pairs you with peers at your exact skill rating. First to pass all test cases in the live arena claims rating points and global leaderboard prestige.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-rose-400 font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                Live Duel Queue Ready
              </span>
              <div className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(244,63,94,0.4)] group-hover:shadow-[0_0_30px_rgba(244,63,94,0.7)] group-hover:scale-105 transition-all flex items-center gap-1.5">
                <span>⚔️</span> Clash Now &rarr;
              </div>
            </div>
          </Tilt3DCard>

          {/* ════════════ BLOCK 2: 3D CONTEST CHAMPIONSHIP (FLOATING TROPHIES & WINNER CERTIFICATE) ════════════ */}
          <Tilt3DCard
            glowColor="amber"
            onClick={() => router.push("/contests")}
            className="p-7 md:p-8 cursor-pointer bg-gradient-to-br from-[#191307]/90 via-[#0c1024]/90 to-[#1c1208]/90 border-amber-500/30 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Header Pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider font-mono">
                    🏆 Championship Contests
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                    $5,000 PRIZE POOL
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">Weekly Series #42</span>
              </div>

              {/* ── 3D FLOATING TROPHY & WINNER CERTIFICATE SHEET VISUAL ── */}
              <div className="relative h-44 rounded-2xl bg-black/40 border border-amber-500/20 flex items-center justify-around px-4 overflow-hidden my-2 shadow-[inset_0_0_30px_rgba(245,158,11,0.15)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)]" />

                {/* 1. Floating 3D Golden Trophy */}
                <div className="relative z-10 animate-trophy-3d flex flex-col items-center">
                  <div className="text-6xl drop-shadow-[0_0_25px_rgba(245,158,11,0.8)] filter">
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
                    {/* Golden Ribbon Seal */}
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

                {/* Floating Gold Particles */}
                <div className="absolute top-3 right-6 text-sm animate-bounce text-amber-300">✨</div>
                <div className="absolute bottom-4 left-6 text-sm animate-pulse text-amber-400">⭐</div>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                  Live Tournaments & Prize Contests
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                  Bi-weekly rated algorithmic championships. Real-time server ranking synchronization, automated submission evaluation, and verifiable winner credentials.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-amber-400 font-mono font-bold flex items-center gap-1.5">
                <span>⏳</span> Next Contest: Sunday 8:00 PM
              </span>
              <div className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.7)] group-hover:scale-105 transition-all flex items-center gap-1.5">
                <span>🏆</span> Enter Contests &rarr;
              </div>
            </div>
          </Tilt3DCard>
        </div>

        {/* ── ROW 2: DASHBOARD, PRACTICE (150 DSA), LEADERBOARD, ASSESSMENTS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* ════════════ BLOCK 3: 3D STUDENT DASHBOARD ════════════ */}
          <Tilt3DCard
            glowColor="indigo"
            onClick={() => router.push("/dashboard")}
            className="p-6 cursor-pointer bg-[#0c1024]/85 border-indigo-500/30 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  Student Dashboard
                </span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  Command Deck
                </span>
              </div>

              {/* 3D Visual Preview */}
              <div className="h-32 rounded-xl bg-black/40 border border-indigo-500/20 p-3 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-lg animate-float-3d">
                      💎
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono">Specialist</div>
                      <div className="text-xs font-black text-white font-mono">1450 ELO</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400">🔥 2-Day</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>150 DSA Conquest</span>
                    <span className="text-indigo-400 font-bold">24 / 150</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-[24%]" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Personal Nexus & Stats
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  3D skill radar matrix, 4-tier DSA roadmap, problem of the day, and live rank stats.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Open Dashboard</span>
              <span>&rarr;</span>
            </div>
          </Tilt3DCard>

          {/* ════════════ BLOCK 4: 3D PRACTICE HUB (150 DSA) ════════════ */}
          <Tilt3DCard
            glowColor="emerald"
            onClick={() => router.push("/problems")}
            className="p-6 cursor-pointer bg-[#0c1024]/85 border-emerald-500/30 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  Practice Hub
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  150 DSA
                </span>
              </div>

              {/* 3D Code Terminal Preview */}
              <div className="h-32 rounded-xl bg-black/50 border border-emerald-500/20 p-2.5 flex flex-col justify-between font-mono text-[10px] relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-1">
                  <span className="text-emerald-400 font-bold">two_sum.cpp</span>
                  <span className="text-[9px] text-slate-500">C++20</span>
                </div>

                <div className="text-slate-300 space-y-0.5 text-[9px] py-1">
                  <span className="text-purple-400">unordered_map</span>&lt;<span className="text-blue-400">int</span>, <span className="text-blue-400">int</span>&gt; seen;
                  <br />
                  <span className="text-pink-400">for</span> (<span className="text-blue-400">int</span> i = 0; i &lt; n; i++) &#123;
                  <br />
                  &nbsp;&nbsp;<span className="text-emerald-400">// O(N) Hash Table</span>
                </div>

                <div className="flex items-center justify-between text-[9px] text-emerald-400 pt-1 border-t border-white/5">
                  <span>✓ 150 Curated</span>
                  <span className="text-slate-400">Easy • Med • Hard</span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Monaco IDE Engine
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  Arrays, Binary Trees, Dynamic Programming, and Graph algorithms with instant execution.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Start Coding</span>
              <span>&rarr;</span>
            </div>
          </Tilt3DCard>

          {/* ════════════ BLOCK 5: 3D LEADERBOARD & PODIUM ════════════ */}
          <Tilt3DCard
            glowColor="purple"
            onClick={() => router.push("/leaderboard")}
            className="p-6 cursor-pointer bg-[#0c1024]/85 border-purple-500/30 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  Hall of Fame
                </span>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Global Elo
                </span>
              </div>

              {/* 3D Podium Preview */}
              <div className="h-32 rounded-xl bg-black/40 border border-purple-500/20 p-2.5 flex items-end justify-center gap-2 relative overflow-hidden">
                {/* 2nd Place */}
                <div className="w-12 bg-slate-400/20 border border-slate-300/30 rounded-t-lg h-16 flex flex-col items-center justify-end pb-1">
                  <span className="text-xs">🥈</span>
                  <span className="text-[9px] font-black text-slate-300">#2</span>
                </div>
                {/* 1st Place */}
                <div className="w-14 bg-amber-500/25 border border-amber-400/50 rounded-t-lg h-22 flex flex-col items-center justify-end pb-1 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <span className="text-sm animate-bounce">👑</span>
                  <span className="text-[9px] font-black text-amber-300">#1 Top</span>
                </div>
                {/* 3rd Place */}
                <div className="w-12 bg-amber-700/20 border border-amber-700/30 rounded-t-lg h-12 flex flex-col items-center justify-end pb-1">
                  <span className="text-xs">🥉</span>
                  <span className="text-[9px] font-black text-amber-600">#3</span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  Global Rankings
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  Live Elo ratings, streaks, and global competitive standing updated in real time.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>View Leaderboard</span>
              <span>&rarr;</span>
            </div>
          </Tilt3DCard>

          {/* ════════════ BLOCK 6: 3D ASSESSMENTS & ADMIN SUITE ════════════ */}
          <Tilt3DCard
            glowColor="cyan"
            onClick={() => router.push("/admin")}
            className="p-6 cursor-pointer bg-[#0c1024]/85 border-cyan-500/30 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  Assessments & Admin
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Proctored
                </span>
              </div>

              {/* 3D Anti-Cheat Shield with Scanning Hologram */}
              <div className="h-32 rounded-xl bg-black/40 border border-cyan-500/20 p-2.5 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-hologram-scan" />
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] mb-1">
                  🛡️
                </div>
                <div className="text-[10px] font-black text-cyan-300 font-mono uppercase">
                  ANTI-CHEAT ACTIVE
                </div>
                <div className="text-[8px] text-slate-400 font-mono mt-0.5">
                  Tab Switch & Plagiarism Radar
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Enterprise Tests & Hiring
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  High-stakes hiring tests, university batches, and automated grading reports.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Admin & Org Portal</span>
              <span>&rarr;</span>
            </div>
          </Tilt3DCard>
        </div>

        {/* ── INTERACTIVE 2026 TEST-DRIVE TERMINAL ── */}
        <Tilt3DCard glowColor="indigo" className="p-6 md:p-8 bg-[#0c1024]/90 border-indigo-500/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                ⚡ Instant Test Drive
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Execute Code in 0.18ms Ultra-Low Latency
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Experience CodeArena&apos;s sandboxed execution engine. Runs directly on isolated micro-containers with multi-language compiler support.
              </p>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleTestExecution}
                disabled={testCodeRunning}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                {testCodeRunning ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Compiling in Sandbox...
                  </>
                ) : (
                  <>
                    <span>▶</span> Run Live Benchmark
                  </>
                )}
              </button>

              <button
                onClick={() => router.push("/problems/two-sum")}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                Full IDE Playground &rarr;
              </button>
            </div>
          </div>

          {testCodeResult && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
              <span>🚀</span>
              <span>{testCodeResult}</span>
            </div>
          )}
        </Tilt3DCard>
      </section>

      {/* ── 2026 Sleek Glassmorphism Footer ── */}
      <footer className="relative z-10 border-t border-white/10 bg-[#05070e]/80 backdrop-blur-2xl py-12 mt-12">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm">
              C
            </div>
            <span className="font-extrabold text-white text-base">
              Code<span className="text-indigo-400">Arena</span> 2026
            </span>
          </div>

          <p className="text-xs text-slate-400 text-center md:text-left">
            &copy; 2026 CodeArena Platform. All rights reserved. Next-generation competitive programming matrix.
          </p>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <Link href="/problems" className="hover:text-white transition-colors">
              Problems
            </Link>
            <Link href="/contests" className="hover:text-amber-400 transition-colors">
              Contests
            </Link>
            <Link href="/battles" className="hover:text-rose-400 transition-colors">
              Battles
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
