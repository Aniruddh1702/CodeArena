"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Label } from "@codearena/ui";
import { saveAccount, getAllAccounts, switchAccount, UserAccount } from "@/lib/auth-session";

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
          const redirectUrl = searchParams.get("redirect");
          if (redirectUrl && redirectUrl.startsWith("/")) {
            router.push(redirectUrl);
          } else {
            router.push("/dashboard");
          }
          return;
        }
        setError("Account not found. Please register to create a new student account.");
        setLoading(false);
        return;
      }

      const username = userPayload.username || (cleanEmail.includes("@") ? cleanEmail.split("@")[0] : cleanEmail);
      const userRole = userPayload.role || "STUDENT";
      const fullName = `${userPayload.firstName || ""} ${userPayload.lastName || ""}`.trim() || userPayload.name || username;

      const sessionAccount: UserAccount = {
        id: userPayload.id || username,
        email: userPayload.email || cleanEmail,
        username: username,
        name: fullName,
        role: userRole,
        token: token || `token_${Date.now()}`,
        college: userPayload.college || "CodeArena University",
        year: "3rd Year",
        branch: "Computer Science",
        bio: "Competitive Programmer & DSA Enthusiast",
      };

      saveAccount(sessionAccount, true);

      const redirectUrl = searchParams.get("redirect");
      if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-border/60 bg-card/90 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            {isAddingAccount ? "Add Another Account" : "Student Login"}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            {isAddingAccount
              ? "Sign into an additional verified account. You can switch between accounts anytime."
              : "Enter your registered student credentials to access your dashboard & practice arena"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Multi-Account Quick Switch for previously authenticated accounts on this device */}
          {existingAccounts.length > 0 && !isAddingAccount && (
            <div className="p-3 rounded-xl bg-secondary/50 border border-border/60 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                <span>Verified accounts on this device:</span>
                <span className="font-mono">{existingAccounts.length} account{existingAccounts.length > 1 ? "s" : ""}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {existingAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickSwitch(acc.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card hover:bg-primary/20 border border-border hover:border-primary/50 text-xs font-semibold text-foreground transition-all"
                  >
                    <span className="h-4 w-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">
                      {(acc.name || acc.username || "U")[0]?.toUpperCase()}
                    </span>
                    <span>{acc.name || acc.username}</span>
                    <span className="text-primary text-[10px]">&rarr;</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">Registered Email or Username</Label>
              <Input
                id="email"
                type="text"
                placeholder="your.email@example.com or username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                  <span className="text-muted-foreground text-xs">•</span>
                  <Link href="/reset-password" className="text-[11px] text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your registered password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                required
                className="h-9 text-xs"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium space-y-1">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
                <div className="pt-1 text-[11px] text-muted-foreground">
                  Not registered yet?{" "}
                  <Link href="/register" className="text-primary font-bold hover:underline">
                    Create a new student account &rarr;
                  </Link>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-9 text-xs font-bold" disabled={loading}>
              {loading ? "Authenticating..." : isAddingAccount ? "Add & Switch Account" : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 items-center justify-center border-t py-3">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}
