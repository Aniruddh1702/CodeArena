"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Label } from "@codearena/ui";
import { saveAccount } from "@/lib/auth-session";

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
  const isPasswordValid = hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial;

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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-2xl border-emerald-500/30 text-center py-10 bg-card/90 backdrop-blur-md">
          <CardHeader className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-bold">
              ✓
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Registration Successful!
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Welcome to CodeArena, <strong className="text-foreground">{formData.firstName}</strong>. Redirecting you to your dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-border/60 bg-card/90 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Create an account
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            Join CodeArena to start your DSA journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-semibold">Username</Label>
              <Input 
                id="username" 
                placeholder="johndoe" 
                value={formData.username} 
                onChange={handleChange} 
                required 
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="student@codearena.dev" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter a secure password"
                value={formData.password} 
                onChange={handleChange} 
                required 
                className="h-9 text-xs"
              />

              {/* Real-time Password Requirements Checklist */}
              {formData.password.length > 0 && (
                <div className="mt-2 p-2.5 rounded-lg bg-secondary/40 border border-border/50 text-[11px] font-mono space-y-1 animate-in fade-in">
                  <div className="font-sans font-bold text-[11px] text-muted-foreground mb-1">
                    Password Requirements:
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasMinLen ? "text-emerald-400 font-semibold" : "text-muted-foreground"}`}>
                    <span>{hasMinLen ? "✓" : "○"}</span> At least 8 characters
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpper ? "text-emerald-400 font-semibold" : "text-muted-foreground"}`}>
                    <span>{hasUpper ? "✓" : "○"}</span> At least 1 uppercase letter (A-Z)
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLower ? "text-emerald-400 font-semibold" : "text-muted-foreground"}`}>
                    <span>{hasLower ? "✓" : "○"}</span> At least 1 lowercase letter (a-z)
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-400 font-semibold" : "text-muted-foreground"}`}>
                    <span>{hasNumber ? "✓" : "○"}</span> At least 1 number (0-9)
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-400 font-semibold" : "text-muted-foreground"}`}>
                    <span>{hasSpecial ? "✓" : "○"}</span> At least 1 special character (!@#$%^&*_-...)
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full h-9 text-xs font-bold" disabled={loading}>
              {loading ? "Registering..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-3">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline font-semibold">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
