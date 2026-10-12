"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Label } from "@codearena/ui";
import { saveAccount } from "@/lib/auth-session";
import { Cinematic3DBackground } from "@/components/Cinematic3DBackground";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  // Password criteria indicators
  const pwd = formData.password;
  const hasMinLen = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasSpecial = /[\W_]/.test(pwd);
  const passedCriteriaCount = [hasMinLen, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const isPasswordValid = passedCriteriaCount === 5;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation check
    if (!isPasswordValid) {
      setError("Please ensure your password satisfies all 5 security criteria below.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        let errorMsg = data?.message || "Failed to register";
        if (Array.isArray(errorMsg)) {
          errorMsg = errorMsg.join(", ");
        }
        throw new Error(errorMsg);
      }

      // Persist auth session via Multi-Account Session Manager
      const userPayload = data?.data?.user || data?.user || {
        id: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        role: "STUDENT",
      };
      const token = data?.data?.accessToken || data?.accessToken || "demo_token";

      if (typeof window !== "undefined") {
        try {
          saveAccount(
            {
              id: userPayload.id || formData.username,
              email: formData.email,
              username: formData.username,
              name: `${formData.firstName} ${formData.lastName}`.trim(),
              password: formData.password,
              role: "STUDENT",
              token: token,
              college: "CodeArena University",
              year: "3rd Year",
              branch: "Computer Science",
              bio: "Competitive Programmer & DSA Enthusiast",
            },
            true
          );
        } catch (e) {
          console.error("Error saving auth session:", e);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemoStudent = () => {
    const randomSuffix = Math.floor(Math.random() * 900 + 100);
    setFormData({
      firstName: "Aarav",
      lastName: "Verma",
      username: `aarav_${randomSuffix}`,
      email: `aarav${randomSuffix}@codearena.dev`,
      password: "CodeArena@2026!",
    });
    setError("");
  };

  if (success) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 p-4">
        <Cinematic3DBackground />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/70 pointer-events-none z-10" />

        <Card className="relative z-20 w-full max-w-md shadow-[0_0_70px_rgba(16,185,129,0.3)] border border-emerald-500/40 text-center py-10 px-6 bg-slate-950/85 backdrop-blur-2xl rounded-2xl">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-3xl font-black shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce">
              ✓
            </div>
            <CardTitle className="text-3xl font-black tracking-tight text-white">
              Welcome to the Arena!
            </CardTitle>
            <CardDescription className="text-slate-300 text-sm leading-relaxed">
              Account created successfully for <strong className="text-cyan-400">{formData.firstName} {formData.lastName}</strong> (@{formData.username}). Initializing your 1450 Elo rating and unlocking your practice workspace...
            </CardDescription>
          </CardHeader>
          <div className="pt-4 flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Entering Student Dashboard...</span>
          </div>
        </Card>
      </div>
    );
  }

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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-cyan-300">
              Student Genesis Protocol
            </span>
          </div>

          {/* Epic Movie Title */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Begin Your Journey to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.6)]">
                Tech Excellence
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed max-w-lg">
              Create your profile today. Unlock 150+ curated algorithms, join weekly rated clashes, and compete with elite developers.
            </p>
          </div>

          {/* Cinematic Benefit Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-cyan-500/50 transition-colors group">
              <div className="text-xl mb-1 group-hover:scale-110 transition-transform">⚡</div>
              <div className="text-xs font-bold text-white">Instant 1450 Rating</div>
              <div className="text-[11px] text-slate-400">Jump right into competitive rank</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-emerald-500/50 transition-colors group">
              <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🎓</div>
              <div className="text-xs font-bold text-white">Campus Leaderboards</div>
              <div className="text-[11px] text-slate-400">Represent your university</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-indigo-500/50 transition-colors group">
              <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🤖</div>
              <div className="text-xs font-bold text-white">AI-Powered Judge</div>
              <div className="text-[11px] text-slate-400">Sub-second test verification</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-purple-500/50 transition-colors group">
              <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🏆</div>
              <div className="text-xs font-bold text-white">ACM-ICPC Formats</div>
              <div className="text-[11px] text-slate-400">Live penalty & solve scoreboards</div>
            </div>
          </div>

          {/* Real-time Ticker */}
          <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Over <strong className="text-emerald-300 font-mono">120,000+</strong> test cases judged weekly across all platforms</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Ultra-Premium Glassmorphic Registration Console */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <Card className="shadow-[0_0_60px_rgba(99,102,241,0.25)] border border-indigo-500/30 bg-slate-950/75 backdrop-blur-2xl rounded-2xl overflow-hidden">
            
            {/* Card Header */}
            <CardHeader className="space-y-1.5 text-center pb-3 pt-5">
              <div className="mx-auto h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-500 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.5)] mb-1 group hover:scale-105 transition-transform">
                <span className="text-white text-lg font-black">C</span>
              </div>
              <CardTitle className="text-2xl font-extrabold tracking-tight text-white">
                Create Student Account
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Join the arena to start your competitive programming career
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5 pt-0">
              
              {/* Quick Auto-Fill for Testing */}
              <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800 text-left flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  ⚡ Want to test quickly?
                </span>
                <button
                  type="button"
                  onClick={fillQuickDemoStudent}
                  className="py-1 px-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[11px] font-semibold text-cyan-300 transition-colors"
                >
                  Auto-Fill Coder Profile
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-3 text-left">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="text-xs font-semibold text-slate-300">
                      First Name
                    </Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      required 
                      className="h-9 text-xs bg-slate-900/80 border-slate-800 focus:border-cyan-500 text-white placeholder:text-slate-500 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="text-xs font-semibold text-slate-300">
                      Last Name
                    </Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      required 
                      className="h-9 text-xs bg-slate-900/80 border-slate-800 focus:border-cyan-500 text-white placeholder:text-slate-500 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="username" className="text-xs font-semibold text-slate-300">
                    Desired Arena Handle (Username)
                  </Label>
                  <Input 
                    id="username" 
                    placeholder="johndoe_dev" 
                    value={formData.username} 
                    onChange={handleChange} 
                    required 
                    className="h-9 text-xs bg-slate-900/80 border-slate-800 focus:border-cyan-500 text-white placeholder:text-slate-500 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-300">
                    Student Email Address
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="student@codearena.dev" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="h-9 text-xs bg-slate-900/80 border-slate-800 focus:border-cyan-500 text-white placeholder:text-slate-500 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-slate-300">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors font-medium"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Create a strong password"
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    className="h-9 text-xs bg-slate-900/80 border-slate-800 focus:border-cyan-500 text-white placeholder:text-slate-500 rounded-xl"
                  />

                  {/* Password Strength Meter & Live Checklist */}
                  {formData.password.length > 0 && (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 text-[11px] font-mono space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between text-[11px] font-sans font-bold">
                        <span className="text-slate-400">Security Criteria:</span>
                        <span className={isPasswordValid ? "text-emerald-400" : "text-amber-400"}>
                          {passedCriteriaCount} / 5 Met
                        </span>
                      </div>
                      
                      {/* Strength Progress Bar */}
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                        <div className={`h-full transition-all duration-300 ${passedCriteriaCount >= 1 ? "bg-rose-500 w-1/5" : "w-0"}`} />
                        <div className={`h-full transition-all duration-300 ${passedCriteriaCount >= 2 ? "bg-amber-500 w-1/5" : "w-0"}`} />
                        <div className={`h-full transition-all duration-300 ${passedCriteriaCount >= 3 ? "bg-yellow-400 w-1/5" : "w-0"}`} />
                        <div className={`h-full transition-all duration-300 ${passedCriteriaCount >= 4 ? "bg-cyan-400 w-1/5" : "w-0"}`} />
                        <div className={`h-full transition-all duration-300 ${passedCriteriaCount === 5 ? "bg-emerald-400 w-1/5" : "w-0"}`} />
                      </div>

                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pt-1 text-[10px]">
                        <div className={`flex items-center gap-1 ${hasMinLen ? "text-emerald-400 font-semibold" : "text-slate-500"}`}>
                          <span>{hasMinLen ? "✓" : "○"}</span> 8+ Characters
                        </div>
                        <div className={`flex items-center gap-1 ${hasUpper ? "text-emerald-400 font-semibold" : "text-slate-500"}`}>
                          <span>{hasUpper ? "✓" : "○"}</span> Uppercase (A-Z)
                        </div>
                        <div className={`flex items-center gap-1 ${hasLower ? "text-emerald-400 font-semibold" : "text-slate-500"}`}>
                          <span>{hasLower ? "✓" : "○"}</span> Lowercase (a-z)
                        </div>
                        <div className={`flex items-center gap-1 ${hasNumber ? "text-emerald-400 font-semibold" : "text-slate-500"}`}>
                          <span>{hasNumber ? "✓" : "○"}</span> Number (0-9)
                        </div>
                        <div className={`col-span-2 flex items-center gap-1 ${hasSpecial ? "text-emerald-400 font-semibold" : "text-slate-500"}`}>
                          <span>{hasSpecial ? "✓" : "○"}</span> Special Character (!@#$%^&*)
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-10 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.01]" 
                  disabled={loading}
                >
                  {loading ? "Registering & Initializing Profile..." : "Complete Registration & Enter Arena"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-slate-800/80 py-3 bg-slate-900/40">
              <p className="text-xs text-slate-400">
                Already registered?{" "}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 hover:underline font-semibold">
                  Sign in here &rarr;
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
}
