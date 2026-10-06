"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@codearena/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function OrgAnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Mock Analytics Data
  const batchPerformance = [
      { name: 'CS 2026 - A', avgScore: 78, participation: 95 },
      { name: 'CS 2026 - B', avgScore: 72, participation: 88 },
      { name: 'Placement 26', avgScore: 85, participation: 100 },
      { name: 'Data Sci 25', avgScore: 68, participation: 75 },
  ];

  const activityTrend = [
      { week: 'W1', submissions: 420 },
      { week: 'W2', submissions: 580 },
      { week: 'W3', submissions: 490 },
      { week: 'W4', submissions: 710 },
      { week: 'W5', submissions: 850 },
      { week: 'W6', submissions: 1050 },
  ];

  useEffect(() => {
      setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
      return <div className="min-h-screen bg-background flex justify-center items-center">Loading Analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Org Navbar */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tight flex items-center gap-2">
                <span className="text-primary">Code<span className="text-destructive">Arena</span></span>
                <span className="text-muted-foreground text-sm font-normal">/ Org Panel</span>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                <a href="/org/dashboard" className="hover:text-primary transition-colors">Overview</a>
                <a href="/org/batches" className="hover:text-primary transition-colors">Batches</a>
                <a href="/org/tests" className="hover:text-primary transition-colors">Test Assignments</a>
                <a href="/org/analytics" className="text-primary">Analytics</a>
            </nav>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>Exit</Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
          <div>
              <h1 className="text-3xl font-bold tracking-tight">Organization Analytics</h1>
              <p className="text-muted-foreground">Macro-level performance insights across all batches.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Batch Performance Chart */}
              <Card>
                  <CardHeader>
                      <CardTitle>Batch Performance (Avg Score %)</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={batchPerformance} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                              <RechartsTooltip 
                                  cursor={{fill: 'hsl(var(--muted))'}} 
                                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                              />
                              <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Average Score" />
                          </BarChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>

              {/* Engagement Trend Chart */}
              <Card>
                  <CardHeader>
                      <CardTitle>Platform Engagement (Submissions/Week)</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={activityTrend} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                              <RechartsTooltip 
                                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                              />
                              <Line type="monotone" dataKey="submissions" stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ r: 4 }} name="Code Submissions" activeDot={{ r: 6 }} />
                          </LineChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>
          </div>

          <Card>
              <CardHeader>
                  <CardTitle>Identified Weak Areas</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                          <p className="font-bold text-destructive">Dynamic Programming</p>
                          <p className="text-sm mt-1">42% accuracy across org</p>
                      </div>
                      <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                          <p className="font-bold text-orange-500">Graph Theory</p>
                          <p className="text-sm mt-1">51% accuracy across org</p>
                      </div>
                      <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                          <p className="font-bold text-orange-500">Advanced Trees</p>
                          <p className="text-sm mt-1">58% accuracy across org</p>
                      </div>
                  </div>
              </CardContent>
          </Card>
      </main>
    </div>
  );
}
