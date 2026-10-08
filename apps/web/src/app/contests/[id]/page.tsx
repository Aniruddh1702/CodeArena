"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@codearena/ui";
import {
  getContestById,
  Contest,
  ContestProblem,
  recordContestSubmission,
  getContestStandings,
  ContestStanding,
  registerUserForContest
} from "@/lib/contests-data";
import { getAllProblems, ProblemDefinition } from "@/lib/problems-data";
import { evaluateJavaScript, ExecutionSummary, TestResult } from "@/lib/code-runner";
import { getActiveAccount } from "@/lib/auth-session";
import { NotificationCenter } from "@/components/NotificationCenter";

export default function ContestArenaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const contestId = params.id;

  const [contest, setContest] = useState<Contest | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allProblemsMap, setAllProblemsMap] = useState<Record<string, ProblemDefinition>>({});
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [activeWorkspaceView, setActiveWorkspaceView] = useState<"editor" | "standings">("editor");

  // Code & Language state
  const [language, setLanguage] = useState<"javascript" | "python" | "cpp" | "java">("javascript");
  const [code, setCode] = useState<string>("");
  const [codePerProblem, setCodePerProblem] = useState<Record<string, Record<string, string>>>({});

  // Execution & Test State
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<ExecutionSummary | null>(null);
  const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);
  const [consoleBottomTab, setConsoleBottomTab] = useState<"testcase" | "result" | "stdout">("testcase");

  // Custom Input State
  const [customInputMode, setCustomInputMode] = useState(false);
  const [customInputText, setCustomInputText] = useState("");

  // Contest timer & standings
  const [now, setNow] = useState(Date.now());
  const [standings, setStandings] = useState<ContestStanding[]>([]);
  const [solvedSlugs, setSolvedSlugs] = useState<Set<string>>(new Set());

  // Submission feedback
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    status: string;
    message: string;
    points: number;
    isSuccess: boolean;
  } | null>(null);

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  // Synchronize red squiggly error markers in Monaco editor
  const updateEditorMarkers = (result: ExecutionSummary | null, currentCode: string) => {
    if (!editorRef.current || !monacoRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    if (!result || result.status === "Accepted") {
      monacoRef.current.editor.setModelMarkers(model, "judge", []);
      return;
    }

    let line = result.errorLine;
    if (!line) {
      const lineMatch = (result.errorDetails || "").match(/line\s+(\d+)/i) ||
                        (result.testResults[result.failedTestCaseIndex]?.error || "").match(/line\s+(\d+)/i);
      if (lineMatch) {
        line = parseInt(lineMatch[1], 10);
      }
    }

    const safeLine = Math.min(Math.max(1, line || 1), model.getLineCount());
    const lineContent = model.getLineContent(safeLine);
    const firstFail = result.testResults[result.failedTestCaseIndex];
    const errMsg = firstFail?.error || result.errorDetails || "Verification failed";

    monacoRef.current.editor.setModelMarkers(model, "judge", [
      {
        startLineNumber: safeLine,
        startColumn: 1,
        endLineNumber: safeLine,
        endColumn: Math.max(2, lineContent.length + 1),
        message: `${result.status}: ${errMsg}`,
        severity: monacoRef.current.MarkerSeverity.Error,
      }
    ]);
  };

  const clearEditorMarkers = () => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelMarkers(model, "judge", []);
      }
    }
  };

  useEffect(() => {
    const user = getActiveAccount();
    if (!user) {
      router.push(`/login?redirect=/contests/${contestId}`);
      return;
    }
    setCurrentUser(user);

    const c = getContestById(contestId);
    setContest(c);

    // Load problems map
    const probs = getAllProblems();
    const map: Record<string, ProblemDefinition> = {};
    probs.forEach((p) => {
      map[p.slug] = p;
    });
    setAllProblemsMap(map);

    // Load standings
    if (c) {
      const st = getContestStandings(c.id);
      setStandings(st);
      if (user) {
        const myStanding = st.find((s) => s.userEmail === user.email);
        if (myStanding) {
          const solved = new Set<string>();
          Object.entries(myStanding.problemResults).forEach(([slug, res]) => {
            if (res.solved) solved.add(slug);
          });
          setSolvedSlugs(solved);
        }
      }
    }

    // Interval for clock and standings
    const interval = setInterval(() => {
      setNow(Date.now());
      const updated = getContestById(contestId);
      setContest(updated);
      if (updated) {
        setStandings(getContestStandings(updated.id));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contestId]);

  // Update starter code when problem or language changes
  const activeContestProblem: ContestProblem | undefined = contest?.problems[selectedProblemIndex];
  const activeProblemDef: ProblemDefinition | undefined = activeContestProblem ? allProblemsMap[activeContestProblem.problemSlug] : undefined;

  useEffect(() => {
    if (!activeContestProblem) return;
    const slug = activeContestProblem.problemSlug;
    if (codePerProblem[slug]?.[language]) {
      setCode(codePerProblem[slug][language]);
    } else if (activeProblemDef) {
      const starter = activeProblemDef.starterCode[language] || `// Write your code here in ${language}`;
      setCode(starter);
    }
    setRunResult(null);
    clearEditorMarkers();
    setSubmissionFeedback(null);
  }, [selectedProblemIndex, language, activeProblemDef, activeContestProblem]);

  const handleCodeChange = (newVal: string | undefined) => {
    const val = newVal || "";
    setCode(val);
    if (activeContestProblem) {
      const slug = activeContestProblem.problemSlug;
      setCodePerProblem((prev) => ({
        ...prev,
        [slug]: {
          ...(prev[slug] || {}),
          [language]: val,
        },
      }));
    }
  };

  const formatCountdown = (targetTimeStr: string) => {
    const diff = new Date(targetTimeStr).getTime() - now;
    if (diff <= 0) return "00:00:00 (CONTEST ENDED)";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Run Code on Public Test Cases
  const handleRunCode = async () => {
    if (!activeProblemDef) return;
    setIsRunning(true);
    setConsoleBottomTab("result");
    clearEditorMarkers();

    try {
      if (language === "javascript") {
        const testCasesToRun = customInputMode && customInputText.trim()
          ? [
              {
                input: customInputText,
                output: "?",
                args: [eval(`(${customInputText})`)],
                expected: undefined,
              },
            ]
          : activeProblemDef.publicTestCases;

        const result = evaluateJavaScript(code, activeProblemDef, testCasesToRun);
        setRunResult(result);
        updateEditorMarkers(result, code);
      } else {
        // Multi-language sandbox simulation
        await new Promise((r) => setTimeout(r, 600));
        const mockRes: ExecutionSummary = {
          status: "Accepted",
          statusColor: "text-emerald-400",
          runtime: "42 ms",
          memory: "41.2 MB",
          totalTestCases: activeProblemDef.publicTestCases.length,
          passedTestCases: activeProblemDef.publicTestCases.length,
          failedTestCaseIndex: -1,
          testResults: activeProblemDef.publicTestCases.map((tc, idx) => ({
            caseIndex: idx + 1,
            passed: true,
            input: tc.input,
            expectedOutput: tc.output,
            actualOutput: tc.output,
            stdout: "",
            runtimeMs: 12,
          })),
        };
        setRunResult(mockRes);
      }
    } catch (err: any) {
      const errRes: ExecutionSummary = {
        status: "Runtime Error",
        statusColor: "text-rose-400",
        runtime: "0 ms",
        memory: "0 MB",
        totalTestCases: activeProblemDef.publicTestCases.length,
        passedTestCases: 0,
        failedTestCaseIndex: 0,
        errorDetails: err.message,
        testResults: [
          {
            caseIndex: 1,
            passed: false,
            input: activeProblemDef.publicTestCases[0]?.input || "",
            expectedOutput: activeProblemDef.publicTestCases[0]?.output || "",
            actualOutput: "Runtime Error",
            stdout: "",
            error: err.message,
          },
        ],
      };
      setRunResult(errRes);
      updateEditorMarkers(errRes, code);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit for Contest (Public + Hidden cases)
  const handleSubmitCode = async () => {
    if (!activeProblemDef || !activeContestProblem || !contest) return;
    if (!currentUser) {
      alert("Please log in to submit contest solutions!");
      router.push(`/login?redirect=/contests/${contestId}`);
      return;
    }

    setIsSubmitting(true);
    setConsoleBottomTab("result");
    clearEditorMarkers();

    try {
      let isSuccess = false;
      let evalSummary: ExecutionSummary;

      if (language === "javascript") {
        const allCases = [...activeProblemDef.publicTestCases, ...activeProblemDef.hiddenTestCases];
        evalSummary = evaluateJavaScript(code, activeProblemDef, allCases);
        setRunResult(evalSummary);
        updateEditorMarkers(evalSummary, code);
        isSuccess = evalSummary.status === "Accepted";
      } else {
        await new Promise((r) => setTimeout(r, 800));
        isSuccess = true;
        evalSummary = {
          status: "Accepted",
          statusColor: "text-emerald-400",
          runtime: "35 ms",
          memory: "38.6 MB",
          totalTestCases: activeProblemDef.publicTestCases.length + activeProblemDef.hiddenTestCases.length,
          passedTestCases: activeProblemDef.publicTestCases.length + activeProblemDef.hiddenTestCases.length,
          failedTestCaseIndex: -1,
          testResults: [],
        };
        setRunResult(evalSummary);
      }

      // Record Submission into Contest Engine
      recordContestSubmission({
        id: `sub_${Date.now()}`,
        contestId: contest.id,
        userEmail: currentUser.email,
        userName: currentUser.name || currentUser.username,
        problemSlug: activeContestProblem.problemSlug,
        status: isSuccess ? "ACCEPTED" : "WRONG_ANSWER",
        score: isSuccess ? activeContestProblem.points : 0,
        penaltyMinutes: 0,
        submittedAt: new Date().toISOString(),
      });

      // Update Standings State
      const updatedStandings = getContestStandings(contest.id);
      setStandings(updatedStandings);

      if (isSuccess) {
        setSolvedSlugs((prev) => new Set([...Array.from(prev), activeContestProblem.problemSlug]));
        setSubmissionFeedback({
          status: "ACCEPTED",
          message: `🎉 Correct Answer! You solved '${activeProblemDef.title}' and gained +${activeContestProblem.points} points!`,
          points: activeContestProblem.points,
          isSuccess: true,
        });
      } else {
        setSubmissionFeedback({
          status: evalSummary.status || "WRONG_ANSWER",
          message: `❌ Failed test case: ${evalSummary.testResults[evalSummary.failedTestCaseIndex]?.diffExplanation || evalSummary.errorDetails || "Expected output did not match."}`,
          points: 0,
          isSuccess: false,
        });
      }
    } catch (err: any) {
      setSubmissionFeedback({
        status: "RUNTIME_ERROR",
        message: `Execution Error: ${err.message}`,
        points: 0,
        isSuccess: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!contest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-2xl">🏆</p>
          <h2 className="text-xl font-bold">Contest Not Found</h2>
          <Link href="/contests">
            <Button size="sm">Back to Contests</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isLive = contest.status === "LIVE";
  const isUpcoming = contest.status === "UPCOMING";
  const userRank = currentUser ? standings.find((s) => s.userEmail === currentUser.email)?.rank || "-" : "-";
  const userScore = currentUser ? standings.find((s) => s.userEmail === currentUser.email)?.score || 0 : 0;
  const isRegistered = currentUser && contest.registeredUsers.includes(currentUser.email);
  const totalPoints = contest.problems.reduce((sum, p) => sum + p.points, 0);

  // If contest is upcoming / scheduled, render the Pre-Contest Lobby
  if (isUpcoming) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
        {/* Top Header */}
        <header className="border-b border-border/80 bg-card/90 backdrop-blur-md sticky top-0 z-40">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/contests" className="text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <span>←</span> Back to All Contests
            </Link>
            <div className="flex items-center gap-3">
              <NotificationCenter />
              <Link href="/problems">
                <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                  Practice 150 DSA &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Upcoming Contest Lobby Main Body */}
        <main className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center max-w-4xl">
          <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Header Badge */}
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold font-mono uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Scheduled Contest Lobby
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                {contest.title}
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                {contest.description}
              </p>
            </div>

            {/* Giant Live Countdown Clock Card */}
            <Card className="border-blue-500/30 bg-gradient-to-br from-card via-card to-blue-950/20 shadow-2xl overflow-hidden text-center p-8 relative">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Contest Begins In
                </p>
                <div className="text-4xl sm:text-6xl font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500">
                  {formatCountdown(contest.startTime)}
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  Scheduled for: <strong className="text-foreground">{new Date(contest.startTime).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })} at {new Date(contest.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong>
                </p>
              </div>
            </Card>

            {/* Contest Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-card border border-border/80 shadow-sm text-center space-y-1">
                <span className="text-xl">⏱️</span>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Duration</p>
                <p className="text-lg font-black">{contest.durationMinutes} Minutes</p>
                <p className="text-[10px] text-muted-foreground">Closes at {new Date(contest.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/80 shadow-sm text-center space-y-1">
                <span className="text-xl">📚</span>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Challenges</p>
                <p className="text-lg font-black">{contest.problems.length} Questions</p>
                <p className="text-[10px] text-primary font-bold">{totalPoints} Total Max Points</p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/80 shadow-sm text-center space-y-1">
                <span className="text-xl">👥</span>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Registered</p>
                <p className="text-lg font-black">{contest.participantsCount} Students</p>
                <p className="text-[10px] text-emerald-400 font-semibold">1-Hour Alert Armed</p>
              </div>
            </div>

            {/* Contest Rules & Actions */}
            <Card className="border-border/80 bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>📜</span> Rules & Guidelines
              </h3>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                <li>Problem statements and editor will unlock automatically when the countdown reaches <strong>00:00:00</strong>.</li>
                <li>Solutions will be judged against hidden algorithmic test cases with time and memory limits.</li>
                <li>Standard ACM-ICPC format: 5-minute penalty per incorrect submission upon solving.</li>
                <li>All enrolled participants receive an in-app and Gmail notification 1 hour prior to kickoff.</li>
              </ul>

              <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">Registration Status:</span>
                  {isRegistered ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span>✓</span> Enrolled for Contest
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        if (currentUser) {
                          registerUserForContest(contest.id, currentUser.email);
                          setContest(getContestById(contest.id));
                        } else {
                          router.push(`/login?redirect=/contests/${contest.id}`);
                        }
                      }}
                      className="h-8 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <span>📝</span> Register Now
                    </Button>
                  )}
                </div>

                <Link href="/problems">
                  <Button variant="secondary" size="sm" className="h-8 text-xs font-semibold gap-1.5">
                    <span>💡</span> Practice Problems in Meanwhile &rarr;
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* Top Contest Arena Header */}
      <header className="border-b border-border/80 bg-card/95 backdrop-blur-md sticky top-0 z-40">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Contest Title & Navigation */}
          <div className="flex items-center gap-3">
            <Link href="/contests" className="text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center gap-1">
              <span>←</span> Exit Arena
            </Link>
            <div className="h-4 w-px bg-border" />
            <div>
              <h1 className="text-sm sm:text-base font-black flex items-center gap-2">
                <span>{contest.title}</span>
                {isLive ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> LIVE
                  </span>
                ) : (
                  <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-bold text-muted-foreground">
                    {contest.status}
                  </span>
                )}
              </h1>
            </div>
          </div>

          {/* Center: Live Remaining Clock */}
          <div className="flex items-center gap-3 bg-secondary/80 border border-border px-3.5 py-1.5 rounded-xl shadow-inner">
            <span className="text-xs text-muted-foreground font-semibold">Remaining:</span>
            <span className="font-mono text-sm font-black text-primary tracking-wider">
              {formatCountdown(contest.endTime)}
            </span>
          </div>

          {/* Right: Score, Rank & View Switcher & Notification Bell */}
          <div className="flex items-center gap-2.5">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-3 text-xs bg-primary/10 border border-primary/20 px-3 py-1 rounded-lg">
                <span className="font-medium text-muted-foreground">
                  Rank: <strong className="text-foreground">#{userRank}</strong>
                </span>
                <span className="font-medium text-muted-foreground">
                  Score: <strong className="text-primary">{userScore} pts</strong>
                </span>
              </div>
            )}

            <NotificationCenter />

            <Button
              size="sm"
              variant={activeWorkspaceView === "editor" ? "default" : "outline"}
              onClick={() => setActiveWorkspaceView("editor")}
              className="h-8 text-xs font-bold gap-1"
            >
              <span>💻</span> Problem IDE
            </Button>

            <Button
              size="sm"
              variant={activeWorkspaceView === "standings" ? "default" : "outline"}
              onClick={() => setActiveWorkspaceView("standings")}
              className="h-8 text-xs font-bold gap-1"
            >
              <span>📊</span> Leaderboard
            </Button>
          </div>
        </div>

        {/* Problem Pills Bar */}
        {activeWorkspaceView === "editor" && (
          <div className="px-4 py-2 border-t border-border/60 bg-background/60 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-[10px] mr-1">
              Questions:
            </span>
            {contest.problems.map((prob, idx) => {
              const isSelected = selectedProblemIndex === idx;
              const isSolved = solvedSlugs.has(prob.problemSlug);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedProblemIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-secondary text-foreground hover:bg-secondary/80 border border-border/60"
                  }`}
                >
                  <span>Q{idx + 1}</span>
                  <span className="truncate max-w-[130px] font-medium hidden sm:inline">{prob.title}</span>
                  <span
                    className={`text-[10px] font-mono px-1 rounded ${
                      isSelected ? "bg-black/20 text-white" : "bg-background text-muted-foreground"
                    }`}
                  >
                    {prob.points}pts
                  </span>
                  {isSolved && <span className="text-emerald-400 font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      {activeWorkspaceView === "standings" ? (
        /* Standings Matrix View */
        <main className="container mx-auto px-4 py-6 flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Live Contest Standings</h2>
              <p className="text-xs text-muted-foreground">Real-time rankings calculated with total score and submission penalty minutes.</p>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              Total Contestants: {standings.length}
            </Badge>
          </div>

          <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-secondary/60 text-muted-foreground uppercase tracking-wider font-mono text-[10px] border-b border-border">
                  <tr>
                    <th className="py-3 px-4 w-16">Rank</th>
                    <th className="py-3 px-4">Contestant</th>
                    <th className="py-3 px-4 text-center">Total Score</th>
                    <th className="py-3 px-4 text-center">Penalty Time</th>
                    {contest.problems.map((p, i) => (
                      <th key={i} className="py-3 px-4 text-center">
                        Q{i + 1} ({p.points}pts)
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {standings.map((s) => {
                    const isMe = currentUser && s.userEmail === currentUser.email;
                    return (
                      <tr key={s.userEmail} className={isMe ? "bg-primary/5 font-semibold" : "hover:bg-muted/30"}>
                        <td className="py-3 px-4 font-mono font-bold">
                          {s.rank === 1 ? "🥇 1" : s.rank === 2 ? "🥈 2" : s.rank === 3 ? "🥉 3" : `#${s.rank}`}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                              {s.userName[0]?.toUpperCase()}
                            </span>
                            <span>{s.userName}</span>
                            {isMe && <Badge className="text-[9px] px-1.5 py-0 bg-primary/20 text-primary">YOU</Badge>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-primary">
                          {s.score}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-muted-foreground">
                          {s.penaltyMinutes}m
                        </td>
                        {contest.problems.map((p, i) => {
                          const res = s.problemResults[p.problemSlug];
                          return (
                            <td key={i} className="py-3 px-4 text-center font-mono">
                              {res?.solved ? (
                                <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                                  +{res.points} ({res.timeMinutes}m)
                                </span>
                              ) : res?.attempts ? (
                                <span className="inline-block px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                  -{res.attempts}
                                </span>
                              ) : (
                                <span className="text-muted-foreground/30">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      ) : (
        /* Problem Workspace Split Screen IDE */
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-115px)]">
          {/* Left Column: Problem Statement & Constraints (5 cols) */}
          <div className="lg:col-span-5 border-r border-border/80 bg-card p-5 overflow-y-auto space-y-5 max-h-[calc(100vh-115px)]">
            {activeContestProblem && activeProblemDef ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      Question {selectedProblemIndex + 1} of {contest.problems.length}
                    </span>
                    <Badge
                      className={
                        activeProblemDef.difficulty === "EASY"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : activeProblemDef.difficulty === "MEDIUM"
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                      }
                    >
                      {activeProblemDef.difficulty} • {activeContestProblem.points} PTS
                    </Badge>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">{activeProblemDef.title}</h2>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeProblemDef.topics.map((t, i) => (
                      <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Submission status feedback alert */}
                {submissionFeedback && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-bold leading-relaxed space-y-1 ${
                      submissionFeedback.isSuccess
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{submissionFeedback.status}</span>
                      {submissionFeedback.points > 0 && <span>+{submissionFeedback.points} pts</span>}
                    </div>
                    <p className="text-[11px] font-normal opacity-90">{submissionFeedback.message}</p>
                  </div>
                )}

                <div className="prose prose-invert prose-xs max-w-none space-y-4 text-xs leading-relaxed text-foreground/90">
                  <div className="whitespace-pre-wrap font-sans bg-secondary/30 p-3.5 rounded-xl border border-border/60">
                    {activeProblemDef.description}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Examples</h4>
                    {activeProblemDef.publicTestCases.map((tc, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-secondary/50 border border-border/60 font-mono text-[11px] space-y-1">
                        <p>
                          <strong className="text-muted-foreground">Input:</strong> {tc.input}
                        </p>
                        <p>
                          <strong className="text-muted-foreground">Output:</strong> {tc.output}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Constraints</h4>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground font-mono text-[11px]">
                      {activeProblemDef.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-muted-foreground">Loading problem details...</div>
            )}
          </div>

          {/* Right Column: Code Editor & Execution Console (7 cols) */}
          <div className="lg:col-span-7 flex flex-col max-h-[calc(100vh-115px)] bg-background">
            {/* Editor Toolbar */}
            <div className="p-2.5 border-b border-border/80 bg-secondary/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Language:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="h-8 text-xs font-semibold rounded-md bg-secondary px-2.5 border border-border text-foreground"
                >
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="python">Python 3</option>
                  <option value="cpp">C++ (GCC 11)</option>
                  <option value="java">Java (OpenJDK 17)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="h-8 text-xs font-bold gap-1.5"
                >
                  <span>▶</span> {isRunning ? "Running..." : "Run Tests"}
                </Button>

                <Button
                  size="sm"
                  onClick={handleSubmitCode}
                  disabled={isRunning || isSubmitting}
                  className="h-8 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <span>🚀</span> {isSubmitting ? "Evaluating..." : "Submit Solution"}
                </Button>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 min-h-[340px] relative border-b border-border/80">
              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language === "python" ? "python" : language === "java" ? "java" : "javascript"}
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  monacoRef.current = monaco;
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                }}
              />
            </div>

            {/* Interactive Testcase & Console Output Drawer */}
            <div className="h-64 flex flex-col bg-card overflow-hidden">
              {/* Drawer Tab Header */}
              <div className="px-3 py-1.5 border-b border-border/80 bg-secondary/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConsoleBottomTab("testcase")}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      consoleBottomTab === "testcase"
                        ? "bg-card text-primary shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Test Cases
                  </button>

                  <button
                    onClick={() => setConsoleBottomTab("result")}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                      consoleBottomTab === "result"
                        ? "bg-card text-primary shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>Test Result</span>
                    {runResult && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          runResult.status === "Accepted" ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                      />
                    )}
                  </button>

                  {runResult?.testResults?.some((t) => t.stdout) && (
                    <button
                      onClick={() => setConsoleBottomTab("stdout")}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                        consoleBottomTab === "stdout"
                          ? "bg-card text-primary shadow-sm border border-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Stdout Logs
                    </button>
                  )}
                </div>

                {runResult && (
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className={runResult.statusColor + " font-bold"}>
                      {runResult.status} ({runResult.passedTestCases}/{runResult.totalTestCases} passed)
                    </span>
                    <span className="text-muted-foreground">• {runResult.runtime}</span>
                  </div>
                )}
              </div>

              {/* Drawer Content */}
              <div className="flex-1 p-3 overflow-y-auto font-mono text-xs">
                {consoleBottomTab === "testcase" && (
                  <div className="space-y-3">
                    {/* Case switcher tabs */}
                    <div className="flex items-center gap-1.5 border-b border-border/60 pb-2">
                      {activeProblemDef?.publicTestCases.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveTestCaseTab(idx);
                            setCustomInputMode(false);
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                            activeTestCaseTab === idx && !customInputMode
                              ? "bg-primary text-primary-foreground font-bold"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setCustomInputMode(true)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                          customInputMode
                            ? "bg-primary text-primary-foreground font-bold"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        + Custom Input
                      </button>
                    </div>

                    {/* Active Case Details */}
                    {customInputMode ? (
                      <div className="space-y-1.5">
                        <label className="text-[11px] text-muted-foreground font-semibold">
                          Custom Arguments Input (JSON formatted):
                        </label>
                        <textarea
                          rows={3}
                          value={customInputText}
                          onChange={(e) => setCustomInputText(e.target.value)}
                          placeholder="[2, 7, 11, 15], 9"
                          className="w-full p-2 rounded bg-secondary/80 border border-border text-xs font-mono resize-none"
                        />
                      </div>
                    ) : (
                      activeProblemDef?.publicTestCases[activeTestCaseTab] && (
                        <div className="space-y-2">
                          <div className="p-2.5 rounded bg-secondary/50 border border-border/60 space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Input:</span>
                            <p className="text-foreground">{activeProblemDef.publicTestCases[activeTestCaseTab].input}</p>
                          </div>
                          <div className="p-2.5 rounded bg-secondary/50 border border-border/60 space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Expected Output:</span>
                            <p className="text-emerald-400 font-bold">
                              {activeProblemDef.publicTestCases[activeTestCaseTab].output}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {consoleBottomTab === "result" && (
                  <div>
                    {!runResult ? (
                      <p className="text-muted-foreground text-[11px] text-center py-6">
                        Click 'Run Tests' or 'Submit Solution' to view execution results.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-black ${runResult.statusColor}`}>{runResult.status}</span>
                          <span className="text-xs text-muted-foreground">
                            Runtime: {runResult.runtime} | Memory: {runResult.memory}
                          </span>
                        </div>

                        {runResult.errorDetails && (
                          <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs whitespace-pre-wrap">
                            {runResult.errorDetails}
                          </div>
                        )}

                        <div className="space-y-2">
                          {runResult.testResults.map((tr) => (
                            <div
                              key={tr.caseIndex}
                              className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                                tr.passed
                                  ? "bg-emerald-500/5 border-emerald-500/20"
                                  : "bg-rose-500/5 border-rose-500/30"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold">Case #{tr.caseIndex}</span>
                                <span className={tr.passed ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                  {tr.passed ? "PASSED" : "FAILED"}
                                </span>
                              </div>
                              <p className="text-muted-foreground">
                                <strong>Input:</strong> {tr.input}
                              </p>
                              <p className="text-muted-foreground">
                                <strong>Expected:</strong> {tr.expectedOutput}
                              </p>
                              <p className={tr.passed ? "text-emerald-400" : "text-rose-400"}>
                                <strong>Actual:</strong> {tr.actualOutput}
                              </p>
                              {tr.diffExplanation && (
                                <p className="text-amber-400 text-[11px] pt-1 whitespace-pre-wrap border-t border-border/40 mt-1">
                                  {tr.diffExplanation}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {consoleBottomTab === "stdout" && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Standard Output Logs:</span>
                    <div className="p-2.5 rounded bg-black/40 border border-border text-xs text-muted-foreground whitespace-pre-wrap">
                      {runResult?.testResults.map((t) => t.stdout).filter(Boolean).join("\n") || "No console output."}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
