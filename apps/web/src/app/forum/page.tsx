"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from "@codearena/ui";
import { getActiveAccount } from "@/lib/auth-session";
import { NotificationCenter } from "@/components/NotificationCenter";
import { AccountSwitcher } from "@/components/AccountSwitcher";

interface DiscussionItem {
  id: number | string;
  title: string;
  content?: string;
  author: string;
  replies: number;
  votes: number;
  hasVoted?: boolean;
  tags: string[];
  time: string;
}

const DEFAULT_DISCUSSIONS: DiscussionItem[] = [
  { 
    id: 1, 
    title: 'How to approach Dynamic Programming conceptually?', 
    content: 'Many students struggle to visualize DP state transitions. The best mental model is starting with a pure recursive tree, identifying overlapping subproblems, and caching results via memoization before converting to tabulation.',
    author: 'alice_smith', 
    replies: 45, 
    votes: 120, 
    tags: ['DP', 'Discussion'], 
    time: '2 hours ago' 
  },
  { 
    id: 2, 
    title: 'Is segment tree really necessary for interviews?', 
    content: 'For standard FAANG SDE-1 interviews, Binary Indexed Trees or Prefix Sums suffice 95% of the time. However, for quant firms and advanced CP rounds, Segment Trees with Lazy Propagation are tested.',
    author: 'bob_williams', 
    replies: 89, 
    votes: 85, 
    tags: ['Interviews', 'Trees'], 
    time: '5 hours ago' 
  },
  { 
    id: 3, 
    title: 'Company X Interview Experience - SDE II (Offer)', 
    content: 'Recently cleared the SDE II loop. Round 1 was LLD (Parking Lot / Rate Limiter). Round 2 was Graph algorithms (Word Ladder II variation). Round 3 was Behavioral & System Architecture.',
    author: 'tourist_algo', 
    replies: 210, 
    votes: 340, 
    tags: ['Interview Experience', 'System Design'], 
    time: '1 day ago' 
  },
  { 
    id: 4, 
    title: 'Understanding Dijkstra vs Bellman Ford', 
    content: 'Remember that Dijkstra fails with negative weight edges because it greedily finalizes shortest distances. Bellman-Ford relaxes all edges V-1 times and detects negative weight cycles.',
    author: 'graph_fan', 
    replies: 12, 
    votes: 45, 
    tags: ['Graphs', 'Algorithms'], 
    time: '2 days ago' 
  },
];

