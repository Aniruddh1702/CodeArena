"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from "@codearena/ui";

export default function OrgBatchesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [batches, setBatches] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBatchName, setNewBatchName] = useState("");
  const [newStudentCount, setNewStudentCount] = useState("45");
  const [selectedBatchForStudents, setSelectedBatchForStudents] = useState<any | null>(null);
  const [editingBatch, setEditingBatch] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("codearena_org_batches");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBatches(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {}
      }
    }

    const defaultBatches = [
      { id: 'b1', name: 'CS 2026 - Section A', studentCount: 65, activeTest: 'Mid-term DSA', createdAt: new Date(Date.now() - 15000000000).toISOString() },
      { id: 'b2', name: 'CS 2026 - Section B', studentCount: 62, activeTest: 'None', createdAt: new Date(Date.now() - 15000000000).toISOString() },
      { id: 'b3', name: 'Placement Prep 26', studentCount: 120, activeTest: 'Mock Interview 1', createdAt: new Date(Date.now() - 2500000000).toISOString() },
    ];
    setBatches(defaultBatches);
    setLoading(false);
  }, []);

  const saveBatches = (list: any[]) => {
    setBatches(list);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("codearena_org_batches", JSON.stringify(list));
      } catch (e) {}
    }
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;

    const newBatch = {
      id: `batch_${Date.now()}`,
      name: newBatchName.trim(),
      studentCount: parseInt(newStudentCount, 10) || 30,
      activeTest: "None",
      createdAt: new Date().toISOString(),
    };

    const nextList = [newBatch, ...batches];
    saveBatches(nextList);
    setNewBatchName("");
    setIsCreateOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;
    const nextList = batches.map((b) => (b.id === editingBatch.id ? editingBatch : b));
    saveBatches(nextList);
    setEditingBatch(null);
  };

  const filteredBatches = batches.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return b.name.toLowerCase().includes(q) || b.activeTest.toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="min-h-screen bg-background flex justify-center items-center">Loading Batches...</div>;
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
                <Link href="/org/batches" className="text-primary font-semibold">Batches</Link>
                <Link href="/org/tests" className="hover:text-primary transition-colors">Test Assignments</Link>
                <Link href="/org/analytics" className="hover:text-primary transition-colors">Analytics</Link>
            </nav>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>Exit to Student View</Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
          <div className="flex justify-between items-end">
              <div>
                  <h1 className="text-3xl font-bold tracking-tight">Manage Batches</h1>
                  <p className="text-muted-foreground">Organize your students into logical groups and tracks.</p>
              </div>
              <Button onClick={() => setIsCreateOpen(true)} className="font-bold">+ Create New Batch</Button>
          </div>

          <Card>
              <div className="p-4 border-b flex items-center justify-between gap-4">
                  <Input 
                    placeholder="Search batches by name or assessment..." 
                    className="max-w-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="text-xs">
                      Clear
                    </Button>
                  )}
              </div>
              <div className="rounded-b-md overflow-hidden">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b">
                          <tr>
                              <th className="px-6 py-3 font-medium">Batch Name</th>
                              <th className="px-6 py-3 font-medium">Enrolled Students</th>
                              <th className="px-6 py-3 font-medium">Active Assessment</th>
                              <th className="px-6 py-3 font-medium">Created On</th>
                              <th className="px-6 py-3 font-medium text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredBatches.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                No batches found matching "{search}".
                              </td>
                            </tr>
                          ) : (
                            filteredBatches.map((batch) => (
                              <tr key={batch.id} className="border-b last:border-0 hover:bg-muted/30">
                                  <td className="px-6 py-4 font-medium text-primary">{batch.name}</td>
                                  <td className="px-6 py-4">{batch.studentCount} Students</td>
                                  <td className="px-6 py-4">
                                      {batch.activeTest !== 'None' ? (
                                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">{batch.activeTest}</span>
                                      ) : (
                                          <span className="text-muted-foreground">-</span>
                                      )}
                                  </td>
                                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                                      {new Date(batch.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 text-right space-x-2">
                                      <Button variant="outline" size="sm" onClick={() => setSelectedBatchForStudents(batch)}>
                                        Manage Students
                                      </Button>
                                      <Button variant="ghost" size="sm" onClick={() => setEditingBatch({ ...batch })}>
                                        Edit
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

      {/* ── Create Batch Modal ── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">Create New Batch</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Batch Name</label>
                <Input
                  required
                  placeholder="e.g. CS 2026 - Section C"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Initial Students Count</label>
                <Input
                  type="number"
                  placeholder="60"
                  value={newStudentCount}
                  onChange={(e) => setNewStudentCount(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit" className="font-bold">Create Batch</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Manage Students Modal ── */}
      {selectedBatchForStudents && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border max-w-lg w-full rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black">{selectedBatchForStudents.name}</h2>
                <p className="text-xs text-muted-foreground">{selectedBatchForStudents.studentCount} Registered Students</p>
              </div>
              <button onClick={() => setSelectedBatchForStudents(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="max-h-60 overflow-y-auto divide-y border rounded-lg text-xs font-mono">
              {Array.from({ length: Math.min(10, selectedBatchForStudents.studentCount) }).map((_, i) => (
                <div key={i} className="p-3 flex items-center justify-between">
                  <span>student_{i + 1}@{selectedBatchForStudents.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.edu</span>
                  <span className="text-emerald-400 font-bold">Active ✓</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedBatchForStudents(null)} className="font-bold">Done</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Batch Modal ── */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">Edit Batch</h2>
              <button onClick={() => setEditingBatch(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Batch Name</label>
                <Input
                  required
                  value={editingBatch.name}
                  onChange={(e) => setEditingBatch({ ...editingBatch, name: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Student Count</label>
                <Input
                  type="number"
                  value={editingBatch.studentCount}
                  onChange={(e) => setEditingBatch({ ...editingBatch, studentCount: parseInt(e.target.value, 10) || 0 })}
                  className="text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setEditingBatch(null)}>Cancel</Button>
                <Button type="submit" className="font-bold">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
