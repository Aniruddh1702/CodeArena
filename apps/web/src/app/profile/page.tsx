"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from "@codearena/ui";
import { getLeaderboards } from "@/lib/leaderboard-data";
import { getActiveAccount, getUserStats, UserAccount } from "@/lib/auth-session";
import { AccountSwitcher } from "@/components/AccountSwitcher";

interface UserProfile {
  name: string;
  username: string;
  email?: string;
  bio: string;
  organization: string;
  github: string;
  joinedDate: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    name: "CodeArena Student",
    username: "student",
    bio: "Passionate competitive programmer & software engineer. Mastering advanced algorithms, system design, and competitive DSA.",
    organization: "CodeArena Academy",
    github: "codearena-student",
    joinedDate: "October 2026",
  });

  const [dsaRating, setDsaRating] = useState(1450);
  const [globalRank, setGlobalRank] = useState(1);
  const [solvedCount, setSolvedCount] = useState(0);
  const [accuracy, setAccuracy] = useState(85.5);
  const [currentStreak, setCurrentStreak] = useState(1);
  const [recentSolves, setRecentSolves] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const active = getActiveAccount();
      if (!active) {
        router.push("/login");
        return;
      }

      const activeProfile: UserProfile = {
        name: active.name || active.username,
        username: active.username,
        email: active.email,
        bio: active.bio || "Competitive Programmer & DSA Enthusiast",
        organization: active.college || "CodeArena University",
        github: active.username,
        joinedDate: "October 2026",
      };

      setProfile(activeProfile);
      setEditForm(activeProfile);

      // Isolated stats for this account
      const stats = getUserStats(active.id);
      setSolvedCount(stats.problemsSolved);
      setDsaRating(stats.dsaRating);
      setAccuracy(stats.problemsSolved > 0 ? 85.5 : 0.0);
      setCurrentStreak(stats.problemsSolved > 0 ? 1 : 0);
      setRecentSolves(stats.recentActivity);

      // Dynamic global rank
      const lb = getLeaderboards({
        username: active.username,
        name: active.name,
        org: activeProfile.organization,
        score: stats.dsaRating,
        problemsSolved: stats.problemsSolved,
      });
      setGlobalRank(lb.currentUserGlobalRank);
    }
  }, [router]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    if (typeof window !== "undefined") {
      localStorage.setItem("userProfile", JSON.stringify(editForm));
    }
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Rating Tier helper
  const getRatingTier = (rating: number) => {
    if (rating >= 2200) return { title: "Grandmaster", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" };
    if (rating >= 1900) return { title: "Candidate Master", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" };
    if (rating >= 1600) return { title: "Expert", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" };
    if (rating >= 1400) return { title: "Specialist", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" };
    if (rating >= 1200) return { title: "Pupil", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" };
    return { title: "Newbie", color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/30" };
  };

  const tier = getRatingTier(dsaRating);

  // Generate mock activity heatmap (90 days)
  const heatmapData = Array.from({ length: 90 }, (_, i) => {
    // Generate denser activity for recent days
    if (i > 80 && solvedCount > 0) return Math.min(4, Math.floor(Math.random() * 4) + 1);
    if (i % 7 === 0 || i % 11 === 0) return Math.floor(Math.random() * 3) + 1;
    return i % 3 === 0 ? 1 : 0;
  });

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-muted/40 hover:bg-muted/60";
    if (count === 1) return "bg-emerald-950 text-emerald-300 hover:bg-emerald-900";
    if (count === 2) return "bg-emerald-700 hover:bg-emerald-600";
    if (count === 3) return "bg-emerald-500 hover:bg-emerald-400";
    return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]";
  };

  const achievements = [
    { name: "First Blood", desc: "Successfully submitted your first algorithm solution", icon: "🎯", unlocked: solvedCount > 0 },
    { name: "Arena Gladiator", desc: "Competed in real-time 1v1 Battle Arena", icon: "⚔️", unlocked: true },
    { name: "Specialist Rank", desc: "Surpassed 1400+ competitive DSA rating", icon: "🏆", unlocked: dsaRating >= 1400 },
    { name: "Speed Demon", desc: "Submitted an accepted solution under 60ms", icon: "⚡", unlocked: true },
    { name: "Problem Crusher", desc: "Solved 10+ Data Structures problems", icon: "💎", unlocked: solvedCount >= 10 },
    { name: "Consistency King", desc: "Maintained a 7-day active coding streak", icon: "🔥", unlocked: false },
  ];

  const topics = [
    { name: "Arrays", solved: Math.min(50, Math.max(1, solvedCount)), total: 50, color: "from-blue-500 to-cyan-500" },
    { name: "Strings", solved: Math.min(30, Math.floor(solvedCount * 0.6)), total: 30, color: "from-purple-500 to-pink-500" },
    { name: "Dynamic Programming", solved: Math.min(40, Math.floor(solvedCount * 0.3)), total: 40, color: "from-orange-500 to-amber-500" },
    { name: "Trees & Graphs", solved: Math.min(35, Math.floor(solvedCount * 0.4)), total: 35, color: "from-emerald-500 to-teal-500" },
    { name: "Binary Search", solved: Math.min(25, Math.floor(solvedCount * 0.5)), total: 25, color: "from-indigo-500 to-violet-500" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-extrabold text-2xl tracking-tight text-foreground flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground text-sm font-black">C</span>
            </div>
            Code<span className="text-primary">Arena</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/problems" className="text-muted-foreground hover:text-foreground transition-colors">Practice</Link>
            <Link href="/assessments" className="text-muted-foreground hover:text-foreground transition-colors">Assessments</Link>
            <Link href="/battles" className="text-muted-foreground hover:text-foreground transition-colors">Battles</Link>
            <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</Link>
          </nav>
          <div className="flex items-center gap-4">
            <AccountSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-10 max-w-6xl">
        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <span>✓</span> Profile updated successfully!
          </div>
        )}

        {/* Profile Hero Header */}
        <Card className="bg-card/80 backdrop-blur-md border-primary/20 shadow-2xl overflow-hidden relative">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-full relative">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          </div>
          <CardContent className="pt-0 px-6 sm:px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-14 mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 border-4 border-background flex items-center justify-center text-4xl font-black text-primary-foreground shadow-2xl">
                    {profile.name.split(" ").map(n => n[0]).join("") || "U"}
                  </div>
                  <div className="absolute bottom-1 right-1 h-5 w-5 bg-emerald-500 border-2 border-background rounded-full shadow-sm" title="Online" />
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{profile.name}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${tier.bg} ${tier.color} ${tier.border}`}>
                      ✦ {tier.title}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium text-sm">@{profile.username} • {profile.organization}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center sm:justify-end">
                <Button 
                  onClick={() => setIsEditing(!isEditing)} 
                  variant="outline" 
                  className="rounded-full px-5 hover:border-primary/50 transition-all font-semibold"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
                <Button 
                  onClick={() => router.push('/problems')} 
                  className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
                >
                  Practice DSA
                </Button>
              </div>
            </div>

            {/* Profile Bio & Metadata */}
            <p className="text-muted-foreground max-w-3xl leading-relaxed text-sm sm:text-base mb-6">
              {profile.bio}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/60 text-xs sm:text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <span>📅</span> Joined {profile.joinedDate}
              </div>
              <div className="flex items-center gap-1.5">
                <span>🏢</span> {profile.organization}
              </div>
              {profile.github && (
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <span>🐙</span> github.com/{profile.github}
                </div>
              )}
              <div 
                className="flex items-center gap-1.5 text-primary font-semibold cursor-pointer hover:underline"
                onClick={() => router.push('/leaderboard')}
                title="View on Leaderboard"
              >
                <span>🏆</span> Global Rank: #{globalRank}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Modal / Drawer */}
        {isEditing && (
          <Card className="bg-card/90 backdrop-blur-md border-primary/40 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <CardHeader>
              <CardTitle className="text-xl">Edit Your Profile</CardTitle>
              <CardDescription>Update your personal information displayed across CodeArena.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Full Name</label>
                    <Input 
                      value={editForm.name} 
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Username</label>
                    <Input 
                      value={editForm.username} 
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Organization / University</label>
                    <Input 
                      value={editForm.organization} 
                      onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">GitHub Handle</label>
                    <Input 
                      value={editForm.github} 
                      onChange={(e) => setEditForm({ ...editForm, github: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Bio</label>
                  <Input 
                    value={editForm.bio} 
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} 
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/60 backdrop-blur-md border-primary/20 shadow-xl group hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                DSA Rating
                <span className="text-base">📈</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-600">
                {dsaRating}
              </div>
              <p className={`text-xs font-semibold mt-1 ${tier.color}`}>
                ✦ {tier.title} • Top 12%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-md border-emerald-500/20 shadow-xl group hover:border-emerald-500/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                Problems Solved
                <span className="text-base">✅</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600">
                {solvedCount}
              </div>
              <p className="text-xs text-muted-foreground font-semibold mt-1">
                Easy: {Math.max(1, solvedCount)} • Med: 0 • Hard: 0
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-md border-purple-500/20 shadow-xl group hover:border-purple-500/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                Accuracy Rate
                <span className="text-base">🎯</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-600">
                {accuracy}%
              </div>
              <p className="text-xs text-purple-400 font-semibold mt-1">
                High submission precision
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-md border-orange-500/20 shadow-xl group hover:border-orange-500/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                Active Streak
                <span className="text-base">🔥</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-500 flex items-center gap-1">
                {currentStreak} <span className="text-2xl">Days</span>
              </div>
              <p className="text-xs text-orange-400 font-semibold mt-1">
                Keep coding daily to level up!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Heatmap */}
        <Card className="bg-card/70 backdrop-blur-md border-border shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <span>🗓️</span> 90-Day Submission Activity
              </CardTitle>
              <CardDescription>Daily coding activity, problem submissions, and battle duels.</CardDescription>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
              {solvedCount > 0 ? `${solvedCount + 8} contributions` : "Active Coder"}
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5 p-4 rounded-xl bg-secondary/30 border border-border/50">
              {heatmapData.map((count, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] transition-all duration-200 cursor-pointer ${getHeatmapColor(count)}`}
                  title={`${count} submissions on day ${90 - i}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>90 days ago</span>
              <div className="flex items-center gap-2">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-muted/40" />
                <div className="w-3 h-3 rounded-sm bg-emerald-950" />
                <div className="w-3 h-3 rounded-sm bg-emerald-700" />
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                <span>More</span>
              </div>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>

        {/* Topic Mastery & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Topic Mastery */}
          <Card className="bg-card/80 backdrop-blur-md shadow-xl border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <span>📚</span> Topic Proficiency
                </CardTitle>
                <CardDescription>Track mastery across key data structure categories.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => router.push('/problems')} className="text-xs">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {topics.map((t) => {
                const pct = Math.floor((t.solved / t.total) * 100);
                return (
                  <div key={t.name} className="space-y-2 group">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{t.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{pct}%</span>
                      </div>
                      <Link 
                        href={`/problems?topic=${encodeURIComponent(t.name)}`}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Practice &rarr;
                      </Link>
                    </div>
                    <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${t.color} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.max(8, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Badges & Achievements */}
          <Card className="bg-card/80 backdrop-blur-md shadow-xl border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <span>🏅</span> Badges & Achievements
              </CardTitle>
              <CardDescription>Milestones unlocked on your CodeArena journey.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {achievements.map((ach, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      ach.unlocked 
                        ? "bg-secondary/40 border-primary/20 hover:border-primary/50 shadow-sm" 
                        : "bg-muted/10 border-border/40 opacity-50 grayscale"
                    }`}
                  >
                    <div className="text-2xl p-2 rounded-lg bg-background/50 border shrink-0">{ach.icon}</div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm text-foreground">{ach.name}</p>
                        {ach.unlocked && <span className="text-xs text-primary">✓</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{ach.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Solved History */}
        <Card className="bg-card/80 backdrop-blur-md shadow-xl border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <span>⚡</span> Recent Submissions
              </CardTitle>
              <CardDescription>Your latest accepted code submissions.</CardDescription>
            </div>
            <Button size="sm" onClick={() => router.push('/problems')} className="text-xs">
              Solve New Problem
            </Button>
          </CardHeader>
          <CardContent>
            {recentSolves.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground space-y-3">
                <p>No recent submissions logged yet.</p>
                <Button variant="outline" size="sm" onClick={() => router.push('/problems')}>
                  Start Practicing Now
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase border-b border-border/60">
                    <tr>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Problem</th>
                      <th className="py-3 px-4">Language</th>
                      <th className="py-3 px-4">Runtime</th>
                      <th className="py-3 px-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {recentSolves.map((solve, i) => (
                      <tr key={i} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Accepted
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-primary hover:underline cursor-pointer" onClick={() => router.push(`/problems/${solve.slug || 'two-sum'}`)}>
                          {solve.title}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{solve.language || "JavaScript"}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{solve.runtime || "48ms"}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{solve.date || "Just now"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
