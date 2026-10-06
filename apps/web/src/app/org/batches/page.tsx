"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from "@codearena/ui";

export default function OrgBatchesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    // Mock fetching batches
    setTimeout(() => {
        setBatches([
            { id: 'b1', name: 'CS 2026 - Section A', studentCount: 65, activeTest: 'Mid-term DSA', createdAt: new Date(Date.now() - 15000000000).toISOString() },
            { id: 'b2', name: 'CS 2026 - Section B', studentCount: 62, activeTest: 'None', createdAt: new Date(Date.now() - 15000000000).toISOString() },
            { id: 'b3', name: 'Placement Prep 26', studentCount: 120, activeTest: 'Mock Interview 1', createdAt: new Date(Date.now() - 2500000000).toISOString() },
        ]);
        setLoading(false);
    }, 500);
  }, []);

  if (loading) {
      return <div className="min-h-screen bg-background flex justify-center items-center">Loading Batches...</div>;
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
                <a href="/org/batches" className="text-primary">Batches</a>
                <a href="/org/students" className="hover:text-primary transition-colors">Students</a>
                <a href="/org/tests" className="hover:text-primary transition-colors">Test Assignments</a>
            </nav>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>Exit to Student View</Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
          <div className="flex justify-between items-end">
              <div>
                  <h1 className="text-3xl font-bold tracking-tight">Manage Batches</h1>
                  <p className="text-muted-foreground">Organize your students into logical groups.</p>
              </div>
              <Button>+ Create New Batch</Button>
          </div>

          <Card>
              <div className="p-4 border-b">
                  <Input placeholder="Search batches..." className="max-w-md" />
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
                          {batches.map((batch) => (
                              <tr key={batch.id} className="border-b last:border-0 hover:bg-muted/30">
                                  <td className="px-6 py-4 font-medium text-primary">{batch.name}</td>
                                  <td className="px-6 py-4">{batch.studentCount}</td>
                                  <td className="px-6 py-4">
                                      {batch.activeTest !== 'None' ? (
                                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{batch.activeTest}</span>
                                      ) : (
                                          <span className="text-muted-foreground">-</span>
                                      )}
                                  </td>
                                  <td className="px-6 py-4 text-muted-foreground">
                                      {new Date(batch.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 text-right space-x-2">
                                      <Button variant="outline" size="sm">Manage Students</Button>
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
