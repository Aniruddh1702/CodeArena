"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, Label } from "@codearena/ui";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
      if(!token) {
          setError("Invalid or missing reset token.");
      }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    setLoading(true);
    setError("");

    try {
      const { getBackendApiUrl } = await import("@/lib/api-config");
      const apiUrl = getBackendApiUrl();
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        let errorMsg = data.message;
        if (Array.isArray(errorMsg)) {
            errorMsg = errorMsg.join(', ');
        }
        throw new Error(errorMsg || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
          router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md shadow-2xl border-primary/20 text-center py-10">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold tracking-tight text-primary">Password Reset Successful</CardTitle>
                    <CardDescription>Redirecting you to login page...</CardDescription>
                </CardHeader>
            </Card>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new secure password
          </CardDescription>
        </CardHeader>
        <CardContent>
            {token ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <p className="text-xs text-muted-foreground mt-1">Must contain at least 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special char.</p>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            ) : (
                <div className="text-center p-4 text-destructive border border-destructive/50 rounded-md">
                    {error}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