export default function ForumPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [discussions, setDiscussions] = useState<DiscussionItem[]>(DEFAULT_DISCUSSIONS);
  const [activeThread, setActiveThread] = useState<DiscussionItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState("Interview Experience");
  const [newReply, setNewReply] = useState("");
  const [repliesList, setRepliesList] = useState<Record<string | number, string[]>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("codearena_forum_discussions");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDiscussions(parsed);
          }
        }
      } catch (e) {}
    }
  }, []);

  const saveDiscussions = (items: DiscussionItem[]) => {
    setDiscussions(items);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("codearena_forum_discussions", JSON.stringify(items));
      } catch (e) {}
    }
  };

  const handleUpvote = (id: number | string) => {
    const updated = discussions.map((d) => {
      if (d.id === id) {
        const voted = !!d.hasVoted;
        return {
          ...d,
          votes: voted ? d.votes - 1 : d.votes + 1,
          hasVoted: !voted,
        };
      }
      return d;
    });
    saveDiscussions(updated);
    if (activeThread && activeThread.id === id) {
      const activeUpdate = updated.find((d) => d.id === id);
      if (activeUpdate) setActiveThread(activeUpdate);
    }
  };

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const user = getActiveAccount();
    const authorName = user?.username || user?.name || "Student";

    const newItem: DiscussionItem = {
      id: `disc_${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim() || "No additional description provided.",
      author: authorName,
      replies: 0,
      votes: 1,
      hasVoted: true,
      tags: [newTag],
      time: "Just now",
    };

    const nextList = [newItem, ...discussions];
    saveDiscussions(nextList);
    setNewTitle("");
    setNewContent("");
    setIsNewModalOpen(false);
    setActiveThread(newItem);
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || !activeThread) return;
    const threadId = activeThread.id;
    const user = getActiveAccount();
    const author = user?.username || "You";
    const comment = `${author}: ${newReply.trim()}`;

    setRepliesList((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), comment],
    }));

    const updated = discussions.map((d) => {
      if (d.id === threadId) {
        return { ...d, replies: d.replies + 1 };
      }
      return d;
    });
    saveDiscussions(updated);
    setActiveThread((prev) => prev ? { ...prev, replies: prev.replies + 1 } : null);
    setNewReply("");
  };

  // Filtered discussions
  const filteredDiscussions = discussions.filter((d) => {
    const matchesSearch =
      search.trim() === "" ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.author.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesTag =
      selectedTag === "All" ||
      d.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  const availableFilterTags = [
    "All",
    "Interview Experience",
    "Study Guides",
    "System Design",
    "DP",
    "Trees",
    "Graphs",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* 2026 Nexus Brand Header */}
      <header className="border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
                <span className="text-white text-base font-black">C</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Code<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Arena</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link href="/" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/problems" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                Practice
              </Link>
              <Link href="/contests" className="px-3 py-1.5 rounded-lg text-amber-400 hover:text-amber-300 transition-colors">
                Contests
              </Link>
              <Link href="/forum" className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold">
                Discuss
              </Link>
              <Link href="/leaderboard" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                Leaderboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <NotificationCenter />
            <AccountSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8 space-y-6 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Community Discussions</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Ask algorithmic questions, share interview experiences, and prepare for tech careers.
            </p>
          </div>
          <Button onClick={() => setIsNewModalOpen(true)} className="font-bold gap-2">
            <span>+</span> New Discussion
          </Button>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search discussions, authors, or topics..."
              className="max-w-md bg-secondary/40"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="text-xs">
                Clear Search
              </Button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {availableFilterTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTag === tag
                    ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
                    : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Discussions List */}
        <Card className="border border-border/80 bg-card/80 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="divide-y divide-border/50">
            {filteredDiscussions.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground space-y-2">
                <p className="text-base font-semibold">No discussions match your filter</p>
                <Button variant="link" size="sm" onClick={() => { setSearch(""); setSelectedTag("All"); }}>
                  Reset filters
                </Button>
              </div>
            ) : (
              filteredDiscussions.map((d) => (
                <div
                  key={d.id}
                  className="p-5 hover:bg-muted/20 transition-colors flex gap-4 md:gap-6 items-start"
                >
                  {/* Upvote Pill */}
                  <div className="flex flex-col items-center gap-1 min-w-[50px] shrink-0 pt-1">
                    <button
                      onClick={() => handleUpvote(d.id)}
                      className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors border ${
                        d.hasVoted
                          ? "bg-primary/20 text-primary border-primary/40 font-bold"
                          : "text-muted-foreground hover:text-primary hover:bg-secondary/60 border-border/60"
                      }`}
                      title={d.hasVoted ? "Remove vote" : "Upvote discussion"}
                    >
                      ▲
                    </button>
                    <span className={`font-mono text-xs font-bold ${d.hasVoted ? "text-primary" : "text-muted-foreground"}`}>
                      {d.votes}
                    </span>
                  </div>

                  {/* Content Preview */}
                  <div className="flex-1 min-w-0">
                    <h3
                      onClick={() => setActiveThread(d)}
                      className="text-base font-bold hover:text-primary transition-colors cursor-pointer leading-snug mb-1.5"
                    >
                      {d.title}
                    </h3>
                    {d.content && (
                      <p
                        onClick={() => setActiveThread(d)}
                        className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2.5 cursor-pointer"
                      >
                        {d.content}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <div className="flex gap-1.5 flex-wrap">
                        {d.tags.map((t) => (
                          <span
                            key={t}
                            onClick={() => setSelectedTag(t)}
                            className="bg-secondary/70 hover:bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-colors"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>
                          by{" "}
                          <span
                            className="font-semibold text-foreground hover:underline cursor-pointer"
                            onClick={() => router.push(`/profile/${encodeURIComponent(d.author)}`)}
                          >
                            @{d.author}
                          </span>
                        </span>
                      </div>
                      <div className="font-mono text-[11px]">{d.time}</div>
                    </div>
                  </div>

                  {/* Replies Count */}
                  <div
                    onClick={() => setActiveThread(d)}
                    className="hidden sm:flex flex-col items-center justify-center min-w-[60px] text-muted-foreground shrink-0 cursor-pointer p-2 rounded-lg hover:bg-secondary/40 transition-colors"
                  >
                    <span className="font-bold text-foreground text-sm">{d.replies}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">Replies</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </main>

      {/* ── Thread Reader Modal ── */}
      {activeThread && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-border/80 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {activeThread.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">
                      {t}
                    </span>
                  ))}
                  <span className="text-xs text-muted-foreground font-mono">{activeThread.time}</span>
                </div>
                <h2 className="text-xl font-black text-foreground">{activeThread.title}</h2>
                <p className="text-xs text-muted-foreground">
                  Posted by <strong className="text-foreground">@{activeThread.author}</strong>
                </p>
              </div>
              <button
                onClick={() => setActiveThread(null)}
                className="h-8 w-8 rounded-lg bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/60 text-foreground whitespace-pre-wrap">
                {activeThread.content || "No details provided."}
              </div>

              {/* Thread Responses */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Responses ({activeThread.replies})
                </h4>

                {(repliesList[activeThread.id] || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2 italic">
                    No community comments yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {(repliesList[activeThread.id] || []).map((reply, i) => (
                      <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border/50 text-xs">
                        {reply}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleAddReply} className="p-4 border-t border-border/80 bg-muted/20 flex gap-2">
              <Input
                placeholder="Write a comment or answer..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="text-xs"
              />
              <Button type="submit" size="sm" className="font-bold shrink-0">
                Post Reply
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ── New Discussion Modal ── */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border max-w-lg w-full rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">Create New Discussion</h2>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDiscussion} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</label>
                <Input
                  required
                  placeholder="e.g. How to solve Two Sum in O(N) time?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Tag</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="Interview Experience">Interview Experience</option>
                  <option value="DP">Dynamic Programming</option>
                  <option value="Trees">Trees & Graphs</option>
                  <option value="System Design">System Design</option>
                  <option value="Study Guides">Study Guides</option>
                  <option value="Algorithms">Algorithms</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Content / Question</label>
                <textarea
                  rows={4}
                  placeholder="Elaborate on your problem, share details, or discuss edge cases..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 rounded-md bg-secondary/40 border border-input text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsNewModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="font-bold">
                  Publish Discussion
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
