"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from "@codearena/ui";

export default function OrgTestsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [tests, setTests] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("EXAM");
  const [newQuestionCount, setNewQuestionCount] = useState("4");
  const [newBatches, setNewBatches] = useState("2");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("codearena_org_tests");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTests(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {}
      }
    }

    const defaultTests = [
      { id: 't1', title: 'Data Structures Mid-term', type: 'EXAM', status: 'SCHEDULED', batchesAssigned: 3, questionCount: 5, startTime: new Date(Date.now() + 172800000).toISOString() },
      { id: 't2', title: 'Weekly Coding Challenge', type: 'COMPETITION', status: 'ACTIVE', batchesAssigned: 12, questionCount: 3, startTime: new Date().toISOString() },
      { id: 't3', title: 'Arrays Basic Assessment', type: 'PRACTICE', status: 'COMPLETED', batchesAssigned: 1, questionCount: 10, startTime: new Date(Date.now() - 604800000).toISOString() },
    ];
    setTests(defaultTests);
    setLoading(false);
  }, []);

  const saveTests = (list: any[]) => {
    setTests(list);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("codearena_org_tests", JSON.stringify(list));
      } catch (e) {}
    }
  };

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTest = {
      id: `test_${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      status: "SCHEDULED",
      batchesAssigned: parseInt(newBatches, 10) || 1,
      questionCount: parseInt(newQuestionCount, 10) || 4,
      startTime: new Date().toISOString(),
    };

    const nextList = [newTest, ...tests];
    saveTests(nextList);

    // Save to server store
    fetch("/api/org/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTest),
    }).catch(() => {});

    setNewTitle("");
    setIsCreateOpen(false);
  };

  const filteredTests = tests.filter((t) => {
    const matchesSearch =
      !search.trim() || t.title.toLowerCase().includes(search.toLowerCase().trim());
    const matchesType = typeFilter === "ALL" || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="min-h-screen bg-background flex justify-center items-center">Loading Tests...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
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
                <Link href="/org/dashboard" className="hover:text-primary transition-colors">Overview</Link>
                <Link href="/org/batches" className="hover:text-primary transition-colors">Batches</Link>
                <Link href="/org/tests" className="text-primary font-semibold">Test Assignments</Link>
                <Link href="/org/analytics" className="hover:text-primary transition-colors">Analytics</Link>
            </nav>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>Exit to Student View</Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
          <div className="flex justify-between items-end">
              <div>
                  <h1 className="text-3xl font-bold tracking-tight">Test Assignments</h1>
                  <p className="text-muted-foreground">Create, assign, and review performance reports for exams and assessments.</p>
              </div>
              <Button onClick={() => setIsCreateOpen(true)} className="font-bold">+ Create Assessment</Button>
          </div>

          <Card>
              <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-3 w-full sm:w-auto flex-1">
                    <Input 
                      placeholder="Search assessments..." 
                      className="max-w-md"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <select 
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background max-w-[180px]"
                    >
                        <option value="ALL">All Types</option>
                        <option value="EXAM">Exams</option>
                        <option value="COMPETITION">Competitions</option>
                        <option value="PRACTICE">Practice</option>
                    </select>
                  </div>
                  {search && (
                    <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="text-xs">
                      Clear Search
                    </Button>
                  )}
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
                          {filteredTests.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                No assessments found matching your filter.
                              </td>
                            </tr>
                          ) : (
                            filteredTests.map((test) => (
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
                                  <td className="px-6 py-4 text-xs font-mono">{test.batchesAssigned} Assigned</td>
                                  <td className="px-6 py-4 text-right space-x-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => router.push(`/org/tests/${test.id}/report`)}
                                        className="font-bold text-xs"
                                      >
                                        Results &rarr;
                                      </Button>
                                  </td>
                              </tr>
                            ))
                          )}
                      </tbody>
                  </table>
              </div>
          </Card>
      </main>

      {/* ── Create Assessment Modal ── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">Create Assessment</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleCreateTest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Assessment Title</label>
                <Input
                  required
                  placeholder="e.g. Algorithms Final Exam 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="EXAM">Exam</option>
                  <option value="COMPETITION">Competition</option>
                  <option value="PRACTICE">Practice</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Questions</label>
                  <Input
                    type="number"
                    value={newQuestionCount}
                    onChange={(e) => setNewQuestionCount(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Batches Assigned</label>
                  <Input
                    type="number"
                    value={newBatches}
                    onChange={(e) => setNewBatches(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit" className="font-bold">Create Assessment</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
