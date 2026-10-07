"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@codearena/ui";
import { getPublicProfileData, LeaderboardUser } from "@/lib/leaderboard-data";
import { getActiveAccount, getUserStats } from "@/lib/auth-session";

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

    const data = getPublicProfileData(params.username, currentUserStats);
    setProfile(data);
    setLoading(false);

    // If profile was not in local session accounts, check backend database
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
              accuracy: (match.problemsSolved || 0) > 0 ? 85.0 : 0.0,
              tier: match.score >= 1600 ? "Expert" : match.score >= 1400 ? "Specialist" : "Pupil",
              org: match.org || "CodeArena Academy",
              bio: `Competitive programmer @${match.username} on CodeArena.`,
              joinedAt: "Registered Coder",
            } as LeaderboardUser));
          }
        }
      })
      .catch(() => {});
  }, [params.username]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Get initials
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  // Heatmap generation
  const heatmap = Array.from({ length: 90 }).map((_, i) => {
    if (i > 80 && profile.problemsSolved > 0) return Math.min(4, Math.floor(Math.random() * 3) + 1);
    if (i % 5 === 0 && profile.problemsSolved > 2) return Math.floor(Math.random() * 3) + 1;
    return i % 8 === 0 ? 1 : 0;
  });

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-muted/40";
    if (count === 1) return "bg-primary/30";
    if (count === 2) return "bg-primary/50";
    if (count === 3) return "bg-primary/80";
    return "bg-primary";
  };

  const achievements = [
    { name: "First Blood", description: "Solved an algorithm challenge", icon: "🎯", unlocked: profile.problemsSolved > 0 },
    { name: "Specialist Rank", description: "Reached 1400+ competitive rating", icon: "🏆", unlocked: profile.score >= 1400 },
    { name: "Algorithm Master", description: "Solved multiple core problems", icon: "💎", unlocked: profile.problemsSolved >= 5 },
    { name: "Grandmaster League", description: "Surpassed 2000+ competitive rating", icon: "👑", unlocked: profile.score >= 2000 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-extrabold text-2xl tracking-tight text-foreground flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground text-sm font-black">C</span>
            </div>
            Code<span className="text-primary">Arena</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.push('/leaderboard')}>
              ← Back to Leaderboard
            </Button>
            {profile.isCurrentUser ? (
              <Button size="sm" onClick={() => router.push('/profile')}>
                Edit My Profile
              </Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => router.push('/dashboard')}>
                My Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Column: Avatar & Basic Info */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <Card className="overflow-hidden border-border/80 shadow-xl bg-card/80 backdrop-blur-md">
              <div className="h-24 bg-gradient-to-r from-primary/80 via-purple-600/80 to-blue-600/80 w-full" />
              <CardContent className="pt-0 relative px-6 pb-6">
                <div className="w-20 h-20 rounded-2xl bg-card border-4 border-background -mt-10 mb-4 flex justify-center items-center text-2xl font-black shadow-lg bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                  {initials}
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  {profile.isCurrentUser && (
                    <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-bold">
                      You
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground font-mono text-sm mb-3">@{profile.username}</p>
                <div className="text-xs px-2.5 py-1 rounded-md bg-secondary inline-block mb-3 font-semibold text-secondary-foreground">
                  🏢 {profile.org}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
                <div className="mt-5 pt-5 border-t border-border/60 text-xs text-muted-foreground">
                  Joined {profile.joinedAt}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Stats & Heatmap & Achievements */}
          <div className="w-full md:w-2/3 flex flex-col gap-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-card/70 border-border/80 shadow-md">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">DSA Rating</p>
                  <p className="text-3xl font-black text-primary font-mono">{profile.score}</p>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{profile.tier}</span>
                </CardContent>
              </Card>
              <Card className="bg-card/70 border-border/80 shadow-md">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Solved</p>
                  <p className="text-3xl font-black font-mono">{profile.problemsSolved}</p>
                  <span className="text-[10px] text-muted-foreground">/ 15 problems</span>
                </CardContent>
              </Card>
              <Card className="bg-card/70 border-border/80 shadow-md">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Accuracy</p>
                  <p className="text-3xl font-black font-mono text-emerald-400">{profile.accuracy}%</p>
                  <span className="text-[10px] text-muted-foreground">submission quality</span>
                </CardContent>
              </Card>
            </div>

            {/* Heatmap */}
            <Card className="bg-card/70 border-border/80 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Activity Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {heatmap.map((count, i) => (
                    <div 
                      key={i} 
                      className={`w-3.5 h-3.5 rounded-sm ${getHeatmapColor(count)} transition-colors`}
                      title={`${count} submissions`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground justify-end">
                  <span>Less</span>
                  <div className="w-2.5 h-2.5 rounded-sm bg-muted/40" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-primary/30" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-primary/50" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-primary/80" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
                  <span>More</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-card/70 border-border/80 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Achievements & Honors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {achievements.map((ach, i) => (
                    <div 
                      key={i} 
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                        ach.unlocked 
                          ? "bg-secondary/40 border-border" 
                          : "opacity-40 bg-muted/10 border-dashed"
                      }`}
                    >
                      <div className="text-2xl">{ach.icon}</div>
                      <div>
                        <p className="font-semibold text-sm">{ach.name}</p>
                        <p className="text-xs text-muted-foreground">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
