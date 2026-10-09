"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from "@codearena/ui";
import { getContests, Contest, registerUserForContest } from "@/lib/contests-data";
import { getActiveAccount } from "@/lib/auth-session";
import { NotificationCenter } from "@/components/NotificationCenter";
import { saveNotification, requestBrowserNotificationPermission } from "@/lib/notifications";

export default function ContestsPage() {
  const router = useRouter();
  const [contests, setContests] = useState<Contest[]>([]);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "LIVE" | "UPCOMING" | "ENDED">("ALL");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [now, setNow] = useState(Date.now());
  const [reminderNoticedId, setReminderNoticedId] = useState<string | null>(null);

  useEffect(() => {
    const user = getActiveAccount();
    if (!user) {
      router.push("/login?redirect=/contests");
      return;
    }
    setCurrentUser(user);
    setContests(getContests());

    // Fetch live contests from server API
    fetch("/api/contests")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.contests) && data.contests.length > 0) {
          setContests(data.contests);
        }
      })
      .catch(() => {});

    const timer = setInterval(() => {
      setNow(Date.now());
      setContests(getContests());
    }, 1000);

    const handleUpdate = () => {
      setContests(getContests());
    };

    window.addEventListener("codearena_contests_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      clearInterval(timer);
      window.removeEventListener("codearena_contests_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [router]);

  const formatCountdown = (targetTimeStr: string) => {
    const diff = new Date(targetTimeStr).getTime() - now;
    if (diff <= 0) return "00:00:00";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleRegister = (contestId: string) => {
    if (!currentUser) {
      router.push("/login?redirect=/contests");
      return;
    }
    registerUserForContest(contestId, currentUser.email);
    setContests(getContests());
  };

  const handleSetReminder = async (contest: Contest) => {
    await requestBrowserNotificationPermission();
    saveNotification({
      title: "🔔 Contest Reminder Set",
      message: `You will be alerted 1 hour before '${contest.title}' begins!`,
      type: "CONTEST_SCHEDULED",
      contestId: contest.id,
      contestTitle: contest.title,
      actionUrl: `/contests/${contest.id}`,
    });
    setReminderNoticedId(contest.id);
    setTimeout(() => setReminderNoticedId(null), 3000);
  };

  const liveContests = contests.filter(c => c.status === "LIVE");
  const upcomingContests = contests.filter(c => c.status === "UPCOMING");
  const pastContests = contests.filter(c => c.status === "ENDED");

  // Check if any contest is starting in <= 60 minutes
  const contestStartingSoon = upcomingContests.find(c => {
    const diffMins = (new Date(c.startTime).getTime() - now) / (1000 * 60);
    return diffMins > 0 && diffMins <= 60;
  });

  const filteredContests = contests.filter(c => {
    if (activeFilter === "ALL") return true;
    return c.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Navigation Header */}
      <header className="border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-black shadow-md shadow-primary/20">
                ⚡
              </span>
              <span>CodeArena</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link href="/problems" className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                Practice (150 DSA)
              </Link>
              <Link href="/contests" className="px-3 py-1.5 rounded-md text-primary font-semibold bg-primary/10 transition-colors flex items-center gap-1.5">
                <span>Contests</span>
                {liveContests.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </Link>
              <Link href="/leaderboard" className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                Leaderboard
              </Link>
              <Link href="/dashboard" className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <NotificationCenter />

            {currentUser?.isAdmin && (
              <Link href="/admin">
                <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 border-amber-500/40 text-amber-500 hover:bg-amber-500/10">
                  <span>⚙️</span> Admin Panel
                </Button>
              </Link>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                  {currentUser.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-xs font-medium hidden sm:inline">{currentUser.name}</span>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="text-xs h-8 font-bold">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 1-Hour Contest Notification Banner */}
      {contestStartingSoon && (
        <div className="bg-gradient-to-r from-amber-500/20 via-primary/20 to-amber-500/20 border-b border-amber-500/30 px-4 py-2.5">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-base animate-bounce">⏰</span>
              <span className="font-bold text-amber-400">Upcoming Contest Starting in &lt; 1 Hour:</span>
              <span className="font-semibold text-foreground">{contestStartingSoon.title}</span>
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                Starts in {formatCountdown(contestStartingSoon.startTime)}
              </span>
            </div>

            <Link href={`/contests/${contestStartingSoon.id}`}>
              <Button size="sm" className="h-7 text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-black gap-1 shadow-sm">
                <span>⚡</span> Enter Lobby Now
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-card/80 to-background py-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <span>🏆</span> Live & Weekly Competitive Programming
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              Algorithm Contests & Battles
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Test your algorithmic problem-solving speed under real-time contest clocks. Gain rating points, climb the global leaderboard, and solve curated challenges.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="p-3.5 rounded-xl bg-card border border-border/70 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg font-bold">
                🟢
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-semibold uppercase">Live Now</p>
                <p className="text-lg font-black">{liveContests.length} Contests</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/70 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-lg font-bold">
                ⏱️
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-semibold uppercase">Upcoming</p>
                <p className="text-lg font-black">{upcomingContests.length} Scheduled</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/70 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center text-lg font-bold">
                👥
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-semibold uppercase">Contestants</p>
                <p className="text-lg font-black">{contests.reduce((acc, c) => acc + c.participantsCount, 0)}+</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/70 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg font-bold">
                ⭐
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-semibold uppercase">Rated Arena</p>
                <p className="text-lg font-black">ICPC Standard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8 flex-1 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === "ALL"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              All Contests ({contests.length})
            </button>
            <button
              onClick={() => setActiveFilter("LIVE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === "LIVE"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Live ({liveContests.length})
            </button>
            <button
              onClick={() => setActiveFilter("UPCOMING")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === "UPCOMING"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Upcoming ({upcomingContests.length})
            </button>
            <button
              onClick={() => setActiveFilter("ENDED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === "ENDED"
                  ? "bg-secondary text-foreground font-extrabold border border-border"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Past Archive ({pastContests.length})
            </button>
          </div>

          {currentUser?.isAdmin && (
            <Link href="/admin">
              <Button size="sm" className="h-8 text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-md shadow-primary/20">
                <span>➕</span> Create / Launch Contest (Admin)
              </Button>
            </Link>
          )}
        </div>

        {/* Contests List */}
        {filteredContests.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border/80 p-8 space-y-3">
            <span className="text-4xl">🏆</span>
            <h3 className="text-base font-bold">No contests found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Create a scheduled or live contest from the admin panel to start a competitive session.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredContests.map((contest) => {
              const isLive = contest.status === "LIVE";
              const isUpcoming = contest.status === "UPCOMING";
              const isRegistered = currentUser && contest.registeredUsers.includes(currentUser.email);
              const totalPoints = contest.problems.reduce((sum, p) => sum + p.points, 0);

              return (
                <Card
                  key={contest.id}
                  className={`overflow-hidden border transition-all duration-200 hover:shadow-lg ${
                    isLive
                      ? "border-emerald-500/50 bg-gradient-to-br from-card via-card to-emerald-950/10 shadow-emerald-500/5"
                      : isUpcoming
                      ? "border-blue-500/30 hover:border-blue-500/50"
                      : "border-border/70 opacity-90 hover:opacity-100"
                  }`}
                >
                  <CardHeader className="pb-3 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isLive ? (
                          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] px-2.5 py-0.5 gap-1.5 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            LIVE NOW
                          </Badge>
                        ) : isUpcoming ? (
                          <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold text-[10px] px-2 py-0.5">
                            UPCOMING
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="font-semibold text-[10px] px-2 py-0.5">
                            ENDED
                          </Badge>
                        )}

                        {contest.isRated && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            ⭐ Rated
                          </span>
                        )}

                        <span className="text-[10px] text-muted-foreground font-medium">
                          ⏱️ {contest.durationMinutes} Mins
                        </span>
                      </div>

                      {/* Live Clock / Countdown */}
                      {isLive && (
                        <div className="text-right">
                          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Ends In</p>
                          <p className="font-mono text-xs font-black text-emerald-400">{formatCountdown(contest.endTime)}</p>
                        </div>
                      )}
                      {isUpcoming && (
                        <div className="text-right">
                          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Starts In</p>
                          <p className="font-mono text-xs font-black text-blue-400">{formatCountdown(contest.startTime)}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <CardTitle className="text-base sm:text-lg font-bold hover:text-primary transition-colors">
                        <Link href={`/contests/${contest.id}`}>
                          {contest.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {contest.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-1">
                    {/* Problem Preview Pills */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                        <span>Problem Challenges ({contest.problems.length})</span>
                        <span className="text-primary font-bold">{totalPoints} Max Points</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {contest.problems.map((prob, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-secondary/60 border border-border/60 text-left space-y-0.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-muted-foreground">Q{idx + 1}</span>
                              <span className={`text-[9px] font-bold px-1 rounded ${
                                prob.difficulty === "EASY" ? "bg-emerald-500/10 text-emerald-500" :
                                prob.difficulty === "MEDIUM" ? "bg-amber-500/10 text-amber-500" :
                                "bg-rose-500/10 text-rose-500"
                              }`}>
                                {prob.difficulty[0]}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium truncate" title={prob.title}>
                              {prob.title}
                            </p>
                            <p className="text-[9px] text-muted-foreground font-mono">{prob.points} pts</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Info & Action CTA */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span>👥</span> {contest.participantsCount} Registered
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline text-[11px]">
                          {new Date(contest.startTime).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isLive ? (
                          <Link href={`/contests/${contest.id}`}>
                            <Button size="sm" className="h-8 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-md shadow-emerald-600/20">
                              <span>🚀</span> Enter Arena
                            </Button>
                          </Link>
                        ) : isUpcoming ? (
                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSetReminder(contest)}
                              className="h-8 text-xs font-semibold gap-1 text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                              title="Alert me 1 hour before contest begins"
                            >
                              <span>🔔</span> {reminderNoticedId === contest.id ? "Alert Set!" : "1hr Alert"}
                            </Button>

                            {isRegistered ? (
                              <Button size="sm" variant="outline" disabled className="h-8 text-xs font-bold border-emerald-500/40 text-emerald-500">
                                <span>✓</span> Registered
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleRegister(contest.id)}
                                className="h-8 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1"
                              >
                                <span>📝</span> Register
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Link href={`/contests/${contest.id}`}>
                            <Button size="sm" variant="secondary" className="h-8 text-xs font-semibold gap-1">
                              <span>📊</span> Standings & Upsolve
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
