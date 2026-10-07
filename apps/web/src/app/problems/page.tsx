"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input } from "@codearena/ui";
import { getActiveAccount, getUserStats } from "@/lib/auth-session";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { getAllProblems } from "@/lib/problems-data";

interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  solveCount: number;
  topics: { name: string }[];
}

const ALL_MOCK_QUESTIONS: Problem[] = [
  { id: '1', slug: 'two-sum', title: 'Two Sum', difficulty: 'EASY', solveCount: 15420, topics: [{ name: 'Arrays' }, { name: 'Hash Table' }] },
  { id: '2', slug: 'reverse-linked-list', title: 'Reverse Linked List', difficulty: 'EASY', solveCount: 8900, topics: [{ name: 'Linked List' }] },
  { id: '3', slug: 'maximum-subarray', title: 'Maximum Subarray', difficulty: 'MEDIUM', solveCount: 6500, topics: [{ name: 'Arrays' }, { name: 'Dynamic Programming' }] },
  { id: '4', slug: 'number-of-islands', title: 'Number of Islands', difficulty: 'MEDIUM', solveCount: 4200, topics: [{ name: 'Graphs' }, { name: 'Breadth-First Search' }] },
  { id: '5', slug: 'median-of-two-sorted-arrays', title: 'Median of Two Sorted Arrays', difficulty: 'HARD', solveCount: 1200, topics: [{ name: 'Binary Search' }, { name: 'Arrays' }] },
  { id: '6', slug: 'longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters', difficulty: 'MEDIUM', solveCount: 11200, topics: [{ name: 'Strings' }, { name: 'Hash Table' }, { name: 'Sliding Window' }] },
  { id: '7', slug: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'EASY', solveCount: 14500, topics: [{ name: 'Strings' }, { name: 'Stack' }] },
  { id: '8', slug: 'merge-intervals', title: 'Merge Intervals', difficulty: 'MEDIUM', solveCount: 7800, topics: [{ name: 'Arrays' }, { name: 'Sorting' }] },
  { id: '9', slug: 'trapping-rain-water', title: 'Trapping Rain Water', difficulty: 'HARD', solveCount: 3400, topics: [{ name: 'Arrays' }, { name: 'Two Pointers' }, { name: 'Dynamic Programming' }] },
  { id: '10', slug: 'word-search', title: 'Word Search', difficulty: 'MEDIUM', solveCount: 5600, topics: [{ name: 'Arrays' }, { name: 'Backtracking' }, { name: 'Matrix' }] },
  { id: '11', slug: 'coin-change', title: 'Coin Change', difficulty: 'MEDIUM', solveCount: 9300, topics: [{ name: 'Dynamic Programming' }, { name: 'Breadth-First Search' }] },
  { id: '12', slug: 'binary-tree-level-order-traversal', title: 'Binary Tree Level Order Traversal', difficulty: 'MEDIUM', solveCount: 6200, topics: [{ name: 'Trees' }, { name: 'Breadth-First Search' }] },
  { id: '13', slug: 'search-in-rotated-sorted-array', title: 'Search in Rotated Sorted Array', difficulty: 'MEDIUM', solveCount: 8400, topics: [{ name: 'Binary Search' }, { name: 'Arrays' }] },
  { id: '14', slug: 'course-schedule', title: 'Course Schedule', difficulty: 'MEDIUM', solveCount: 5100, topics: [{ name: 'Graphs' }, { name: 'Topological Sort' }] },
  { id: '15', slug: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'EASY', solveCount: 18200, topics: [{ name: 'Dynamic Programming' }, { name: 'Math' }] },
];

const TOPIC_TAGS = [
  "ALL",
  "Arrays",
  "Strings",
  "Dynamic Programming",
  "Graphs",
  "Binary Search",
  "Linked List",
  "Trees",
  "Stack",
];

function ProblemsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allAvailableProblems, setAllAvailableProblems] = useState<Problem[]>([]);
  const [questions, setQuestions] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [selectedTopic, setSelectedTopic] = useState("ALL");
  const [solvedSlugs, setSolvedSlugs] = useState<string[]>([]);

  const loadAllProblems = () => {
    const list = getAllProblems();
    const mapped: Problem[] = list.map((p, idx) => {
      const mock = ALL_MOCK_QUESTIONS.find((m) => m.slug === p.slug);
      return {
        id: p.id || String(idx + 1),
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        solveCount: mock ? mock.solveCount : 0,
        topics: p.topics || [{ name: "Algorithms" }],
      };
    });
    setAllAvailableProblems(mapped);
  };

  useEffect(() => {
    loadAllProblems();

    const handleProblemsUpdated = () => {
      loadAllProblems();
    };

    window.addEventListener("codearena_problems_updated", handleProblemsUpdated);
    return () => {
      window.removeEventListener("codearena_problems_updated", handleProblemsUpdated);
    };
  }, []);

  // Check URL query params for initial search or topic
  useEffect(() => {
    const urlTopic = searchParams.get("topic");
    const urlSearch = searchParams.get("search");

    if (urlTopic) {
      setSelectedTopic(urlTopic);
    }
    if (urlSearch) {
      setSearch(urlSearch);
    }

    if (typeof window !== "undefined") {
      const active = getActiveAccount();
      const activeId = active?.id || "default";
      const stats = getUserStats(activeId);
      const uniqueSlugs = stats.solvedProblems.map((item: any) => item.slug).filter(Boolean);
      setSolvedSlugs(uniqueSlugs);

      const handleAccountChange = () => {
        const acc = getActiveAccount();
        const accId = acc?.id || "default";
        const s = getUserStats(accId);
        const slugs = s.solvedProblems.map((item: any) => item.slug).filter(Boolean);
        setSolvedSlugs(slugs);
      };

      window.addEventListener("codearena_account_changed", handleAccountChange);
      return () => {
        window.removeEventListener("codearena_account_changed", handleAccountChange);
      };
    }
  }, [searchParams]);

  // Filter questions based on search, difficulty, and topic
  useEffect(() => {
    const source = allAvailableProblems.length > 0 ? allAvailableProblems : ALL_MOCK_QUESTIONS;
    let filtered = [...source];

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.topics.some((t) => t.name.toLowerCase().includes(query))
      );
    }

    if (selectedTopic !== "ALL") {
      filtered = filtered.filter((q) =>
        q.topics.some((t) => t.name.toLowerCase() === selectedTopic.toLowerCase())
      );
    }

    if (difficultyFilter !== "ALL") {
      filtered = filtered.filter((q) => q.difficulty === difficultyFilter);
    }

    setQuestions(filtered);
  }, [search, selectedTopic, difficultyFilter, allAvailableProblems]);

  const clearFilters = () => {
    setSearch("");
    setSelectedTopic("ALL");
    setDifficultyFilter("ALL");
    router.replace("/problems");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-extrabold text-2xl tracking-tight text-foreground flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground text-sm font-black">C</span>
            </div>
            Code<span className="text-primary">Arena</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/problems" className="text-primary font-semibold">Practice</Link>
            <Link href="/assessments" className="text-muted-foreground hover:text-foreground transition-colors">Assessments</Link>
            <Link href="/battles" className="text-muted-foreground hover:text-foreground transition-colors">Battles</Link>
            <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</Link>
            <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold gap-1.5 hover:text-primary">
                <span>👤</span> Profile
              </Button>
            </Link>
            <AccountSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Practice Problem Bank</h1>
            <p className="text-muted-foreground mt-1">
              Sharpen your algorithmic skills with curated interview challenges.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => router.push('/battles')} variant="outline" className="gap-2">
              <span>⚔️</span> 1v1 Battle
            </Button>
            <Button onClick={() => router.push('/dashboard')} className="gap-2">
              <span>📊</span> Dashboard
            </Button>
          </div>
        </div>

        {/* Focus Area Banner (if filtered by a topic) */}
        {selectedTopic !== "ALL" && (
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-bold text-sm text-foreground">
                  Focus Area Active: <span className="text-primary">{selectedTopic}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Practicing targeted weak areas speeds up rating growth. Showing {questions.length} problems.
                </p>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={clearFilters} className="text-xs hover:bg-primary/20">
              ✕ Clear Filter
            </Button>
          </div>
        )}

        {/* Search & Difficulty Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/60 p-4 rounded-2xl border border-border/60">
          <Input 
            placeholder="Search problems or tags..." 
            className="w-full sm:max-w-md bg-secondary/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
              <Button 
                key={diff}
                size="sm"
                variant={difficultyFilter === diff ? "default" : "outline"}
                onClick={() => setDifficultyFilter(diff)}
                className="text-xs font-semibold"
              >
                {diff === "ALL" ? "All Levels" : diff}
              </Button>
            ))}
          </div>
        </div>

        {/* Topic Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
            Topic:
          </span>
          {TOPIC_TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedTopic === t
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/50"
              }`}
            >
              {t === "ALL" ? "All Topics" : t}
            </button>
          ))}
        </div>

        {/* Question List */}
        <Card className="border border-border/80 shadow-xl overflow-hidden bg-card/70 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/40 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
                <tr>
                  <th className="px-6 py-3.5 w-24">Status</th>
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5 hidden md:table-cell">Topics</th>
                  <th className="px-6 py-3.5 w-32">Difficulty</th>
                  <th className="px-6 py-3.5 text-right w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {questions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      <p className="font-semibold text-base">No problems match your current filter</p>
                      <Button variant="link" size="sm" onClick={clearFilters} className="mt-2 text-primary">
                        Reset all filters
                      </Button>
                    </td>
                  </tr>
                ) : (
                  questions.map((q) => {
                    const isSolved = solvedSlugs.includes(q.slug);
                    return (
                      <tr 
                        key={q.id} 
                        className="hover:bg-secondary/30 transition-colors group cursor-pointer" 
                        onClick={() => router.push(`/problems/${q.slug}`)}
                      >
                        <td className="px-6 py-4">
                          {isSolved ? (
                            <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 w-fit">
                              ✓ Solved
                            </span>
                          ) : (
                            <span className="text-muted-foreground/60 text-xs font-mono pl-2">○</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-semibold text-foreground group-hover:text-primary transition-colors">
                          <div className="flex items-center gap-2">
                            <span>{q.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex gap-1.5 flex-wrap">
                            {q.topics.map((t, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-md border border-border/40 font-medium"
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className={`font-bold text-xs px-2.5 py-1 rounded-md ${
                              q.difficulty === 'EASY' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : q.difficulty === 'MEDIUM' 
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-all rounded-full h-8 px-3"
                          >
                            Solve &rarr;
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default function ProblemsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading Problems...</div>}>
      <ProblemsContent />
    </Suspense>
  );
}
