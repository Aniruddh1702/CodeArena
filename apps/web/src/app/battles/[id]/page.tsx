"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { Button, Badge } from "@codearena/ui";
import { 
  getActiveAccount, 
  getUserStats, 
  updateUserRating, 
  recordUserSolve, 
  UserAccount 
} from "@/lib/auth-session";
import { getProblem, ProblemDefinition } from "@/lib/problems-data";
import { evaluateJavaScript, ExecutionSummary } from "@/lib/code-runner";

type SupportedLanguage = "javascript" | "python" | "cpp" | "java";

const DEFAULT_PROBLEM: ProblemDefinition = {
  id: "60",
  slug: "longest-palindromic-substring",
  title: "Longest Palindromic Substring",
  difficulty: "MEDIUM",
  topics: [{ name: "Strings" }, { name: "Dynamic Programming" }],
  description: "Given a string `s`, return the longest palindromic substring in `s`.\n\nA string is palindromic if it reads the same forward and backward.",
  constraints: ["1 <= s.length <= 1000", "s consist of only digits and English letters."],
  methodName: "longestPalindrome",
  supportedLanguages: ["javascript", "python", "cpp", "java"],
  starterCode: {
    javascript: "/**\n * @param {string} s\n * @return {string}\n */\nvar longestPalindrome = function(s) {\n    \n};",
    python: "class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        pass",
    cpp: "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string longestPalindrome(string s) {\n        \n    }\n};",
    java: "class Solution {\n    public String longestPalindrome(String s) {\n        \n    }\n}"
  },
  publicTestCases: [
    {
      input: 's = "babad"',
      output: '"bab"',
      args: ["babad"],
      expected: "bab"
    },
    {
      input: 's = "cbbd"',
      output: '"bb"',
      args: ["cbbd"],
      expected: "bb"
    }
  ],
  hiddenTestCases: [
    {
      input: 's = "a"',
      output: '"a"',
      args: ["a"],
      expected: "a"
    },
    {
      input: 's = "ac"',
      output: '"a"',
      args: ["ac"],
      expected: "a"
    },
    {
      input: 's = "racecar"',
      output: '"racecar"',
      args: ["racecar"],
      expected: "racecar"
    }
  ]
};

