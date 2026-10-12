"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Label } from "@codearena/ui";
import { saveAccount, getAllAccounts, switchAccount, UserAccount } from "@/lib/auth-session";
import { Cinematic3DBackground } from "@/components/Cinematic3DBackground";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAddingAccount = searchParams.get("addAccount") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingAccounts, setExistingAccounts] = useState<UserAccount[]>([]);

  useEffect(() => {
    // Only show real student accounts already registered/saved on this device
    const all = getAllAccounts();
    const studentsOnly = all.filter((a) => a.role !== "SUPER_ADMIN" && a.role !== "ADMIN");
    setExistingAccounts(studentsOnly);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError("Please enter both your email/username and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // Fallback: check if account was registered on this browser session
        const localAccounts = getAllAccounts();
        const localMatch = localAccounts.find(
          (a) => a.email.toLowerCase() === cleanEmail.toLowerCase() || a.username.toLowerCase() === cleanEmail.toLowerCase()
        );

        if (localMatch) {
          // If local account has a stored password, strictly reject if it doesn't match
          if (localMatch.password && localMatch.password !== password) {
            setError("Invalid password. Please check your password and try again.");
            setLoading(false);
            return;
          }

          // If server returned 401 with password error, do not bypass
          if (data?.message && typeof data.message === "string" && data.message.toLowerCase().includes("invalid password")) {
            setError(data.message);
            setLoading(false);
            return;
          }

          if (localMatch.password === password) {
            saveAccount(localMatch, true);
            const redirectUrl = searchParams.get("redirect");
            if (localMatch.role === "SUPER_ADMIN" || localMatch.role === "ADMIN") {
              localStorage.setItem("codearena_admin_authorized", "true");
              router.push("/admin");
            } else if (redirectUrl && redirectUrl.startsWith("/") && !redirectUrl.startsWith("//")) {
              router.push(redirectUrl);
            } else {
              router.push("/dashboard");
            }
            return;
          }
        }

        let errorMsg = data?.message || "Invalid credentials. If you haven't registered, please create an account first.";
        if (Array.isArray(errorMsg)) {
          errorMsg = errorMsg.join(", ");
        }
        setError(errorMsg);
        setLoading(false);
        return;
      }

      const userPayload = data?.data?.user || data?.user;
      const token = data?.data?.accessToken || data?.accessToken;

      if (!userPayload) {
        const localAccounts = getAllAccounts();
        const localMatch = localAccounts.find(
          (a) => a.email.toLowerCase() === cleanEmail.toLowerCase() || a.username.toLowerCase() === cleanEmail.toLowerCase()
        );
        if (localMatch) {
          saveAccount(localMatch, true);
        }
      } else {
        const studentAccount: UserAccount = {
          id: userPayload.id || `usr_${Date.now()}`,
          name: userPayload.name || `${userPayload.firstName || ""} ${userPayload.lastName || ""}`.trim() || userPayload.username,
          username: userPayload.username || cleanEmail.split("@")[0],
          email: userPayload.email || cleanEmail,
          role: userPayload.role || "STUDENT",
          college: userPayload.college || "CodeArena Academy",
          status: userPayload.status || "ACTIVE",
          token: token,
          joinedDate: userPayload.createdAt || userPayload.joinedDate || new Date().toISOString(),
        };
        saveAccount(studentAccount, true);
      }

      const redirectUrl = searchParams.get("redirect");
      if (userPayload?.role === "SUPER_ADMIN" || userPayload?.role === "ADMIN") {
        localStorage.setItem("codearena_admin_authorized", "true");
        router.push("/admin");
      } else if (redirectUrl && redirectUrl.startsWith("/") && !redirectUrl.startsWith("//")) {
        router.push(redirectUrl);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials or register.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSwitch = (accountId: string) => {
    switchAccount(accountId);
    router.push("/dashboard");
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 p-4 md:p-8">
      {/* 3D Live Movie Animated Canvas Background */}
      <Cinematic3DBackground />

      {/* Subtle Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/70 pointer-events-none z-10" />

      {/* Main Dual-Column Content */}
      <div className="relative z-20 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        
        {/* LEFT COLUMN: Cinematic Movie Hero Billboard */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          {/* Holographic Glowing Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-cyan-300">
              Live Sci-Fi Code Arena 3.0
            </span>
          </div>

          {/* Epic Movie Title */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Master DSA in the{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_35px_rgba(99,102,241,0.6)]">
                Next-Gen Arena
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed max-w-lg">
              Solve real-time coding challenges, battle peers in 1v1 algorithmic duels, and rise on global leaderboards.
            </p>
          </div>

          {/* Cinematic Feature Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-indigo-500/50 transition-colors group">
              <div className="text-xl mb-1 group-hover:scale-110 transition-transform">⚔️</div>
              <div className="text-xs font-bold text-white">1v1 Speed Battles</div>
              <div className="text-[11px] text-slate-400">Real-time Elo ranking duels</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-purple-500/50 transition-colors group">
              <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🏆</div>
              <div className="text-xs font-bold text-white">Bi-Weekly Contests</div>
              <div className="text-[11px] text-slate-400">Live ICPC scoreboard sync</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-cyan-500/50 transition-colors group">
              <div className="text-xl mb-1 group-hover:scale-110 transition-transform">⚡</div>
              <div className="text-xs font-bold text-white">Multi-Language IDE</div>
              <div className="text-[11px] text-slate-400">JS, Python, C++, Java</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-pink-500/50 transition-colors group">
              <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🌌</div>
              <div className="text-xs font-bold text-white">Global Standings</div>
              <div className="text-[11px] text-slate-400">Tier ranks & campus badges</div>
            </div>
          </div>

          {/* Real-time Ticker / Movie Trailer Note */}
          <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
            <div className="flex -space-x-1.5">
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-slate-950 flex items-center justify-center text-[10px] text-white font-bold">A</div>
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 border border-slate-950 flex items-center justify-center text-[10px] text-white font-bold">P</div>
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 border border-slate-950 flex items-center justify-center text-[10px] text-white font-bold">R</div>
            </div>
            <span>Over <strong className="text-cyan-300 font-mono">2,400+</strong> active student programmers competing now</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Ultra-Premium Glassmorphic Login Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <Card className="shadow-[0_0_60px_rgba(99,102,241,0.25)] border border-indigo-500/30 bg-slate-950/75 backdrop-blur-2xl rounded-2xl overflow-hidden">
            
            {/* Card Header */}
            <CardHeader className="space-y-1.5 text-center pb-4 pt-6">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-500 flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.5)] mb-2 group hover:scale-105 transition-transform">
                <span className="text-white text-xl font-black">C</span>
              </div>
              <CardTitle className="text-2xl font-extrabold tracking-tight text-white">
                {isAddingAccount ? "Add Student Account" : "Welcome Back"}
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                {isAddingAccount
                  ? "Sign into an additional verified student account."
                  : "Enter your registered credentials to access your arena workspace"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              
              {/* Quick Demo Switcher for fast testing */}
              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-left space-y-1.5">
                <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase flex items-center justify-between">
                  <span>⚡ Quick Demo Credentials</span>
                  <span className="text-cyan-400 font-mono text-[9px]">1-Click Fill</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount("student@codearena.dev", "student123")}
                    className="flex-1 py-1 px-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-[11px] font-semibold text-indigo-300 transition-colors text-center"
                  >
                    Student Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount("alex.chen@gmail.com", "student123")}
                    className="flex-1 py-1 px-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-[11px] font-semibold text-purple-300 transition-colors text-center"
                  >
                    Alex Chen
                  </button>
                </div>
              </div>

              {/* Multi-Account Quick Switch for previously authenticated accounts on this device */}
              {existingAccounts.length > 0 && !isAddingAccount && (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-left">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>Verified accounts on this device:</span>
                    <span className="font-mono text-cyan-400">{existingAccounts.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {existingAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => handleQuickSwitch(acc.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-500/20 border border-slate-700 hover:border-indigo-500/50 text-xs font-semibold text-slate-200 transition-all"
                      >
                        <span className="h-4 w-4 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[10px]">
                          {(acc.name || acc.username || "U")[0]?.toUpperCase()}
                        </span>
                        <span>{acc.name || acc.username}</span>
                        <span className="text-indigo-400 text-[10px]">&rarr;</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-3.5 text-left">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-300">
                    Registered Email or Username
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="student@codearena.dev or username"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    className="h-10 text-xs bg-slate-900/80 border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-500 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-slate-300">
                      Password
                    </Label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors font-medium"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                      <span className="text-slate-600 text-xs">•</span>
                      <Link href="/reset-password" className="text-[11px] text-indigo-400 hover:underline">
                        Forgot?
                      </Link>
                    </div>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    className="h-10 text-xs bg-slate-900/80 border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-500 rounded-xl"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium space-y-1">
                    <div className="flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{error}</span>
                    </div>
                    <div className="pt-1 text-[11px] text-slate-400">
                      Not registered yet?{" "}
                      <Link href="/register" className="text-cyan-400 font-bold hover:underline">
                        Create a student account &rarr;
                      </Link>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-10 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.01]" 
                  disabled={loading}
                >
                  {loading ? "Authenticating Arena Access..." : isAddingAccount ? "Add & Switch Account" : "Enter Arena"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 items-center justify-center border-t border-slate-800/80 py-3 bg-slate-900/40">
              <p className="text-xs text-slate-400">
                New to CodeArena?{" "}
                <Link href="/register" className="text-cyan-400 hover:text-cyan-300 hover:underline font-semibold">
                  Register student profile &rarr;
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <LoginForm />
    </Suspense>
  );
}
