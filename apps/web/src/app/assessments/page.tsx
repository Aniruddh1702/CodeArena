"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Tabs, TabsList, TabsTrigger, TabsContent } from "@codearena/ui";

export default function AssessmentsPage() {
  const router = useRouter();
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from /api/tests/upcoming and /api/tests/recent
    // For now, setting mock data to build UI
    setTimeout(() => {
        setUpcoming([
            { id: 't1', title: 'Weekly Contest 142', type: 'COMPETITION', startTime: new Date(Date.now() - 3600000).toISOString(), duration: 90, status: 'ACTIVE' },
            { id: 't2', title: 'Data Structures Mid-term', type: 'EXAM', startTime: new Date(Date.now() + 172800000).toISOString(), duration: 120, status: 'SCHEDULED' }
        ]);
        setRecent([
            { id: 'r1', testId: 't0', testTitle: 'Arrays Assessment', score: 85, totalPoints: 100, status: 'EVALUATED', timeTaken: 45 }
        ]);
        setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tight text-primary cursor-pointer" onClick={() => router.push('/dashboard')}>
                Code<span className="text-destructive">Arena</span>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                <a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a>
                <a href="/problems" className="hover:text-primary transition-colors">Practice</a>
                <a href="/assessments" className="text-primary font-semibold">Assessments</a>
                <a href="/battles" className="hover:text-primary transition-colors">Battles</a>
                <a href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</a>
            </nav>
            <div className="flex items-center gap-4">
              <div 
                className="h-9 w-9 rounded-full bg-secondary border border-border flex items-center justify-center text-secondary-foreground font-bold hover:ring-2 hover:ring-primary/60 transition-all cursor-pointer shadow-inner"
                onClick={() => router.push('/profile')}
                title="View Profile"
              >
                U
              </div>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h1 className="text-3xl font-bold tracking-tight">Assessments & Contests</h1>
                  <p className="text-muted-foreground">Participate in scheduled tests, company assessments, and global contests.</p>
              </div>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">Upcoming / Active</TabsTrigger>
                  <TabsTrigger value="past" className="flex-1 sm:flex-none">Past Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-6 space-y-4">
                  {loading ? (
                      <div className="text-center text-muted-foreground py-10 animate-pulse">Loading assessments...</div>
                  ) : upcoming.length === 0 ? (
                      <Card className="py-12 text-center text-muted-foreground">No upcoming assessments found.</Card>
                  ) : (
                      upcoming.map(test => (
                          <Card key={test.id} className="hover:border-primary/50 transition-colors">
                              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                  <div>
                                      <div className="flex items-center gap-2 mb-1">
                                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${test.type === 'EXAM' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                              {test.type}
                                          </span>
                                          <span className={`text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground`}>
                                              {test.duration} mins
                                          </span>
                                      </div>
                                      <h3 className="text-xl font-bold">{test.title}</h3>
                                      <p className="text-sm text-muted-foreground mt-1">Starts: {new Date(test.startTime).toLocaleString()}</p>
                                  </div>
                                  <Button 
                                    onClick={() => router.push(`/assessments/${test.id}`)}
                                    disabled={new Date(test.startTime) > new Date()}
                                  >
                                      {new Date(test.startTime) > new Date() ? 'Not Started' : 'Enter Assessment'}
                                  </Button>
                              </CardContent>
                          </Card>
                      ))
                  )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-6">
                 {loading ? (
                      <div className="text-center text-muted-foreground py-10">Loading results...</div>
                  ) : recent.length === 0 ? (
                      <Card className="py-12 text-center text-muted-foreground">No past assessments found.</Card>
                  ) : (
                      <div className="space-y-4">
                           {recent.map(res => (
                              <Card key={res.id}>
                                  <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                      <div>
                                          <h3 className="text-lg font-bold">{res.testTitle}</h3>
                                          <p className="text-sm text-muted-foreground mt-1">Time taken: {res.timeTaken} mins</p>
                                      </div>
                                      <div className="text-right">
                                          <div className="text-2xl font-bold text-primary">{res.score} <span className="text-sm text-muted-foreground">/ {res.totalPoints}</span></div>
                                          <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full mt-1 inline-block">Evaluated</span>
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
