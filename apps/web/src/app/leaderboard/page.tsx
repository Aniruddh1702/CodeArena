"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Tabs, TabsList, TabsTrigger, TabsContent, Input } from "@codearena/ui";
import { getLeaderboards, LeaderboardUser, setCachedDbUsers, getCachedDbUsers } from "@/lib/leaderboard-data";
import { getActiveAccount, getUserStats } from "@/lib/auth-session";
import { AccountSwitcher } from "@/components/AccountSwitcher";

export default function LeaderboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("global");

  const [globalLeaders, setGlobalLeaders] = useState<LeaderboardUser[]>([]);
  const [orgLeaders, setOrgLeaders] = useState<LeaderboardUser[]>([]);
  const [userGlobalRank, setUserGlobalRank] = useState(1);
  const [userOrgRank, setUserOrgRank] = useState(1);
  const [userOrgName, setUserOrgName] = useState("CodeArena Academy");
  const [currentRating, setCurrentRating] = useState(1450);
  const [currentSolved, setCurrentSolved] = useState(0);
  const [currentUsername, setCurrentUsername] = useState("student");
  const [currentFullName, setCurrentFullName] = useState("CodeArena Student");

  const loadLeaderboard = (extraDbUsers?: LeaderboardUser[]) => {
    if (typeof window === "undefined") return;
    const active = getActiveAccount();
    const activeId = active?.id || "default";
    const stats = getUserStats(activeId);

    const pName = active?.name || "CodeArena Student";
    const pUsername = active?.username || "student";
    const pOrg = active?.college || "CodeArena Academy";

    setCurrentSolved(stats.problemsSolved);
    setCurrentRating(stats.dsaRating);
    setCurrentFullName(pName);
    setCurrentUsername(pUsername);
    setUserOrgName(pOrg);

    // Calculate authentic standings from real users only
    const results = getLeaderboards(
      {
        username: pUsername,
        name: pName,
        org: pOrg,
        score: stats.dsaRating,
        problemsSolved: stats.problemsSolved,
      },
      extraDbUsers || getCachedDbUsers()
    );

    setGlobalLeaders(results.globalRanked);
    setOrgLeaders(results.orgRanked);
    setUserGlobalRank(results.currentUserGlobalRank);
    setUserOrgRank(results.currentUserOrgRank);
    setUserOrgName(results.orgName);
    setLoading(false);
  };

  useEffect(() => {
    // 1. Initial immediate load from real session accounts
    loadLeaderboard();

    // 2. Fetch all real registered platform users from backend database
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.items)) {
          setCachedDbUsers(data.items);
          loadLeaderboard(data.items);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch database leaderboard:", err);
      });

    // 3. Listen for account switches and multi-account state updates
    const handleAccountChange = () => {
      loadLeaderboard();
    };

    window.addEventListener("codearena_account_changed", handleAccountChange);
    window.addEventListener("storage", handleAccountChange);

    return () => {
      window.removeEventListener("codearena_account_changed", handleAccountChange);
      window.removeEventListener("storage", handleAccountChange);
    };
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Grandmaster": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Candidate Master": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Expert": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Specialist": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Pupil": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const filterLeaders = (list: LeaderboardUser[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.org.toLowerCase().includes(q)
    );
  };

  const displayedGlobal = filterLeaders(globalLeaders);
  const displayedOrg = filterLeaders(orgLeaders);

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
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/problems" className="text-muted-foreground hover:text-foreground transition-colors">Practice</Link>
            <Link href="/assessments" className="text-muted-foreground hover:text-foreground transition-colors">Assessments</Link>
            <Link href="/battles" className="text-muted-foreground hover:text-foreground transition-colors">Battles</Link>
            <Link href="/leaderboard" className="text-primary font-semibold drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]">Leaderboard</Link>
            <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold gap-1.5 hover:text-primary">
                <span>👤</span> Profile
              </Button>
            </Link>
            <AccountSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8 max-w-5xl">
        {/* Header & User Standing Card */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-muted-foreground">
              Competitive Leaderboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Authentic DSA ratings and rankings calculated directly from solved algorithmic challenges.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/problems')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md rounded-full px-6 h-10 text-sm font-semibold shrink-0"
          >
            Solve Problems to Rank Up &rarr;
          </Button>
        </div>

        {/* Live Personal Standing Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-card to-card border border-primary/20 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-black text-xl shadow-md">
              {currentFullName[0] || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-foreground">{currentFullName}</span>
                <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-bold">You</span>
                <span className="text-xs text-muted-foreground font-mono">@{currentUsername}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                <span>Org: <strong className="text-foreground">{userOrgName}</strong></span>
                <span>•</span>
                <span>Solved: <strong className="text-foreground font-mono">{currentSolved} problems</strong></span>
                <span>•</span>
                <span>DSA Rating: <strong className="text-primary font-mono font-bold">{currentRating}</strong></span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border/50">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Global Standing</p>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                #{userGlobalRank}
              </p>
            </div>
            <div className="text-right border-l pl-4 border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Org Standing</p>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                #{userOrgRank}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="bg-secondary/60 p-1">
                <TabsTrigger value="global" className="text-xs font-semibold px-4">
                  🌐 Global Rankings ({globalLeaders.length})
                </TabsTrigger>
                <TabsTrigger value="org" className="text-xs font-semibold px-4">
                  🏢 {userOrgName} ({orgLeaders.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="w-full sm:w-72">
              <Input
                placeholder="Search coder or org..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card border-border text-xs h-9"
              />
            </div>
          </div>

          {/* Leaderboard Table Container */}
          <Card className="bg-card/80 backdrop-blur-md border-border/80 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3.5 font-bold w-16">Rank</th>
                    <th className="px-5 py-3.5 font-bold">Coder</th>
                    <th className="px-5 py-3.5 font-bold hidden md:table-cell">Organization</th>
                    <th className="px-5 py-3.5 font-bold hidden sm:table-cell">Tier</th>
                    <th className="px-5 py-3.5 font-bold text-right">Solved</th>
                    <th className="px-5 py-3.5 font-bold text-right text-primary">DSA Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground animate-pulse">
                        Calculating competitive rankings...
                      </td>
                    </tr>
                  ) : (activeTab === "global" ? displayedGlobal : displayedOrg).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        No competitors match "{searchQuery}".
                      </td>
                    </tr>
                  ) : (
                    (activeTab === "global" ? displayedGlobal : displayedOrg).map((leader) => {
                      const isMe = leader.isCurrentUser;
                      return (
                        <tr 
                          key={leader.userId || leader.username} 
                          className={`transition-colors cursor-pointer ${
                            isMe 
                              ? "bg-primary/10 hover:bg-primary/15 font-medium border-l-4 border-l-primary" 
                              : "hover:bg-muted/30"
                          }`}
                          onClick={() => {
                            if (isMe) {
                              router.push('/profile');
                            } else {
                              router.push(`/profile/${encodeURIComponent(leader.username)}`);
                            }
                          }}
                          title={isMe ? "Click to view your profile" : `Click to view @${leader.username}'s profile`}
                        >
                          {/* Rank */}
                          <td className="px-5 py-4 font-bold font-mono">
                            <span className="flex items-center gap-1.5">
                              {leader.badge ? (
                                <span className="text-base">{leader.badge}</span>
                              ) : (
                                <span className="text-muted-foreground">#{leader.rank}</span>
                              )}
                              {leader.badge && <span className="text-xs font-semibold">#{leader.rank}</span>}
                            </span>
                          </td>

                          {/* Coder Info */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                isMe 
                                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                                  : "bg-secondary text-secondary-foreground border border-border"
                              }`}>
                                {leader.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                              </div>
                              <div className="leading-tight">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-foreground hover:text-primary transition-colors">
                                    {leader.name}
                                  </span>
                                  {isMe && (
                                    <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.2 rounded font-bold uppercase">
                                      You
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground font-mono">
                                  @{leader.username}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Organization */}
                          <td className="px-5 py-4 hidden md:table-cell text-muted-foreground text-xs font-medium">
                            {leader.org}
                          </td>

                          {/* Tier Badge */}
                          <td className="px-5 py-4 hidden sm:table-cell">
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getTierColor(leader.tier)}`}>
                              {leader.tier}
                            </span>
                          </td>

                          {/* Problems Solved */}
                          <td className="px-5 py-4 text-right font-mono text-xs">
                            <span className="font-bold text-foreground">{leader.problemsSolved}</span>
                            <span className="text-muted-foreground"> / 15</span>
                          </td>

                          {/* DSA Rating */}
                          <td className="px-5 py-4 text-right font-mono font-black text-base text-primary">
                            {leader.score}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
