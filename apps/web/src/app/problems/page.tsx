"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input } from "@codearena/ui";
import { getActiveAccount, getUserStats } from "@/lib/auth-session";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { NotificationCenter } from "@/components/NotificationCenter";
import { getAllProblems, syncProblemsWithServer } from "@/lib/problems-data";

interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  solveCount: number;
  topics: { name: string }[];
}

const ALL_MOCK_QUESTIONS: Problem[] = [
  { id: 'b1', slug: 'check-bar-entry-status', title: 'Check Bar Entry Status', difficulty: 'EASY', solveCount: 9400, topics: [{ name: 'Conditionals' }, { name: 'Logic' }] },
  { id: 'b2', slug: 'area-of-square', title: 'Area of Square', difficulty: 'EASY', solveCount: 16500, topics: [{ name: 'Math' }, { name: 'Geometry' }] },
  { id: 'b3', slug: 'area-of-triangle', title: 'Area of Triangle', difficulty: 'EASY', solveCount: 14200, topics: [{ name: 'Math' }, { name: 'Geometry' }] },
  { id: 'b4', slug: 'area-of-circle', title: 'Area of Circle', difficulty: 'EASY', solveCount: 12800, topics: [{ name: 'Math' }, { name: 'Geometry' }] },
  { id: 'b5', slug: 'area-of-rectangle', title: 'Area of Rectangle', difficulty: 'EASY', solveCount: 15300, topics: [{ name: 'Math' }, { name: 'Geometry' }] },
  { id: 'b6', slug: 'even-or-odd', title: 'Check Even or Odd', difficulty: 'EASY', solveCount: 22100, topics: [{ name: 'Conditionals' }, { name: 'Math' }] },
  { id: 'b7', slug: 'max-of-two-numbers', title: 'Find Maximum of Two Numbers', difficulty: 'EASY', solveCount: 19800, topics: [{ name: 'Conditionals' }, { name: 'Logic' }] },
  { id: 'b8', slug: 'check-voting-eligibility', title: 'Check Voting Eligibility', difficulty: 'EASY', solveCount: 17400, topics: [{ name: 'Conditionals' }, { name: 'Logic' }] },
  { id: 'b9', slug: 'grade-calculator', title: 'Grade Calculator', difficulty: 'EASY', solveCount: 13900, topics: [{ name: 'Conditionals' }, { name: 'Logic' }] },
  { id: 'b10', slug: 'check-number-sign', title: 'Check Number Sign', difficulty: 'EASY', solveCount: 18600, topics: [{ name: 'Conditionals' }, { name: 'Math' }] },
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
  "Conditionals",
  "Math",
  "Geometry",
  "Arrays",
  "Strings",
  "Dynamic Programming",
  "Graphs",
  "Binary Search",
  "Linked List",
  "Trees",
  "Stack",
];

