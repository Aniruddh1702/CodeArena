"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@codearena/ui";
import { getActiveAccount, saveUserAssessment, UserAccount } from "@/lib/auth-session";
import { getProblem, ProblemDefinition, PROBLEMS_DATABASE } from "@/lib/problems-data";
import { evaluateJavaScript, ExecutionSummary } from "@/lib/code-runner";

type SupportedLanguage = "javascript" | "python" | "cpp" | "java";

interface AssessmentQuestionItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  problemDef?: ProblemDefinition;
}

export default function ExamEnvironment({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeAccount, setActiveAccount] = useState<UserAccount | null>(null);
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7200); // 120 mins
  const [initialDurationSeconds, setInitialDurationSeconds] = useState(7200);
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  // Per-language code state
  const [codes, setCodes] = useState<Record<string, Record<string, string>>>({});
  
  // Execution & Testing state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<ExecutionSummary | null>(null);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [activeTabCase, setActiveTabCase] = useState(0);

  // Completion Modal
  const [submissionResult, setSubmissionResult] = useState<{
    open: boolean;
    score: number;
    totalPoints: number;
    passedTestCases: number;
    totalTestCases: number;
    status: string;
    testTitle: string;
  } | null>(null);

  const examSubmittedRef = useRef(false);

  // Initialize Account and Test details
  useEffect(() => {
    const active = getActiveAccount();
    if (!active) {
      router.push(`/login?redirect=/assessments/${params.id}`);
      return;
    }
    setActiveAccount(active);

    // Fetch test details or build from standard assessments
    const loadTest = async () => {
      try {
        const res = await fetch("/api/org/tests");
        let testData: any = null;
        if (res.ok) {
          const json = await res.json();
          testData = (json.tests || []).find((t: any) => t.id === params.id);
        }

        if (!testData) {
          // Default fallbacks based on test ID
          if (params.id === "t2") {
            testData = {
              id: "t2",
              title: "Weekly Coding Challenge",
              durationMinutes: 90,
              type: "COMPETITION",
              questions: [
                { id: "q1", slug: "longest-palindromic-substring", title: "Longest Palindromic Substring", difficulty: "MEDIUM" }
              ]
            };
          } else if (params.id === "t3") {
            testData = {
              id: "t3",
              title: "Arrays Basic Assessment",
              durationMinutes: 60,
              type: "PRACTICE",
              questions: [
                { id: "q1", slug: "two-sum", title: "Two Sum", difficulty: "EASY" }
              ]
            };
          } else {
            testData = {
              id: params.id || "t1",
              title: "Data Structures Mid-term",
              durationMinutes: 120,
              type: "EXAM",
              questions: [
                { id: "q1", slug: "merge-k-sorted-lists", title: "Merge k Sorted Lists", difficulty: "HARD" }
              ]
            };
          }
        }

        // Enrich questions with problem definitions
        const enrichedQuestions = (testData.questions || []).map((q: any) => {
          const prob = getProblem(q.slug) || PROBLEMS_DATABASE[q.slug] || PROBLEMS_DATABASE["two-sum"];
          return {
            ...q,
            description: prob?.description || q.description || "Solve the problem efficiently.",
            problemDef: prob
          };
        });

        const fullTest = { ...testData, questions: enrichedQuestions };
        setTest(fullTest);

        const durSec = (fullTest.durationMinutes || 120) * 60;
        setTimeLeft(durSec);
        setInitialDurationSeconds(durSec);

        // Prepopulate starter codes
        const initialCodeMap: Record<string, Record<string, string>> = {};
        enrichedQuestions.forEach((q: any) => {
          const slug = q.slug;
          const prob = q.problemDef;
          initialCodeMap[slug] = {
            javascript: prob?.starterCode?.javascript || "// JavaScript solution",
            python: prob?.starterCode?.python || "# Python solution",
            cpp: prob?.starterCode?.cpp || "// C++ solution",
            java: prob?.starterCode?.java || "// Java solution"
          };
        });
        setCodes(initialCodeMap);
      } catch (err) {
        console.error("Failed to load assessment data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [params.id, router]);

  // Tab Visibility & Proctoring Warnings
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !examSubmittedRef.current && !loading) {
        setWarnings((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            handleDisqualification();
          } else {
            alert(`⚠️ Proctoring Warning (${newCount}/3): Leaving the exam tab is strictly recorded. Reaching 3 warnings triggers automatic disqualification.`);
          }
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loading]);

  // Exam Countdown Timer
  useEffect(() => {
    if (!loading && timeLeft > 0 && !examSubmittedRef.current) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmitOnTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, timeLeft]);

  const activeQuestion: AssessmentQuestionItem | undefined = test?.questions?.[selectedQuestionIndex];
  const activeSlug = activeQuestion?.slug || "two-sum";
  const activeCode = codes[activeSlug]?.[language] || activeQuestion?.problemDef?.starterCode?.[language] || "";

  const handleCodeChange = (val: string | undefined) => {
    const text = val || "";
    setCodes((prev) => ({
      ...prev,
      [activeSlug]: {
        ...(prev[activeSlug] || {}),
        [language]: text
      }
    }));
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Run Test Cases via /api/execute
  const handleRunTests = async () => {
    if (!activeQuestion?.problemDef) return;
    setIsRunning(true);
    setConsoleOpen(true);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: activeSlug,
          language,
          code: activeCode,
          isSubmission: false
        })
      });

      if (res.ok) {
        const data: ExecutionSummary = await res.json();
        setRunResult(data);
        setActiveTabCase(data.status === "Accepted" ? 0 : data.failedTestCaseIndex);
      } else {
        const fallback = evaluateJavaScript(activeCode, activeQuestion.problemDef, activeQuestion.problemDef.publicTestCases || []);
        setRunResult(fallback);
      }
    } catch (err: any) {
      if (activeQuestion.problemDef && language === "javascript") {
        const fallback = evaluateJavaScript(activeCode, activeQuestion.problemDef, activeQuestion.problemDef.publicTestCases || []);
        setRunResult(fallback);
      } else {
        setRunResult({
          status: "Runtime Error",
          statusColor: "text-amber-500",
          runtime: "0ms",
          memory: "0MB",
          totalTestCases: activeQuestion.problemDef.publicTestCases?.length || 1,
          passedTestCases: 0,
          failedTestCaseIndex: 0,
          testResults: [],
          errorDetails: err.message || "Execution failed"
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  // Disqualification Handler
  const handleDisqualification = async () => {
    examSubmittedRef.current = true;
    const activeAcc = getActiveAccount();
    const timeSpentMinutes = Math.max(1, Math.round((initialDurationSeconds - timeLeft) / 60));

    if (activeAcc) {
      const studentRecord = {
        id: `asub_${Date.now()}`,
        testId: test?.id || params.id,
        testTitle: test?.title || "Assessment",
        score: 0,
        totalPoints: 100,
        status: "DISQUALIFIED",
        timeTaken: timeSpentMinutes,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        submittedAt: new Date().toISOString(),
        language,
        code: activeCode
      };

      saveUserAssessment(activeAcc.id, studentRecord);

      // Post to backend report
      try {
        await fetch(`/api/org/tests/${params.id}/report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: activeAcc.id,
            studentName: activeAcc.name || activeAcc.username || "Student",
            studentEmail: activeAcc.email,
            score: 0,
            timeTakenMinutes: timeSpentMinutes,
            status: "Disqualified (Proctoring)",
            code: activeCode,
            language
          })
        });
      } catch (e) {}
    }
  };

  const handleAutoSubmitOnTimeout = () => {
    alert("Exam time has expired! Automatically submitting your assessment...");
    performSubmission(true);
  };

  // Final Exam Submission & Backend Grading
  const performSubmission = async (isAuto: boolean = false) => {
    if (examSubmittedRef.current) return;
    examSubmittedRef.current = true;
    setIsSubmitting(true);

    const activeAcc = getActiveAccount();
    const timeSpentMinutes = Math.max(1, Math.round((initialDurationSeconds - timeLeft) / 60));

    let finalScore = 0;
    let passedCount = 0;
    let totalCount = 1;

    try {
      // 1. Evaluate user code against all test cases (public + hidden)
      if (activeQuestion?.problemDef) {
        const res = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: activeSlug,
            language,
            code: activeCode,
            isSubmission: true
          })
        });

        if (res.ok) {
          const summary: ExecutionSummary = await res.json();
          passedCount = summary.passedTestCases || 0;
          totalCount = summary.totalTestCases || 1;
          finalScore = Math.round((passedCount / totalCount) * 100);
        } else if (language === "javascript") {
          const allCases = [
            ...(activeQuestion.problemDef.publicTestCases || []),
            ...(activeQuestion.problemDef.hiddenTestCases || [])
          ];
          const summary = evaluateJavaScript(activeCode, activeQuestion.problemDef, allCases);
          passedCount = summary.passedTestCases || 0;
          totalCount = summary.totalTestCases || 1;
          finalScore = Math.round((passedCount / totalCount) * 100);
        }
      }

      // 2. Transmit grade to Backend Assessment Reporting System (/api/org/tests/[id]/report)
      if (activeAcc) {
        await fetch(`/api/org/tests/${params.id}/report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: activeAcc.id,
            studentName: activeAcc.name || activeAcc.username || "Student",
            studentEmail: activeAcc.email,
            score: finalScore,
            timeTakenMinutes: timeSpentMinutes,
            timeTaken: `${timeSpentMinutes}m`,
            status: warnings >= 3 ? "Disqualified (Proctoring)" : "Evaluated",
            code: activeCode,
            language,
            passedTestCases: passedCount,
            totalTestCases: totalCount
          })
        });

        // 3. Persist into Student's Scoped Assessment History
        saveUserAssessment(activeAcc.id, {
          id: `asub_${Date.now()}`,
          testId: test?.id || params.id,
          testTitle: test?.title || "Assessment",
          score: finalScore,
          totalPoints: 100,
          status: warnings >= 3 ? "DISQUALIFIED" : "EVALUATED",
          timeTaken: timeSpentMinutes,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          submittedAt: new Date().toISOString(),
          language,
          code: activeCode,
          passedTestCases: passedCount,
          totalTestCases: totalCount
        });
      }

      setSubmissionResult({
        open: true,
        score: finalScore,
        totalPoints: 100,
        passedTestCases: passedCount,
        totalTestCases: totalCount,
        status: warnings >= 3 ? "Disqualified (Proctoring)" : "Evaluated",
        testTitle: test?.title || "Assessment"
      });
    } catch (err: any) {
      console.error("Submission failed:", err);
      alert("Submission encountered a network issue, but local copy was saved.");
      router.push("/assessments");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = () => {
    if (window.confirm("Are you sure you want to finish and submit the exam? Your solutions will be evaluated and graded immediately.")) {
      performSubmission(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="text-xl font-bold">Initializing Secure Proctored Environment...</div>
        <p className="text-muted-foreground text-sm">Loading test cases and sandbox configuration...</p>
      </div>
    );
  }

  if (warnings >= 3) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive/60 bg-card/90 shadow-2xl">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">🚫</div>
            <CardTitle className="text-destructive font-black text-2xl">Exam Terminated</CardTitle>
            <CardDescription className="text-foreground/80 mt-2">
              You exceeded the maximum allowed tab-switch warnings (3/3). This session has been flagged and marked as disqualified in the assessment report.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full font-bold" variant="destructive" onClick={() => router.push("/assessments")}>
              Return to Assessments
            </Button>
            <Button className="w-full font-semibold" variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden selection:bg-none">
      {/* 1. Proctored Exam Header */}
      <header className="h-14 border-b flex items-center justify-between px-6 bg-card/70 backdrop-blur-md shrink-0 border-destructive/30">
        <div className="flex items-center gap-3">
          <span className="text-destructive font-mono uppercase tracking-widest text-[11px] font-black border border-destructive/40 bg-destructive/10 px-2 py-0.5 rounded-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-ping" />
            Proctored Session
          </span>
          <span className="font-bold text-sm text-foreground/90">{test?.title}</span>
        </div>

        {/* Center Timer */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-base font-black px-3 py-1 rounded-lg border bg-secondary/60">
            <span>⏱️</span>
            <span className={timeLeft < 300 ? "text-destructive animate-pulse" : "text-primary"}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {warnings > 0 && (
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-xs font-bold">
              ⚠️ Warnings: {warnings}/3
            </Badge>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <select
            className="bg-secondary text-secondary-foreground rounded-lg text-xs font-semibold px-3 py-1.5 border border-border/80 outline-none focus:ring-1 focus:ring-primary cursor-pointer font-mono"
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (g++ 17)</option>
            <option value="java">Java</option>
          </select>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleManualSubmit}
            disabled={isSubmitting}
            className="h-8 text-xs font-bold gap-1.5 shadow-md shadow-destructive/20"
          >
            {isSubmitting ? "Grading..." : "Submit Exam"}
          </Button>
        </div>
      </header>

      {/* 2. Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Question Details */}
        <div className="w-[38%] border-r flex flex-col bg-card/40 overflow-hidden">
          {/* Question Nav if multiple */}
          {test?.questions?.length > 1 && (
            <div className="h-10 border-b flex items-center px-4 gap-2 bg-muted/20 shrink-0">
              {test.questions.map((q: any, i: number) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestionIndex(i)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    selectedQuestionIndex === i
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Question {i + 1}
                </button>
              ))}
            </div>
          )}

          <div className="p-6 flex-1 overflow-y-auto space-y-5 prose prose-sm dark:prose-invert max-w-none">
            <div className="flex items-center justify-between pb-2 border-b">
              <h2 className="text-lg font-bold m-0">{activeQuestion?.title}</h2>
              <Badge variant="outline" className="text-[11px] font-bold border-amber-500/40 text-amber-400">
                {activeQuestion?.difficulty || "MEDIUM"}
              </Badge>
            </div>

            <p className="whitespace-pre-line leading-relaxed text-sm text-foreground/90">
              {activeQuestion?.description}
            </p>

            {/* Public Test Case Previews */}
            {activeQuestion?.problemDef?.publicTestCases && activeQuestion.problemDef.publicTestCases.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sample Test Cases</h4>
                {activeQuestion.problemDef.publicTestCases.map((tc, idx) => (
                  <div key={idx} className="bg-secondary/40 border border-border/60 p-3 rounded-xl font-mono text-xs space-y-1">
                    <div>
                      <strong className="text-muted-foreground">Input:</strong> {tc.input}
                    </div>
                    <div>
                      <strong className="text-emerald-400">Expected:</strong> {tc.output}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Test Runner */}
        <div className="w-[62%] flex flex-col relative overflow-hidden bg-background">
          {/* Editor Action Bar */}
          <div className="h-11 border-b flex items-center justify-between px-4 bg-card/50 shrink-0">
            <div className="text-xs font-mono text-muted-foreground">
              Target Method: <strong className="text-primary">{activeQuestion?.problemDef?.methodName || "solve"}()</strong>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleRunTests}
              disabled={isRunning || isSubmitting}
              className="h-7 text-xs font-bold gap-1.5 border border-border"
            >
              {isRunning ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-primary border-t-transparent animate-spin inline-block" />
                  Running...
                </>
              ) : (
                <>▶ Run Tests</>
              )}
            </Button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative overflow-hidden">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              theme="vs-dark"
              value={activeCode}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 22,
                fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, monospace",
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                contextmenu: false
              }}
            />
          </div>

          {/* Test Case Execution Drawer */}
          <div className={`border-t bg-card/90 backdrop-blur-md flex flex-col transition-all duration-300 ${
            consoleOpen ? "h-56" : "h-9"
          }`}>
            <div
              onClick={() => setConsoleOpen(!consoleOpen)}
              className="h-9 px-4 border-b flex items-center justify-between cursor-pointer hover:bg-secondary/30 transition-colors select-none shrink-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <span>{consoleOpen ? "▼" : "▲"}</span> Sample Evaluation
                </span>
                {runResult && (
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold uppercase px-1.5 py-0 border ${
                      runResult.status === "Accepted"
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/40 text-rose-400"
                    }`}
                  >
                    {runResult.status}
                  </Badge>
                )}
              </div>

              {runResult && (
                <div className="text-xs font-mono text-muted-foreground">
                  Passed: {runResult.passedTestCases}/{runResult.totalTestCases}
                </div>
              )}
            </div>

            {consoleOpen && (
              <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-2">
                {!runResult ? (
                  <div className="text-muted-foreground text-center py-4">
                    Click &ldquo;Run Tests&rdquo; to test your solution against sample cases before submitting.
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2 border-b pb-2 mb-2">
                      {runResult.testResults?.map((res, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveTabCase(i)}
                          className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                            activeTabCase === i ? "bg-secondary text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          <span className={res.passed ? "text-emerald-400 mr-1" : "text-rose-400 mr-1"}>●</span>
                          Case {i + 1}
                        </button>
                      ))}
                    </div>

                    {runResult.testResults && runResult.testResults[activeTabCase] && (
                      <div className="space-y-1.5">
                        <div className="text-muted-foreground">Input: {runResult.testResults[activeTabCase].input}</div>
                        <div className="text-emerald-400">Expected: {runResult.testResults[activeTabCase].expectedOutput}</div>
                        <div className={runResult.testResults[activeTabCase].passed ? "text-emerald-400" : "text-rose-400"}>
                          Actual: {runResult.testResults[activeTabCase].actualOutput || "<no output>"}
                        </div>
                        {runResult.testResults[activeTabCase].error && (
                          <div className="p-2 rounded bg-rose-500/10 text-rose-400 text-xs">
                            {runResult.testResults[activeTabCase].error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Post-Submission Graded Results Modal */}
      {submissionResult?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md p-6 rounded-2xl border border-primary/40 bg-card text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

            <div className="text-5xl mb-3 mt-1">📊</div>

            <h2 className="text-2xl font-black tracking-tight mb-1 text-foreground">
              Assessment Completed!
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your test has been graded and transmitted to the organization assessment report.
            </p>

            <div className="p-4 rounded-xl bg-secondary/50 border border-border mb-6 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold block mb-1">Final Score</span>
                <span className="text-3xl font-black font-mono text-primary">
                  {submissionResult.score}%
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold block mb-1">Test Cases</span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {submissionResult.passedTestCases}/{submissionResult.totalTestCases}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <Button
                onClick={() => router.push(`/org/tests/${params.id}/report`)}
                className="w-full font-bold h-10 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                View Organization Report
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/assessments")}
                className="w-full font-semibold h-10"
              >
                Return to Assessments Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
