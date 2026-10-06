"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Tabs, TabsList, TabsTrigger, TabsContent } from "@codearena/ui";

export default function ForumPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const discussions = [
      { id: 1, title: 'How to approach Dynamic Programming conceptually?', author: 'alice_smith', replies: 45, votes: 120, tags: ['DP', 'Discussion'], time: '2 hours ago' },
      { id: 2, title: 'Is segment tree really necessary for interviews?', author: 'bob_williams', replies: 89, votes: 85, tags: ['Interviews', 'Trees'], time: '5 hours ago' },
      { id: 3, title: 'Company X Interview Experience - SDE II (Offer)', author: 'tourist_algo', replies: 210, votes: 340, tags: ['Interview Experience', 'System Design'], time: '1 day ago' },
      { id: 4, title: 'Understanding Dijkstra vs Bellman Ford', author: 'graph_fan', replies: 12, votes: 45, tags: ['Graphs', 'Algorithms'], time: '2 days ago' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tight text-primary">Code<span className="text-destructive">Arena</span></div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                <a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a>
                <a href="/problems" className="hover:text-primary transition-colors">Practice</a>
                <a href="/forum" className="text-primary">Discuss</a>
            </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-6 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h1 className="text-3xl font-bold tracking-tight">Community Discussions</h1>
                  <p className="text-muted-foreground">Ask questions, share interview experiences, and learn together.</p>
              </div>
              <Button>New Discussion</Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                  placeholder="Search discussions..." 
                  className="max-w-md"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                  <Button variant="secondary" size="sm" className="whitespace-nowrap">All</Button>
                  <Button variant="outline" size="sm" className="whitespace-nowrap">Interview Experience</Button>
                  <Button variant="outline" size="sm" className="whitespace-nowrap">Study Guides</Button>
                  <Button variant="outline" size="sm" className="whitespace-nowrap">System Design</Button>
              </div>
          </div>

          <Card>
              <div className="divide-y">
                  {discussions.map(d => (
                      <div key={d.id} className="p-4 md:p-6 hover:bg-muted/10 transition-colors flex gap-4 md:gap-6">
                          <div className="flex flex-col items-center gap-1 min-w-[50px]">
                              <button className="text-muted-foreground hover:text-primary">▲</button>
                              <span className="font-bold text-lg">{d.votes}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold hover:text-primary hover:underline cursor-pointer truncate mb-1">
                                  {d.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                  <div className="flex gap-2">
                                      {d.tags.map(t => (
                                          <span key={t} className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md text-xs font-medium">
                                              {t}
                                          </span>
                                      ))}
                                  </div>
                                  <div className="flex items-center gap-1">
                                      <span>by <span className="font-medium text-foreground hover:underline cursor-pointer" onClick={() => router.push(`/profile/${d.author}`)}>{d.author}</span></span>
                                  </div>
                                  <div>{d.time}</div>
                              </div>
                          </div>
                          <div className="hidden md:flex flex-col items-center justify-center min-w-[60px] text-muted-foreground">
                              <span className="font-bold text-foreground">{d.replies}</span>
                              <span className="text-xs">Replies</span>
                          </div>
                      </div>
                  ))}
              </div>
          </Card>
      </main>
    </div>
  );
}