export default function ActiveBattlePage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Problem Definition
  const [problem] = useState<ProblemDefinition>(() => {
    return getProblem("longest-palindromic-substring") || DEFAULT_PROBLEM;
  });

  // User State
  const [activeAccount, setActiveAccount] = useState<UserAccount | null>(null);
  const [userRating, setUserRating] = useState(1450);
  const [displayName, setDisplayName] = useState("You");
  const [loading, setLoading] = useState(true);

  // Language & Code Cache
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [codes, setCodes] = useState<Record<SupportedLanguage, string>>({
    javascript: problem.starterCode.javascript || DEFAULT_PROBLEM.starterCode.javascript,
    python: problem.starterCode.python || DEFAULT_PROBLEM.starterCode.python,
    cpp: problem.starterCode.cpp || DEFAULT_PROBLEM.starterCode.cpp,
    java: problem.starterCode.java || DEFAULT_PROBLEM.starterCode.java,
  });

  // Battle State
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [myProgress, setMyProgress] = useState(0);
  const [battleState, setBattleState] = useState<"active" | "won" | "lost" | "surrendered">("active");
  const battleOverRef = useRef(false);

  // Execution & Console
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<ExecutionSummary | null>(null);
  const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);
  const [consoleOpen, setConsoleOpen] = useState(false);

  // Modal State
  const [resultModal, setResultModal] = useState<{
    open: boolean;
    type: "victory" | "defeat" | "surrender";
    title: string;
    description: string;
    newRating: number;
    ratingDelta: number;
  } | null>(null);

  // Initialize Account
  useEffect(() => {
    const active = getActiveAccount();
    if (!active) {
      router.push(`/login?redirect=/battles/${params.id}`);
      return;
    }
    setActiveAccount(active);
    const stats = getUserStats(active.id);
    setUserRating(stats.dsaRating);
    setDisplayName(active.name || active.username || "You");
    setTimeout(() => setLoading(false), 400);
  }, [params.id, router]);

  // Countdown Timer
  useEffect(() => {
    if (!loading && timeLeft > 0 && battleState === "active") {
      const timer = setInterval(() => {
        if (battleOverRef.current) {
          clearInterval(timer);
          return;
        }
        setTimeLeft((p) => {
          if (p <= 1) {
            clearInterval(timer);
            handleTimeExceeded();
            return 0;
          }
          return p - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, timeLeft, battleState]);

  // Opponent AI Simulation
  useEffect(() => {
    if (!loading && battleState === "active") {
      const opTimer = setInterval(() => {
        if (battleOverRef.current) {
          clearInterval(opTimer);
          return;
        }
        setOpponentProgress((prev) => {
          if (battleOverRef.current) return prev;
          // Randomly advance opponent by 5% to 15%
          const increment = Math.floor(Math.random() * 11) + 5;
          const nextVal = Math.min(100, prev + increment);

          if (nextVal >= 100 && !battleOverRef.current) {
            clearInterval(opTimer);
            battleOverRef.current = true;
            handleOpponentWon();
            return 100;
          }
          return nextVal;
        });
      }, 8500);

      return () => clearInterval(opTimer);
    }
  }, [loading, battleState]);

  const handleOpponentWon = () => {
    setBattleState("lost");
    const activeAcc = getActiveAccount();
    const stats = activeAcc ? getUserStats(activeAcc.id) : { dsaRating: 1450 };
    const nextRating = Math.max(1000, stats.dsaRating - 15);

    if (activeAcc) {
      updateUserRating(activeAcc.id, nextRating, {
        type: "BATTLE_LOSS",
        title: `1v1 Speed Battle: ${problem.title}`,
        slug: problem.slug,
        ratingDelta: "-15",
        date: "Just now",
        timestamp: new Date().toISOString(),
      });
    }

    setUserRating(nextRating);
    setResultModal({
      open: true,
      type: "defeat",
      title: "DEFEAT 💀",
      description: "Opponent submitted all test cases first! You fought bravely, keep sharpening your algorithms.",
      newRating: nextRating,
      ratingDelta: -15,
    });
  };

  const handleTimeExceeded = () => {
    if (battleOverRef.current) return;
    battleOverRef.current = true;
    setBattleState("lost");

    const activeAcc = getActiveAccount();
    const stats = activeAcc ? getUserStats(activeAcc.id) : { dsaRating: 1450 };
    const nextRating = Math.max(1000, stats.dsaRating - 15);

    if (activeAcc) {
      updateUserRating(activeAcc.id, nextRating, {
        type: "BATTLE_LOSS",
        title: `1v1 Speed Battle: ${problem.title} (Time Out)`,
        slug: problem.slug,
        ratingDelta: "-15",
        date: "Just now",
        timestamp: new Date().toISOString(),
      });
    }

    setUserRating(nextRating);
    setResultModal({
      open: true,
      type: "defeat",
      title: "TIME'S UP ⏳",
      description: "Battle timer expired before completing all test cases. Practice speed to conquer the arena!",
      newRating: nextRating,
      ratingDelta: -15,
    });
  };

  const handleSurrender = () => {
    if (battleOverRef.current) return;
    if (!window.confirm("Surrender this battle? (-15 Elo rating penalty will be applied)")) return;

    battleOverRef.current = true;
    setBattleState("surrendered");

    const activeAcc = getActiveAccount();
    const stats = activeAcc ? getUserStats(activeAcc.id) : { dsaRating: 1450 };
    const nextRating = Math.max(1000, stats.dsaRating - 15);

    if (activeAcc) {
      updateUserRating(activeAcc.id, nextRating, {
        type: "BATTLE_LOSS",
        title: `1v1 Speed Battle: ${problem.title} (Surrendered)`,
        slug: problem.slug,
        ratingDelta: "-15",
        date: "Just now",
        timestamp: new Date().toISOString(),
      });
    }

    router.push("/battles");
  };

  const handleCodeChange = (val: string | undefined) => {
    const text = val || "";
    setCodes((prev) => ({
      ...prev,
      [language]: text,
    }));
  };

  // Real Code Execution against Test Cases
  const handleExecute = async (isSubmission: boolean) => {
    if (battleOverRef.current) return;
    const currentCode = (codes[language] || "").trim();
    const starter = (problem.starterCode[language] || "").trim();

    // Check for empty or unmodified editor
    if (!currentCode || currentCode === starter) {
      const publicCases = problem.publicTestCases || [];
      const hiddenCases = problem.hiddenTestCases || [];
      const targetCases = isSubmission ? [...publicCases, ...hiddenCases] : publicCases;

      const emptySummary: ExecutionSummary = {
        status: "Compilation Error",
        statusColor: "text-red-500",
        runtime: "0ms",
        memory: "0MB",
        totalTestCases: targetCases.length,
        passedTestCases: 0,
        failedTestCaseIndex: 0,
        testResults: targetCases.map((tc, idx) => ({
          caseIndex: idx,
          passed: false,
          input: tc.input,
          expectedOutput: tc.output,
          actualOutput: "",
          stdout: "",
          error: "Editor is empty or unmodified. You must write an implementation before testing."
        })),
        errorDetails: "Cannot evaluate empty solution. Implement the required function logic to pass test cases."
      };

      setRunResult(emptySummary);
      setMyProgress(0);
      setConsoleOpen(true);
      setActiveTestCaseTab(0);
      return;
    }

    if (isSubmission) {
      setIsSubmitting(true);
    } else {
      setIsRunning(true);
    }
    setConsoleOpen(true);

    try {
      let summary: ExecutionSummary;
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: problem.slug,
          language,
          code: currentCode,
          isSubmission,
        }),
      });

      if (res.ok) {
        summary = await res.json();
      } else {
        const errJson = await res.json().catch(() => null);
        if (errJson && errJson.status) {
          summary = errJson;
        } else if (language === "javascript") {
          const targetCases = isSubmission
            ? [...(problem.publicTestCases || []), ...(problem.hiddenTestCases || [])]
            : (problem.publicTestCases || []);
          summary = evaluateJavaScript(currentCode, problem, targetCases);
        } else {
          throw new Error("Evaluation engine failed. Please try again.");
        }
      }

      setRunResult(summary);
      setActiveTestCaseTab(summary.status === "Accepted" ? 0 : summary.failedTestCaseIndex);

      // ACCURATELY calculate user progress % strictly from actual passed test cases
      const passed = summary.passedTestCases || 0;
      const total = summary.totalTestCases || 1;
      const calculatedPct = Math.round((passed / total) * 100);
      setMyProgress(calculatedPct);

      // LEGITIMATE VICTORY: Only on full submission with 100% test cases accepted
      if (isSubmission && (summary.status === "Accepted" || (passed === total && total > 0))) {
        battleOverRef.current = true;
        setBattleState("won");
        const activeAcc = getActiveAccount();
        const stats = activeAcc ? getUserStats(activeAcc.id) : { dsaRating: 1450 };
        const nextRating = stats.dsaRating + 25;

        if (activeAcc) {
          updateUserRating(activeAcc.id, nextRating, {
            type: "BATTLE_WIN",
            title: `1v1 Speed Battle: ${problem.title}`,
            slug: problem.slug,
            ratingDelta: "+25",
            date: "Just now",
            timestamp: new Date().toISOString(),
          });
          recordUserSolve(activeAcc.id, {
            slug: problem.slug,
            title: problem.title,
            difficulty: problem.difficulty || "MEDIUM",
          }, language);
        }

        setUserRating(nextRating);
        setResultModal({
          open: true,
          type: "victory",
          title: "VICTORY ACHIEVED! 🏆",
          description: `Outstanding code! You passed all ${total}/${total} test cases and dominated the arena before your opponent!`,
          newRating: nextRating,
          ratingDelta: 25,
        });
      }
    } catch (err: any) {
      console.error("Battle execution failed:", err);
      const targetCases = isSubmission
        ? [...(problem.publicTestCases || []), ...(problem.hiddenTestCases || [])]
        : (problem.publicTestCases || []);

      const errSummary: ExecutionSummary = {
        status: "Runtime Error",
        statusColor: "text-amber-500",
        runtime: "0ms",
        memory: "0MB",
        totalTestCases: targetCases.length,
        passedTestCases: 0,
        failedTestCaseIndex: 0,
        testResults: targetCases.map((tc, idx) => ({
          caseIndex: idx,
          passed: false,
          input: tc.input,
          expectedOutput: tc.output,
          actualOutput: "",
          stdout: "",
          error: err.message || "Runtime error encountered."
        })),
        errorDetails: err.message || "Execution failed. Check your logic and syntax."
      };

      setRunResult(errSummary);
      setMyProgress(0);
    } finally {
      setIsRunning(false);
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-bold text-xl">
        <div className="animate-spin text-3xl mb-3">⚔️</div>
        <span>Entering 1v1 Battle Arena...</span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden select-none">
      {/* 1. Battle Arena Header */}
      <header className="h-14 border-b flex items-center justify-between px-6 bg-secondary/30 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-base shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            ⚔️
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase font-black tracking-widest font-mono">
                1v1 Speed Battle
              </span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500/50 text-amber-400 font-bold">
                {problem.difficulty}
              </Badge>
            </div>
            <span className="font-bold text-sm truncate max-w-[280px] md:max-w-md">
              {problem.title}
            </span>
          </div>
        </div>

        {/* Center Countdown Clock */}
        <div className="flex items-center gap-3">
          <div className={`text-xl font-mono font-black tracking-widest px-4 py-1 rounded-lg border ${
            timeLeft < 180 
              ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse" 
              : "bg-secondary/60 text-primary border-primary/30"
          }`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Right Surrender Action */}
        <div className="flex items-center gap-3">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleSurrender}
            disabled={battleState !== "active"}
            className="h-8 text-xs font-bold shadow-md shadow-destructive/20"
          >
            🏳️ Surrender (-15)
          </Button>
        </div>
      </header>

      {/* 2. Live Progress Comparison Bar */}
      <div className="h-16 border-b flex px-6 items-center gap-8 bg-card/60 backdrop-blur-sm shrink-0">
        {/* User Progress */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-primary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping inline-block" />
              {displayName} ({userRating} Elo)
            </span>
            <span className="font-mono text-primary font-black">{myProgress}% Solved</span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden p-0.5 border border-primary/20">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(56,189,248,0.6)]"
              style={{ width: `${myProgress}%` }}
            />
          </div>
        </div>

        {/* VS Badge */}
        <div className="text-xl font-black italic text-muted-foreground/40 px-2 select-none tracking-tighter">
          VS
        </div>

        {/* Opponent Progress */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-destructive flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
              Alex_CodeMaster (1462 Elo)
            </span>
            <span className="font-mono text-destructive font-black">{opponentProgress}% Solved</span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden p-0.5 border border-destructive/20">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-rose-600 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
              style={{ width: `${opponentProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Split: Left (Problem) | Right (Editor & Tests) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem Statement & Examples */}
        <div className="w-[38%] border-r flex flex-col bg-card/40 overflow-hidden">
          <div className="p-3 border-b bg-muted/20 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
              Description & Constraints
            </span>
            <span className="text-xs font-mono text-primary">
              Target: {problem.methodName}()
            </span>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-5 prose prose-sm dark:prose-invert max-w-none text-foreground/90">
            <div>
              <p className="whitespace-pre-line leading-relaxed text-sm">
                {problem.description}
              </p>
            </div>

            {/* Test Case Examples */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Examples</h4>
              {problem.publicTestCases?.map((tc, idx) => (
                <div key={idx} className="bg-secondary/40 border border-border/60 p-3.5 rounded-xl font-mono text-xs space-y-1.5">
                  <div className="text-muted-foreground">
                    <strong className="text-foreground">Input:</strong> {tc.input}
                  </div>
                  <div>
                    <strong className="text-emerald-400">Output:</strong> {tc.output}
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Constraints</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs font-mono text-muted-foreground">
                  {problem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Editor, Language Selection & Test Runner */}
        <div className="w-[62%] flex flex-col relative overflow-hidden bg-background">
          {/* Editor Action Bar */}
          <div className="h-12 border-b flex items-center justify-between px-4 bg-card/50 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Language:</span>
              <div className="flex bg-secondary/60 rounded-lg p-0.5 border border-border/50 text-xs font-mono">
                {(["javascript", "python", "cpp", "java"] as SupportedLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2.5 py-1 rounded-md capitalize font-semibold transition-all ${
                      language === lang
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang === "cpp" ? "C++" : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Execution Controls */}
            <div className="flex items-center gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleExecute(false)}
                disabled={isRunning || isSubmitting || battleState !== "active"}
                className="h-8 text-xs font-bold gap-1.5 border border-border/60 hover:border-primary/40"
              >
                {isRunning ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin inline-block" />
                    Running...
                  </>
                ) : (
                  <>▶ Run Tests</>
                )}
              </Button>

              <Button
                size="sm"
                onClick={() => handleExecute(true)}
                disabled={isRunning || isSubmitting || battleState !== "active"}
                className="h-8 text-xs font-bold gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                    Evaluating...
                  </>
                ) : (
                  <>⚡ Submit Solution</>
                )}
              </Button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 relative overflow-hidden">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              theme="vs-dark"
              value={codes[language]}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 22,
                fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, monospace",
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* Bottom Test Results / Console Drawer */}
          <div className={`border-t bg-card/90 backdrop-blur-md flex flex-col transition-all duration-300 ${
            consoleOpen ? "h-64" : "h-10"
          }`}>
            {/* Drawer Header Toggle */}
            <div 
              onClick={() => setConsoleOpen(!consoleOpen)}
              className="h-10 px-4 border-b flex items-center justify-between cursor-pointer hover:bg-secondary/30 transition-colors select-none shrink-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <span>{consoleOpen ? "▼" : "▲"}</span> Test Case Execution
                </span>
                {runResult && (
                  <Badge 
                    variant="outline" 
                    className={`text-[11px] font-black uppercase px-2 py-0.5 border ${
                      runResult.status === "Accepted"
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/40 text-rose-400"
                    }`}
                  >
                    {runResult.status === "Accepted" ? "✓ All Cases Passed" : runResult.status}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs">
                {runResult && (
                  <span className="font-mono text-muted-foreground">
                    Passed: <strong className={runResult.passedTestCases === runResult.totalTestCases ? "text-emerald-400" : "text-amber-400"}>
                      {runResult.passedTestCases}/{runResult.totalTestCases}
                    </strong> ({Math.round((runResult.passedTestCases / (runResult.totalTestCases || 1)) * 100)}%)
                  </span>
                )}
                <span className="text-muted-foreground text-xs hover:text-foreground">
                  {consoleOpen ? "Collapse" : "Expand"}
                </span>
              </div>
            </div>

            {/* Drawer Body: Test Results & Details */}
            {consoleOpen && (
              <div className="flex-1 flex overflow-hidden">
                {!runResult ? (
                  <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground font-mono">
                    Click &ldquo;Run Tests&rdquo; or &ldquo;Submit Solution&rdquo; to evaluate your code against test cases.
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Test Case Tab Bar */}
                    <div className="h-9 border-b flex items-center px-3 gap-2 bg-muted/20 shrink-0 overflow-x-auto">
                      {runResult.testResults?.map((res, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveTestCaseTab(i)}
                          className={`px-3 py-1 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                            activeTestCaseTab === i
                              ? "bg-secondary text-foreground border border-border"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${res.passed ? "bg-emerald-400" : "bg-rose-400"}`} />
                          Case {i + 1}
                        </button>
                      ))}
                    </div>

                    {/* Active Test Case Content */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
                      {runResult.testResults && runResult.testResults[activeTestCaseTab] ? (
                        (() => {
                          const tc = runResult.testResults[activeTestCaseTab];
                          return (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className={`font-bold ${tc.passed ? "text-emerald-400" : "text-rose-400"}`}>
                                  {tc.passed ? "✓ Test Passed" : "✕ Test Failed"}
                                </span>
                                {tc.runtimeMs !== undefined && (
                                  <span className="text-muted-foreground text-[11px]">Runtime: {tc.runtimeMs}ms</span>
                                )}
                              </div>

                              <div className="space-y-1">
                                <span className="text-muted-foreground text-[11px] uppercase tracking-wider block">Input:</span>
                                <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/50 text-foreground">
                                  {tc.input}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <span className="text-muted-foreground text-[11px] uppercase tracking-wider block">Expected:</span>
                                  <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/50 text-emerald-400">
                                    {tc.expectedOutput}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-muted-foreground text-[11px] uppercase tracking-wider block">Your Output:</span>
                                  <div className={`p-2.5 rounded-lg bg-secondary/40 border border-border/50 ${tc.passed ? "text-emerald-400" : "text-rose-400"}`}>
                                    {tc.actualOutput || "<no output returned>"}
                                  </div>
                                </div>
                              </div>

                              {tc.error && (
                                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs whitespace-pre-wrap">
                                  <strong className="block mb-1">Error Details:</strong>
                                  {tc.error}
                                </div>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        <div className="text-muted-foreground">Select a testcase to view details.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Cyberpunk 2026 Victory / Defeat Modal */}
      {resultModal?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`w-full max-w-md p-6 rounded-2xl border text-center relative overflow-hidden shadow-2xl ${
            resultModal.type === "victory"
              ? "bg-card border-emerald-500/40 shadow-emerald-500/20"
              : "bg-card border-rose-500/40 shadow-rose-500/20"
          }`}>
            {/* Holographic Top Glow Bar */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${
              resultModal.type === "victory"
                ? "bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-500"
                : "bg-gradient-to-r from-orange-500 via-rose-500 to-red-600"
            }`} />

            <div className="text-5xl mb-4 mt-2 animate-bounce">
              {resultModal.type === "victory" ? "🏆" : "💀"}
            </div>

            <h2 className={`text-2xl font-black tracking-tight mb-2 ${
              resultModal.type === "victory" ? "text-emerald-400" : "text-rose-400"
            }`}>
              {resultModal.title}
            </h2>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {resultModal.description}
            </p>

            {/* Rating Delta Pill */}
            <div className="p-4 rounded-xl bg-secondary/50 border border-border mb-6 flex items-center justify-around">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold block mb-0.5">Rating Change</span>
                <span className={`text-xl font-black font-mono ${
                  resultModal.ratingDelta > 0 ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {resultModal.ratingDelta > 0 ? `+${resultModal.ratingDelta}` : resultModal.ratingDelta} Elo
                </span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold block mb-0.5">New Rating</span>
                <span className="text-xl font-black font-mono text-primary">
                  {resultModal.newRating}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => router.push("/battles")}
                className={`w-full font-bold h-10 ${
                  resultModal.type === "victory"
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                Return to Battles Lobby
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
