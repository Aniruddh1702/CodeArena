"use client";

import { useState } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Label } from "@codearena/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const { getBackendApiUrl } = await import("@/lib/api-config");
        const apiUrl = getBackendApiUrl();
        res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok && data?.message) {
        throw new Error(data.message || "Failed to process request");
      }

      if (data?.token) {
        setResetToken(data.token);
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to dispatch password reset request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight text-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/30 text-sm">
                  If an account with that email exists, we have dispatched a password reset link. Please check your inbox.
                </div>
                {resetToken && (
                  <div className="p-3 bg-secondary/30 rounded-lg text-center border border-border/50 text-xs text-muted-foreground">
                    Reset Token ready:{" "}
                    <a href={`/reset-password?token=${resetToken}`} className="text-primary font-semibold underline ml-1">
                      Proceed to Reset Password &rarr;
                    </a>
                  </div>
                )}
              </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="student@codearena.dev"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>
            )}
        </CardContent>
        <CardFooter className="flex justify-center flex-col gap-2">
            <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <a href="/login" className="text-primary hover:underline">
                Sign in
                </a>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
