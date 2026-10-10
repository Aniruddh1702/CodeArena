"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@codearena/ui";

export default function OrgDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState<any>(null);

  useEffect(() => {
    // Mock fetching org data for a TEACHER role
    setTimeout(() => {
        setOrgData({
            name: "University of Tech",
            slug: "u-tech",
            stats: {
                totalStudents: 1450,
                activeBatches: 12,
                testsConducted: 45,
                avgPlatformRating: 1320
            },
            recentBatches: [
                { id: 'b1', name: 'CS 2026 - Section A', studentCount: 65, activeTest: 'Mid-term DSA' },
                { id: 'b2', name: 'CS 2026 - Section B', studentCount: 62, activeTest: 'None' },
                { id: 'b3', name: 'Placement Prep 26', studentCount: 120, activeTest: 'Mock Interview 1' },
            ]
        });
        setLoading(false);
    }, 600);
  }, []);

  if (loading) {
      return <div className="min-h-screen bg-background flex justify-center items-center">Loading Organization Data...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Org Navbar */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
                <span className="text-white text-sm font-black">C</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Code<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Arena</span>
                </span>
                <span className="text-muted-foreground text-xs font-mono">/ Org</span>
              </div>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                <a href="/org/dashboard" className="text-primary">Overview</a>
                <a href="/org/batches" className="hover:text-primary transition-colors">Batches</a>
                <a href="/org/students" className="hover:text-primary transition-colors">Students</a>
                <a href="/org/tests" className="hover:text-primary transition-colors">Test Assignments</a>
            </nav>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>Exit to Student View</Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
          <div className="flex justify-between items-end">
              <div>
                  <h1 className="text-3xl font-bold tracking-tight">{orgData.name}</h1>
                  <p className="text-muted-foreground">Organization Management Dashboard</p>
              </div>
              <Button>+ Create New Batch</Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                  <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Enrolled</CardTitle>
                  </CardHeader>
                  <CardContent><div className="text-3xl font-bold">{orgData.stats.totalStudents}</div></CardContent>
              </Card>
              <Card>
                  <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Active Batches</CardTitle>
                  </CardHeader>
                  <CardContent><div className="text-3xl font-bold">{orgData.stats.activeBatches}</div></CardContent>
              </Card>
              <Card>
                  <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Tests Conducted</CardTitle>
                  </CardHeader>
                  <CardContent><div className="text-3xl font-bold">{orgData.stats.testsConducted}</div></CardContent>
              </Card>
              <Card>
                  <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Avg. DSA Rating</CardTitle>
                  </CardHeader>
                  <CardContent><div className="text-3xl font-bold text-primary">{orgData.stats.avgPlatformRating}</div></CardContent>
              </Card>
          </div>

          {/* Batches Overview */}
          <Card>
              <CardHeader>
                  <CardTitle>Recent Batches</CardTitle>
              </CardHeader>
              <div className="rounded-b-md border-t overflow-hidden">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b">
                          <tr>
                              <th className="px-6 py-3 font-medium">Batch Name</th>
                              <th className="px-6 py-3 font-medium">Students</th>
                              <th className="px-6 py-3 font-medium">Active Assessment</th>
                              <th className="px-6 py-3 font-medium text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {orgData.recentBatches.map((batch: any) => (
                              <tr key={batch.id} className="border-b last:border-0 hover:bg-muted/30">
                                  <td className="px-6 py-4 font-medium">{batch.name}</td>
                                  <td className="px-6 py-4">{batch.studentCount}</td>
                                  <td className="px-6 py-4">
                                      {batch.activeTest !== 'None' ? (
                                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{batch.activeTest}</span>
                                      ) : (
                                          <span className="text-muted-foreground">-</span>
                                      )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      <Button variant="ghost" size="sm">Manage</Button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </Card>
      </main>
    </div>
  );
}
