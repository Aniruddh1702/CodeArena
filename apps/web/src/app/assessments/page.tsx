"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, Button, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from "@codearena/ui";
import { getActiveAccount, getUserAssessments, UserAccount, UserAssessmentRecord } from "@/lib/auth-session";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { NotificationCenter } from "@/components/NotificationCenter";

export default function AssessmentsPage() {
  const router = useRouter();
  const [activeAccount, setActiveAccount] = useState<UserAccount | null>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [recent, setRecent] = useState<UserAssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    const active = getActiveAccount();
    if (!active) {
      router.push("/login?redirect=/assessments");
      return;
    }
    setActiveAccount(active);

    // 1. Fetch available tests from backend API
    fetch("/api/org/tests")
      .then((res) => res.json())
      .then((data) => {
        if (data.tests) {
          setUpcoming(data.tests);
        } else {
          setUpcoming([
            { id: "t1", title: "Data Structures Mid-term", type: "EXAM", startTime: new Date(Date.now() - 3600000).toISOString(), durationMinutes: 120, status: "ACTIVE" },
            { id: "t2", title: "Weekly Coding Challenge", type: "COMPETITION", startTime: new Date().toISOString(), durationMinutes: 90, status: "ACTIVE" },
            { id: "t3", title: "Arrays Basic Assessment", type: "PRACTICE", startTime: new Date(Date.now() - 604800000).toISOString(), durationMinutes: 60, status: "COMPLETED" },
          ]);
        }
      })
      .catch(() => {
        setUpcoming([
          { id: "t1", title: "Data Structures Mid-term", type: "EXAM", startTime: new Date(Date.now() - 3600000).toISOString(), durationMinutes: 120, status: "ACTIVE" },
          { id: "t2", title: "Weekly Coding Challenge", type: "COMPETITION", startTime: new Date().toISOString(), durationMinutes: 90, status: "ACTIVE" },
          { id: "t3", title: "Arrays Basic Assessment", type: "PRACTICE", startTime: new Date(Date.now() - 604800000).toISOString(), durationMinutes: 60, status: "COMPLETED" },
        ]);
      })
      .finally(() => {
        // 2. Load student's authentic assessment history
        const userHistory = getUserAssessments(active.id);
        setRecent(userHistory);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    window.addEventListener("codearena_account_changed", loadData);
    return () => {
      window.removeEventListener("codearena_account_changed", loadData);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1. Header */}
      <header className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
              <span className="text-white text-base font-black">C</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Code<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Arena</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/problems" className="hover:text-primary transition-colors">Practice</Link>
            <Link href="/contests" className="hover:text-primary transition-colors text-amber-400 font-medium">Contests</Link>
            <Link href="/assessments" className="text-primary font-semibold">Assessments</Link>
            <Link href="/battles" className="hover:text-primary transition-colors">Battles</Link>
            <Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link>
            <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>
          </nav>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold gap-1.5 hover:text-primary">
                <span>👤</span> Profile
              </Button>
            </Link>
            <AccountSwitcher />
          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8 space-y-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-mono font-black tracking-widest text-primary">
                Institutional Tests
              </span>
              <Badge variant="outline" className="text-[10px] font-bold border-primary/30">
                Auto-Graded
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Assessments & Exams</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Complete proctored coding assessments. Grades are evaluated and reported live to instructors.
            </p>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-secondary/40 p-1 border border-border/60">
            <TabsTrigger value="upcoming" className="font-semibold text-xs px-4">
              Active & Upcoming Tests
            </TabsTrigger>
            <TabsTrigger value="past" className="font-semibold text-xs px-4">
              My Assessment Results ({recent.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Active Tests */}
          <TabsContent value="upcoming" className="mt-6 space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground py-16 animate-pulse">
                Loading available assessments...
              </div>
            ) : upcoming.length === 0 ? (
              <Card className="py-16 text-center text-muted-foreground bg-card/40 border-border/60">
                No active assessments currently assigned to your batch.
              </Card>
            ) : (
              upcoming.map((test) => {
                const isScheduledFuture = new Date(test.startTime) > new Date();
                return (
                  <Card key={test.id} className="hover:border-primary/40 transition-all bg-card/40 backdrop-blur-sm border-border/70 shadow-sm">
                    <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                            test.type === "EXAM"
                              ? "bg-destructive/10 text-destructive border border-destructive/30"
                              : test.type === "COMPETITION"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : "bg-primary/10 text-primary border border-primary/30"
                          }`}>
                            {test.type}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            ⏱️ {test.durationMinutes || test.duration || 90} mins
                          </span>
                        </div>
                        <h3 className="text-lg font-bold">{test.title}</h3>
                        <p className="text-xs text-muted-foreground font-mono">
                          Schedule: {new Date(test.startTime).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link href={`/org/tests/${test.id}/report`}>
                          <Button variant="ghost" size="sm" className="h-9 text-xs font-semibold text-muted-foreground hover:text-foreground">
                            View Org Report
                          </Button>
                        </Link>
                        <Button
                          onClick={() => router.push(`/assessments/${test.id}`)}
                          disabled={isScheduledFuture}
                          className="h-9 px-5 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/25"
                        >
                          {isScheduledFuture ? "Locked (Upcoming)" : "Enter Proctored Exam 🚀"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Tab 2: Student Past Results */}
          <TabsContent value="past" className="mt-6">
            {loading ? (
              <div className="text-center text-muted-foreground py-16 animate-pulse">
                Loading student results...
              </div>
            ) : recent.length === 0 ? (
              <Card className="py-16 text-center text-muted-foreground bg-card/40 border-border/60">
                You haven&apos;t completed any assessments yet. Enter an active assessment to record your grade!
              </Card>
            ) : (
              <div className="space-y-4">
                {recent.map((res) => (
                  <Card key={res.id} className="bg-card/40 border-border/70">
                    <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-muted-foreground">
                            {res.date}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            res.status === "DISQUALIFIED"
                              ? "bg-destructive/10 text-destructive border border-destructive/30"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          }`}>
                            {res.status === "DISQUALIFIED" ? "Disqualified" : "Evaluated"}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold">{res.testTitle}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Time taken: {res.timeTaken} mins • Language: <span className="font-mono uppercase">{res.language || "JavaScript"}</span>
                          {res.passedTestCases !== undefined && res.totalTestCases !== undefined && (
                            <> • Test Cases: <strong>{res.passedTestCases}/{res.totalTestCases}</strong></>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className={`text-2xl font-black font-mono ${
                            res.score >= 70 ? "text-emerald-400" : res.score >= 40 ? "text-amber-400" : "text-destructive"
                          }`}>
                            {res.score}%
                          </div>
                          <span className="text-[11px] text-muted-foreground">Total Points: {res.score}/100</span>
                        </div>

                        <Link href={`/org/tests/${res.testId}/report`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                            Report Details &rarr;
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
