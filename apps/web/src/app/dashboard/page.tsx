"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@codearena/ui";
import { PROBLEMS_DATABASE } from "@/lib/problems-data";
import { getLeaderboards } from "@/lib/leaderboard-data";
import { getActiveAccount, getUserStats, UserAccount } from "@/lib/auth-session";
import { AccountSwitcher } from "@/components/AccountSwitcher";

interface FocusAreaItem {
  name: string;
  tag: string;
  accuracy: string;
  problemsCount: number;
  severity: "CRITICAL" | "MODERATE" | "RECOMMENDED";
  icon: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [activeAccount, setActiveAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getRatingTier = (rating: number) => {
    if (rating >= 2200) return { title: "Grandmaster", color: "text-red-400", nextTier: "Legendary", nextRating: 2400 };
    if (rating >= 1900) return { title: "Candidate Master", color: "text-purple-400", nextTier: "Grandmaster", nextRating: 2200 };
    if (rating >= 1600) return { title: "Expert", color: "text-blue-400", nextTier: "Candidate Master", nextRating: 1900 };
    if (rating >= 1400) return { title: "Specialist", color: "text-cyan-400", nextTier: "Expert", nextRating: 1600 };
    if (rating >= 1200) return { title: "Pupil", color: "text-green-400", nextTier: "Specialist", nextRating: 1400 };
    return { title: "Newbie", color: "text-gray-400", nextTier: "Pupil", nextRating: 1200 };
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        let active = getActiveAccount();
        if (!active) {
          router.push("/login");
          return;
        }

        setActiveAccount(active);
        const currentUserName = active.name || active.username || "Learner";

        // 1. Authoritative isolated stats for THIS user account
        const userStats = getUserStats(active.id);
        const uniqueSolvedList = userStats.solvedProblems;
        let solvedCount = userStats.problemsSolved;
        let currentRating = userStats.dsaRating;
        let activities = userStats.recentActivity;

        // 2. Calculate topic mastery for THIS user account
        const countTopicSolved = (topicName: string): number => {
          let count = 0;
          uniqueSolvedList.forEach((p: any) => {
            const def = PROBLEMS_DATABASE[p.slug];
            if (def && def.topics && def.topics.some((t: any) => t.name.toLowerCase() === topicName.toLowerCase())) {
              count++;
            }
          });
          return count;
        };

        const arraysSolved = countTopicSolved('Arrays');
        const stringsSolved = countTopicSolved('Strings');
        const dpSolved = countTopicSolved('Dynamic Programming');
        const linkedListSolved = countTopicSolved('Linked List');

        const topicProgressData = [
          {
            topicName: 'Arrays',
            topicSlug: 'arrays',
            solved: arraysSolved,
            total: 50,
            percentage: Math.min(100, Math.round((arraysSolved / 50) * 100)),
          },
          {
            topicName: 'Strings',
            topicSlug: 'strings',
            solved: stringsSolved,
            total: 30,
            percentage: Math.min(100, Math.round((stringsSolved / 30) * 100)),
          },
          {
            topicName: 'Dynamic Programming',
            topicSlug: 'dynamic-programming',
            solved: dpSolved,
            total: 40,
            percentage: Math.min(100, Math.round((dpSolved / 40) * 100)),
          },
          {
            topicName: 'Linked List',
            topicSlug: 'linked-list',
            solved: linkedListSolved,
            total: 40,
            percentage: Math.min(100, Math.round((linkedListSolved / 40) * 100)),
          },
        ];

        // 3. Dynamic rank based on authentic leaderboard algorithm for THIS user
        const leaderboardStandings = getLeaderboards({
          username: active.username,
          name: currentUserName,
          score: currentRating,
          problemsSolved: solvedCount,
        });
        const dynamicUserRank = leaderboardStandings.currentUserGlobalRank;

        // 4. Fetch live DB analytics with user's auth token
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
        } catch (apiErr) {
          // Fallback to locally isolated user stats
        }

        const baseAccuracy = solvedCount > 0 ? 85.5 : 0.0;
        const currentStreak = solvedCount > 0 ? 1 : 0;

        setData({
          greeting: `Welcome back, ${currentUserName}!`,
          dsaRating: currentRating,
          userRank: dynamicUserRank,
          problemsSolved: solvedCount,
          accuracy: baseAccuracy,
          currentStreak: currentStreak,
          recentActivity: activities,
          topicProgress: topicProgressData,
          focusAreas: [
            { name: 'Dynamic Programming', tag: 'Dynamic Programming', accuracy: '35%', problemsCount: 8, severity: 'CRITICAL', icon: '🧠' },
            { name: 'Graphs & BFS/DFS', tag: 'Graphs', accuracy: '42%', problemsCount: 5, severity: 'CRITICAL', icon: '🕸️' },
            { name: 'Binary Search', tag: 'Binary Search', accuracy: '52%', problemsCount: 6, severity: 'MODERATE', icon: '🔍' },
            { name: 'Arrays & Two Pointers', tag: 'Arrays', accuracy: '68%', problemsCount: 12, severity: 'RECOMMENDED', icon: '📊' },
          ] as FocusAreaItem[],
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
          <div className="min-h-screen bg-background flex justify-center items-center">
              <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  <p className="text-muted-foreground font-medium animate-pulse">Loading your arena...</p>
              </div>
          </div>
      );
  }

  if (error && !data) {
      return (
          <div className="min-h-screen bg-background p-8 flex flex-col justify-center items-center gap-4">
              <p className="text-destructive font-medium">{error}</p>
              <Button onClick={() => router.push('/login')} variant="outline">Go to Login</Button>
          </div>
      );
  }

  const tier = getRatingTier(data.dsaRating);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Premium Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/dashboard" className="font-extrabold text-2xl tracking-tight text-foreground flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-primary-foreground text-sm font-black">C</span>
                </div>
                Code<span className="text-primary">Arena</span>
            </Link>
            <nav className="hidden md:flex gap-8 text-sm font-medium">
                <Link href="/dashboard" className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] font-semibold">Dashboard</Link>
                <Link href="/problems" className="text-muted-foreground hover:text-foreground transition-colors">Practice</Link>
                <Link href="/assessments" className="text-muted-foreground hover:text-foreground transition-colors">Assessments</Link>
                <Link href="/battles" className="text-muted-foreground hover:text-foreground transition-colors">Battles</Link>
                <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</Link>
                <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
            </nav>
            <div className="flex items-center gap-3">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold gap-1.5 hover:text-primary">
                    <span>👤</span> Profile
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10">
                    <span>🛡️</span> Admin Panel
                  </Button>
                </Link>
                <AccountSwitcher />
            </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-muted-foreground">
                  {data.greeting}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Track your mastery, conquer your weak areas, and rise through the competitive ranks.
                </p>
            </div>
            <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => router.push('/problems')} 
                  className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-full px-8 h-12 text-base font-semibold transition-all hover:scale-105 active:scale-95"
                >
                    Start Practicing
                </Button>
                <Button 
                  onClick={() => router.push('/battles')} 
                  variant="outline" 
                  className="shrink-0 rounded-full px-8 h-12 text-base font-semibold transition-all hover:scale-105 active:scale-95 border-primary/30 hover:border-primary"
                >
                    Enter Battle Arena
                </Button>
                <Button 
                  onClick={() => router.push('/profile')} 
                  variant="secondary" 
                  className="shrink-0 rounded-full px-6 h-12 text-base font-semibold transition-all hover:scale-105 active:scale-95 border border-border shadow-sm flex items-center gap-2 hover:border-primary/50"
                  title="Open full profile with stats, heatmap, and achievements"
                >
                    <span>👤</span> View Full Profile
                </Button>
            </div>
        </div>

        {/* Stats Grid - Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
            {/* DSA Rating Card */}
            <Card 
              className="bg-card/50 backdrop-blur-sm shadow-xl hover:border-primary/50 transition-all group cursor-pointer"
              onClick={() => router.push('/profile')}
              title="Click to view full rating breakdown"
            >
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      DSA Rating
                    </CardTitle>
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push('/leaderboard');
                      }}
                      title="View position on Leaderboard"
                    >
                      Rank #{data.userRank || 1}
                    </span>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-400 to-indigo-600">
                      {data.dsaRating}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className={`font-semibold ${tier.color}`}>
                        ✦ {tier.title}
                      </span>
                      <span className="text-muted-foreground">
                        Next: {tier.nextRating} ({tier.nextTier})
                      </span>
                    </div>
                </CardContent>
            </Card>

            {/* Problems Solved Card */}
            <Card 
              className="bg-card/50 backdrop-blur-sm shadow-xl hover:border-green-500/50 transition-all group cursor-pointer"
              onClick={() => router.push('/problems')}
            >
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      Problems Solved
                    </CardTitle>
                    <span className="text-xs text-emerald-400 font-semibold">+15 pts each</span>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600">
                      {data.problemsSolved}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {data.problemsSolved > 0 ? `${data.problemsSolved} unique solved` : "0 / 150 Target"}
                    </p>
                </CardContent>
            </Card>

            {/* Accuracy Card */}
            <Card className="bg-card/50 backdrop-blur-sm shadow-xl hover:border-purple-500/50 transition-colors group">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      Accuracy
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-600">
                      {data.accuracy}%
                    </div>
                    <p className="text-xs text-purple-400 font-semibold mt-1">
                      High submission quality
                    </p>
                </CardContent>
            </Card>

            {/* Current Streak Card */}
            <Card className="bg-card/50 backdrop-blur-sm shadow-xl hover:border-orange-500/50 transition-colors group">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      Current Streak
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-500 flex items-center gap-2">
                        {data.currentStreak} <span className="text-2xl drop-shadow-md">🔥</span>
                    </div>
                    <p className="text-xs text-orange-400 font-semibold mt-1">
                      Keep solving daily!
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200 fill-mode-both">
            {/* Left Column: Topic Progress & Upcoming */}
            <div className="lg:col-span-2 space-y-8">
                <Card className="bg-card/80 backdrop-blur-md shadow-2xl h-auto">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl text-foreground">Topic Mastery</CardTitle>
                          <CardDescription className="text-muted-foreground">Your proficiency across core data structures.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => router.push('/problems')} className="text-xs text-primary">
                          Explore All Topics &rarr;
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6 mt-2">
                        {data.topicProgress.map((topic: any) => (
                            <div key={topic.topicSlug} className="space-y-2 group">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer" onClick={() => router.push(`/problems?topic=${encodeURIComponent(topic.topicName)}`)}>
                                        {topic.topicName}
                                      </span>
                                      <span className="text-xs text-muted-foreground font-mono">({topic.percentage}%)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-muted-foreground font-medium text-xs">{topic.solved} / {topic.total} solved</span>
                                      <button 
                                        onClick={() => router.push(`/problems?topic=${encodeURIComponent(topic.topicName)}`)}
                                        className="text-xs text-primary hover:underline font-semibold"
                                      >
                                        Practice
                                      </button>
                                    </div>
                                </div>
                                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden shadow-inner relative">
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-1000 ease-out" 
                                        style={{ width: `${Math.max(4, topic.percentage)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Upcoming Battles & Events */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Card className="bg-card/80 backdrop-blur-md shadow-lg border-primary/20 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                ⚔️ Upcoming Battles
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                                    <div>
                                        <p className="font-semibold text-sm">Weekly Global Cup</p>
                                        <p className="text-xs text-muted-foreground mt-1">Starts in 2 hours</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-8" onClick={() => router.push('/battles')}>Join</Button>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                                    <div>
                                        <p className="font-semibold text-sm">1v1 Speed Run</p>
                                        <p className="text-xs text-muted-foreground mt-1">Open Now</p>
                                    </div>
                                    <Button size="sm" className="h-8" onClick={() => router.push('/battles')}>Play</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/80 backdrop-blur-md shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                🏢 Company Assessments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-col p-3 rounded-lg bg-secondary/50">
                                    <p className="font-semibold text-sm">Google - SWE L3</p>
                                    <p className="text-xs text-muted-foreground mt-1">Due: Oct 10, 2026</p>
                                </div>
                                <Button size="sm" variant="link" className="w-full text-primary" onClick={() => router.push('/assessments')}>
                                    View all assessments &rarr;
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right Column: Clickable Focus Areas & Activity */}
            <div className="space-y-8">
                {/* Clickable Focus Areas Card */}
                <Card className="bg-card/80 backdrop-blur-md border-destructive/30 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-destructive via-orange-500 to-amber-500"></div>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2.5 text-destructive font-bold text-lg">
                              <span className="p-1.5 rounded-lg bg-destructive/10 text-base">🎯</span> Focus Areas
                          </CardTitle>
                          <span className="text-xs text-muted-foreground font-medium">Click to practice</span>
                        </div>
                        <CardDescription className="text-xs">
                          Identified weak topics. Solve problems here to maximize your rating growth.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.focusAreas?.map((item: FocusAreaItem, i: number) => (
                            <div 
                              key={i} 
                              onClick={() => router.push(`/problems?topic=${encodeURIComponent(item.tag || item.name)}`)}
                              className="group p-3.5 rounded-xl bg-secondary/40 hover:bg-secondary/90 transition-all border border-border/80 hover:border-primary/50 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between gap-3"
                              title={`Click to practice ${item.name} problems`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl p-1.5 rounded-lg bg-background/60 border border-border/40 shrink-0">
                                      {item.icon || '🎯'}
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                          <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                            {item.name}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                          <span className="text-amber-400 font-medium">{item.accuracy} accuracy</span>
                                          <span>•</span>
                                          <span>{item.problemsCount} problems</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all flex items-center gap-1 shrink-0">
                                    Practice &rarr;
                                  </span>
                                </div>
                            </div>
                        ))}

                        <Button 
                          onClick={() => router.push('/problems')} 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2 text-xs font-semibold hover:border-primary/50"
                        >
                          View All Problem Categories &rarr;
                        </Button>
                    </CardContent>
                </Card>

                {/* Activity Log */}
                <Card className="bg-card/80 backdrop-blur-md shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                            <span className="text-muted-foreground">⚡</span> Activity Log
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => router.push('/profile')} className="text-xs text-muted-foreground hover:text-foreground">
                          Full History
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {data.recentActivity.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No recent activity.</p>
                                <p className="text-xs mt-1">Start practicing to see your history here.</p>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => router.push('/problems')} 
                                  className="mt-3 text-xs"
                                >
                                  Solve a Problem
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {data.recentActivity.slice(0, 5).map((act: any, i: number) => (
                                    <div 
                                      key={i} 
                                      className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0 hover:bg-secondary/30 p-2 rounded-lg transition-colors -mx-1 px-2 cursor-pointer"
                                      onClick={() => router.push(act.slug ? `/problems/${act.slug}` : '/problems')}
                                    >
                                        <div className="flex items-center gap-2.5">
                                          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                          <div>
                                            <span className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                                              {act.title}
                                            </span>
                                            <div className="text-xs text-muted-foreground font-mono">
                                              {act.language || 'Accepted'}
                                            </div>
                                          </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground font-medium shrink-0">
                                            {act.timestamp 
                                              ? new Date(act.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                                              : act.date || 'Recent'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