function getInitialProblemsList(): Problem[] {
  try {
    const list = getAllProblems();
    return list.map((p, idx) => {
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
  } catch {
    return ALL_MOCK_QUESTIONS;
  }
}

export default function ProblemsPage() {
  const router = useRouter();

  const [allAvailableProblems, setAllAvailableProblems] = useState<Problem[]>(getInitialProblemsList);
  const [questions, setQuestions] = useState<Problem[]>(getInitialProblemsList);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [selectedTopic, setSelectedTopic] = useState("ALL");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(true);
  const [solvedSlugs, setSolvedSlugs] = useState<string[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAllProblems = () => {
    try {
      setLoadError(null);
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
    } catch (err: any) {
      setLoadError("Failed to parse problems database. Please retry.");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await syncProblemsWithServer();
      loadAllProblems();
    } catch (err: any) {
      setLoadError("Unable to reach problem server. Showing cached problems.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    loadAllProblems();

    syncProblemsWithServer()
      .then(() => {
        if (isMounted) loadAllProblems();
      })
      .catch(() => {});

    const handleProblemsUpdated = () => {
      if (isMounted) loadAllProblems();
    };

    const probPollInterval = setInterval(() => {
      syncProblemsWithServer()
        .then(() => {
          if (isMounted) loadAllProblems();
        })
        .catch(() => {});
    }, 15000);

    window.addEventListener("codearena_problems_updated", handleProblemsUpdated);
    window.addEventListener("storage", handleProblemsUpdated);
    return () => {
      isMounted = false;
      clearInterval(probPollInterval);
      window.removeEventListener("codearena_problems_updated", handleProblemsUpdated);
      window.removeEventListener("storage", handleProblemsUpdated);
    };
  }, []);

  // Check URL query params for initial search or topic
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTopic = urlParams.get("topic");
      const urlSearch = urlParams.get("search");

      if (urlTopic) {
        setSelectedTopic(urlTopic);
      }
      if (urlSearch) {
        setSearch(urlSearch);
      }

      const active = getActiveAccount();
      if (!active) {
        setCurrentUser(null);
        setAuthChecked(true);
        setSolvedSlugs([]);
      } else {
        setCurrentUser(active);
        setAuthChecked(true);
        const activeId = active.id || "default";
        const stats = getUserStats(activeId);
        const uniqueSlugs = stats.solvedProblems.map((item: any) => item.slug).filter(Boolean);
        setSolvedSlugs(uniqueSlugs);
      }

      const handleAccountChange = () => {
        const acc = getActiveAccount();
        if (!acc) {
          setCurrentUser(null);
          setSolvedSlugs([]);
          return;
        }
        setCurrentUser(acc);
        const accId = acc.id || "default";
        const s = getUserStats(accId);
        const slugs = s.solvedProblems.map((item: any) => item.slug).filter(Boolean);
        setSolvedSlugs(slugs);
      };

      window.addEventListener("codearena_account_changed", handleAccountChange);
      return () => {
        window.removeEventListener("codearena_account_changed", handleAccountChange);
      };
    }
  }, [router]);

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

  if (!authChecked) {
    return <ProblemsTableSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
              <span className="text-white text-base font-black">C</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Code<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Arena</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/problems" className="text-primary font-semibold">Practice (150 DSA)</Link>
            <Link href="/contests" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-semibold text-amber-400">
              <span>🏆</span> Contests
            </Link>
            <Link href="/battles" className="text-muted-foreground hover:text-foreground transition-colors">Battles</Link>
            <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</Link>
            <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
          </nav>
          <div className="flex items-center gap-3">
            <NotificationCenter />
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
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={isRefreshing}
              className="gap-2 text-xs"
            >
              <span className={isRefreshing ? "animate-spin" : ""}>🔄</span>
              {isRefreshing ? "Syncing..." : "Sync Bank"}
            </Button>
            <Button onClick={() => router.push('/battles')} variant="outline" className="gap-2">
              <span>⚔️</span> 1v1 Battle
            </Button>
            <Button onClick={() => router.push('/dashboard')} className="gap-2">
              <span>📊</span> Dashboard
            </Button>
          </div>
        </div>

        {/* Error / Offline Banner with Retry */}
        {loadError && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-sm text-amber-200">{loadError}</p>
            </div>
            <Button size="sm" variant="outline" onClick={handleRefresh} className="text-xs">
              Retry Sync
            </Button>
          </div>
        )}

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

function ProblemsTableSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground animate-pulse">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-slate-800" />
            <div className="h-5 w-28 bg-slate-800 rounded" />
          </div>
          <div className="hidden md:flex gap-6">
            <div className="h-4 w-12 bg-slate-800 rounded" />
            <div className="h-4 w-16 bg-slate-800 rounded" />
            <div className="h-4 w-20 bg-slate-800 rounded" />
          </div>
          <div className="h-8 w-24 bg-slate-800 rounded-full" />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-800 rounded" />
            <div className="h-4 w-96 bg-slate-800/60 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-24 bg-slate-800 rounded" />
            <div className="h-9 w-28 bg-slate-800 rounded" />
          </div>
        </div>

        <div className="h-10 w-full bg-slate-800/40 rounded-lg" />
        <div className="flex gap-2 overflow-hidden py-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-7 w-20 bg-slate-800/60 rounded-full shrink-0" />
          ))}
        </div>

        <Card className="border border-white/5 bg-slate-900/30 overflow-hidden rounded-xl">
          <div className="divide-y divide-white/5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-4 w-8 bg-slate-800 rounded" />
                  <div className="h-4 w-48 bg-slate-800 rounded" />
                </div>
                <div className="h-5 w-16 bg-slate-800 rounded-full" />
                <div className="h-8 w-20 bg-slate-800 rounded-full" />
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
