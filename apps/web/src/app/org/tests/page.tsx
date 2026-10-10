"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from "@codearena/ui";

export default function OrgTestsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<any[]>([]);

  useEffect(() => {
    // Mock fetching tests assigned/created by this org
    setTimeout(() => {
        setTests([
            { id: 't1', title: 'Data Structures Mid-term', type: 'EXAM', status: 'SCHEDULED', batchesAssigned: 3, questionCount: 5, startTime: new Date(Date.now() + 172800000).toISOString() },
            { id: 't2', title: 'Weekly Coding Challenge', type: 'COMPETITION', status: 'ACTIVE', batchesAssigned: 12, questionCount: 3, startTime: new Date().toISOString() },
            { id: 't3', title: 'Arrays Basic Assessment', type: 'PRACTICE', status: 'COMPLETED', batchesAssigned: 1, questionCount: 10, startTime: new Date(Date.now() - 604800000).toISOString() },
        ]);
        setLoading(false);
    }, 500);
  }, []);

  if (loading) {
      return <div className="min-h-screen bg-background flex justify-center items-center">Loading Tests...</div>;
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
                <a href="/org/dashboard" className="hover:text-primary transition-colors">Overview</a>
                <a href="/org/batches" className="hover:text-primary transition-colors">Batches</a>
                <a href="/org/students" className="hover:text-primary transition-colors">Students</a>
                <a href="/org/tests" className="text-primary">Test Assignments</a>
            </nav>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>Exit to Student View</Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
          <div className="flex justify-between items-end">
              <div>
                  <h1 className="text-3xl font-bold tracking-tight">Test Assignments</h1>
                  <p className="text-muted-foreground">Create and assign assessments to your batches.</p>
              </div>
              <Button>+ Create Assessment</Button>
          </div>

          <Card>
              <div className="p-4 border-b flex gap-4">
                  <Input placeholder="Search assessments..." className="max-w-md" />
                  <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background max-w-[200px]">
                      <option value="ALL">All Types</option>
                      <option value="EXAM">Exams</option>
                      <option value="COMPETITION">Competitions</option>
                      <option value="PRACTICE">Practice</option>
                  </select>
              </div>
              <div className="rounded-b-md overflow-hidden">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b">
                          <tr>
                              <th className="px-6 py-3 font-medium">Title</th>
                              <th className="px-6 py-3 font-medium">Type</th>
                              <th className="px-6 py-3 font-medium">Status</th>
                              <th className="px-6 py-3 font-medium">Batches</th>
                              <th className="px-6 py-3 font-medium text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {tests.map((test) => (
                              <tr key={test.id} className="border-b last:border-0 hover:bg-muted/30">
                                  <td className="px-6 py-4">
                                      <div className="font-medium text-primary">{test.title}</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">{test.questionCount} Questions</div>
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${test.type === 'EXAM' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                          {test.type}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className={`text-xs font-semibold ${test.status === 'ACTIVE' ? 'text-green-500' : test.status === 'SCHEDULED' ? 'text-blue-500' : 'text-muted-foreground'}`}>
                                          {test.status}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4">{test.batchesAssigned} Assigned</td>
                                  <td className="px-6 py-4 text-right space-x-2">
                                      <Button variant="outline" size="sm">Results</Button>
                                      <Button variant="ghost" size="sm">Edit</Button>
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
