"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Label } from "@codearena/ui";
import { Cinematic3DBackground } from "@/components/Cinematic3DBackground";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(Boolean(token));
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Auto-verify if token is provided in URL
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json().catch(() => null);

        if (!isMounted) return;

        if (res.ok) {
          setSuccess(true);
          setTimeout(() => {
            router.push("/login?verified=true");
          }, 2500);
        } else {
          setError(data?.message || "Invalid or expired verification link.");
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to verify email. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    verify();
    return () => {
      isMounted = false;
    };
  }, [token, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail || !resendEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setResendLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to resend verification message.");
      }

      setResendSuccess(true);
      setResendCooldown(60);
    } catch (err: any) {
      setError(err.message || "Failed to send verification link.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 p-4">
      <Cinematic3DBackground />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/70 pointer-events-none z-10" />

      <Card className="relative z-20 w-full max-w-md shadow-[0_0_60px_rgba(6,182,212,0.25)] border border-cyan-500/30 bg-slate-950/80 backdrop-blur-2xl rounded-2xl overflow-hidden text-center p-6 sm:p-8 space-y-6">
        
        {/* Loading State */}
        {loading && (
          <div className="space-y-4 py-8">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Verifying Your Email...</h2>
            <p className="text-xs text-slate-400">Please wait while we validate your security token.</p>
          </div>
        )}

        {/* Success State */}
        {!loading && success && (
          <div className="space-y-4 py-4 animate-in fade-in">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-3xl font-black shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce">
              ✓
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-white">
              Email Verified Successfully!
            </CardTitle>
            <CardDescription className="text-slate-300 text-xs leading-relaxed">
              Your student account is now fully activated. Redirecting you to the login screen...
            </CardDescription>
            <div className="pt-2">
              <Link href="/login">
                <Button className="w-full h-10 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg">
                  Proceed to Login &rarr;
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Error / Expired / Manual Resend State */}
        {!loading && !success && (
          <div className="space-y-5 animate-in fade-in text-left">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl mb-1">
                ✉️
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-white">
                {token ? "Verification Link Expired or Invalid" : "Verify Your Account"}
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                {token
                  ? "This link may have already been used or expired after 24 hours. Enter your email below to request a fresh verification link."
                  : "Enter your registered email address to receive a fresh verification link."}
              </CardDescription>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {resendSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                ✓ A new verification message has been dispatched. Please check your inbox.
              </div>
            )}

            <form onSubmit={handleResend} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="resendEmail" className="text-xs font-semibold text-slate-300">
                  Student Email Address
                </Label>
                <Input
                  id="resendEmail"
                  type="email"
                  placeholder="student@gmail.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  required
                  className="h-10 text-xs bg-slate-900/80 border-slate-800 focus:border-cyan-500 text-white placeholder:text-slate-500 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={resendLoading || resendCooldown > 0}
                className="w-full h-10 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg transition-all"
              >
                {resendLoading
                  ? "Dispatching..."
                  : resendCooldown > 0
                  ? `Wait ${resendCooldown}s to Resend`
                  : "Send Verification Link →"}
              </Button>
            </form>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline">
                ← Back to Login
              </Link>
            </div>
          </div>
        )}

      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
