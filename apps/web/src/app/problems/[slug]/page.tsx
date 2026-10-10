"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Editor from "@monaco-editor/react";
import { Button, Card, CardHeader, CardTitle, CardContent, Tabs, TabsList, TabsTrigger, TabsContent } from "@codearena/ui";
import { getProblem, PROBLEMS_DATABASE, ProblemDefinition, TestCase } from "@/lib/problems-data";
import { evaluateJavaScript, ExecutionSummary, TestResult } from "@/lib/code-runner";
import { getActiveAccount, getUserStats, getUserProblemSubmissions, saveUserProblemSubmission, recordUserSolve } from "@/lib/auth-session";
import { AccountSwitcher } from "@/components/AccountSwitcher";

interface SavedSubmission {
  id: string;
  status: string;
  passedCases: string;
  runtime: string;
  memory: string;
  language: string;
  code: string;
  time: string;
  date: string;
  errorDetails?: string;
  testResults?: TestResult[];
}

export default function ProblemWorkspace({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const initialProb = getProblem(params.slug) || (PROBLEMS_DATABASE as any)[params.slug] || Object.values(PROBLEMS_DATABASE)[0];
  const [question, setQuestion] = useState<ProblemDefinition>(initialProb);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<"javascript" | "python" | "cpp" | "java">("javascript");
  const [code, setCode] = useState<string>("");
  const [codePerLanguage, setCodePerLanguage] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState(false);

  // Tabs & Views
  const [activeTab, setActiveTab] = useState("description");
  const [consoleTab, setConsoleTab] = useState("testcases");
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [consoleView, setConsoleView] = useState<"normal" | "expanded" | "minimized">("normal");

  // Execution Results
  const [hasRun, setHasRun] = useState(false);
  const [runResult, setRunResult] = useState<ExecutionSummary | null>(null);
  const [submissions, setSubmissions] = useState<SavedSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SavedSubmission | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loadedIntoEditorNotice, setLoadedIntoEditorNotice] = useState(false);
  const [isProblemSolved, setIsProblemSolved] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  const [submitFeedback, setSubmitFeedback] = useState<{
    status: string;
    message: string;
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

    // Determine error line
    let line = result.errorLine;
    if (!line) {
      const lineMatch = (result.errorDetails || "").match(/line\s+(\d+)/i) || 
                        (result.testResults[result.failedTestCaseIndex]?.error || "").match(/line\s+(\d+)/i);
      if (lineMatch) {
        line = parseInt(lineMatch[1], 10);
      }
    }
    if (!line) {
      const lines = currentCode.split("\n");
      for (let i = lines.length - 1; i >= 0; i--) {
        if (/\breturn\b/.test(lines[i])) {
          line = i + 1;
          break;
        }
      }
    }

    const safeLine = Math.min(Math.max(1, line || 1), model.getLineCount());
    const lineContent = model.getLineContent(safeLine);
    const firstFail = result.testResults[result.failedTestCaseIndex];
    const errMsg = firstFail?.error || result.errorDetails || "Code verification failed";

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

  // Helper: Persist and sync code per language scoped to active student
  const saveCodeForLanguage = (lang: string, val: string, userAcc?: any) => {
    setCodePerLanguage((prev) => {
      const next = { ...prev, [lang]: val };
      const user = userAcc || currentUser || getActiveAccount();
      if (typeof window !== "undefined" && user?.id) {
        try {
          const safeId = user.id.replace(/[^a-zA-Z0-9_-]/g, "_");
          localStorage.setItem(`codearena_${safeId}_code_${params.slug}`, JSON.stringify(next));
        } catch (e) {
          console.error("Failed to save code cache:", e);
        }
      }
      return next;
    });
  };

  // Handle Code changes in Monaco
  const handleCodeChange = (val: string | undefined) => {
    const nextCode = val || "";
    setCode(nextCode);
    saveCodeForLanguage(language, nextCode);
    clearEditorMarkers();
  };

  // Handle language switch WITHOUT wiping written solutions
  const handleLanguageChange = (val: "javascript" | "python" | "cpp" | "java") => {
    if (val === language) return;

    // 1. Snapshot current editor code into cache for the current language
    const updatedCache = { ...codePerLanguage, [language]: code };
    setCodePerLanguage(updatedCache);

    const activeAcc = currentUser || getActiveAccount();
    if (typeof window !== "undefined" && activeAcc?.id) {
      try {
        const safeId = activeAcc.id.replace(/[^a-zA-Z0-9_-]/g, "_");
        localStorage.setItem(`codearena_${safeId}_code_${params.slug}`, JSON.stringify(updatedCache));
      } catch (e) {}
    }

    // 2. Load the student's previously written code for target language, or fallback to starter code
    const nextCode = updatedCache[val] !== undefined
      ? updatedCache[val]
      : (question.starterCode?.[val] || question.starterCode?.javascript || "");

    setLanguage(val);
    setCode(nextCode);
    clearEditorMarkers();
    setRunResult(null);
    setSubmitFeedback(null);
  };

  // Reset current language code to template starter code
  const handleResetCode = () => {
    const langDisplay = language === "cpp" ? "C++" : language.toUpperCase();
    if (typeof window !== "undefined" && !window.confirm(`Reset your ${langDisplay} code back to the original starter code?`)) {
      return;
    }
    const starter = question.starterCode?.[language] || question.starterCode?.javascript || "";
    setCode(starter);
    saveCodeForLanguage(language, starter);
    clearEditorMarkers();
    setRunResult(null);
    setSubmitFeedback(null);
  };

  // Load problem details & past submissions
  useEffect(() => {
    const prob = getProblem(params.slug) || (PROBLEMS_DATABASE as any)[params.slug] || Object.values(PROBLEMS_DATABASE)[0];
    if (prob) {
      setQuestion(prob);
    }
    setRunResult(null);
    setSubmitFeedback(null);
    setHasRun(false);

    if (typeof window !== "undefined") {
      const activeAcc = getActiveAccount();
      if (!activeAcc) {
        setCurrentUser(null);
        setAuthChecked(true);
        router.push(`/login?redirect=/problems/${params.slug}`);
        return;
      }
      setCurrentUser(activeAcc);
      setAuthChecked(true);
      const activeId = activeAcc.id || "default";
      const safeId = activeId.replace(/[^a-zA-Z0-9_-]/g, "_");

      // 1. Retrieve cached codes per language for this active student
      let loadedCodes: Record<string, string> = {};
      try {
        const saved = localStorage.getItem(`codearena_${safeId}_code_${params.slug}`);
        if (saved) {
          loadedCodes = JSON.parse(saved);
        }
      } catch (e) {}

      // Seed starter codes for any languages not yet written
      if (prob) {
        const defaultCodes: Record<string, string> = {
          javascript: prob.starterCode?.javascript || "",
          python: prob.starterCode?.python || "",
          cpp: prob.starterCode?.cpp || "",
          java: prob.starterCode?.java || "",
        };
        loadedCodes = { ...defaultCodes, ...loadedCodes };
      }

      setCodePerLanguage(loadedCodes);
      const initialCode = loadedCodes[language] !== undefined
        ? loadedCodes[language]
        : (prob?.starterCode?.[language] || prob?.starterCode?.javascript || "");
      setCode(initialCode);

      // 2. Load submissions strictly scoped to active account (never leak other users)
      const userSubs = getUserProblemSubmissions(activeId, params.slug);
      setSubmissions(userSubs);

      // 3. Check if problem is solved by active account
      const stats = getUserStats(activeId);
      const isSolved = stats.solvedProblems.some((p: any) => p.slug === params.slug);
      setIsProblemSolved(isSolved);

      // 4. React to account changes so new user starts completely from new
      const handleAccountChange = () => {
        const currentAcc = getActiveAccount();
        if (!currentAcc) {
          router.push(`/login?redirect=/problems/${params.slug}`);
          return;
        }
        setCurrentUser(currentAcc);
        const currentId = currentAcc.id || "default";
        const currentSafeId = currentId.replace(/[^a-zA-Z0-9_-]/g, "_");

        let accCodes: Record<string, string> = {};
        try {
          const saved = localStorage.getItem(`codearena_${currentSafeId}_code_${params.slug}`);
          if (saved) {
            accCodes = JSON.parse(saved);
          }
        } catch (e) {}

        const p = getProblem(params.slug) || (PROBLEMS_DATABASE as any)[params.slug] || Object.values(PROBLEMS_DATABASE)[0];
        if (p) {
          const defaultCodes: Record<string, string> = {
            javascript: p.starterCode?.javascript || "",
            python: p.starterCode?.python || "",
            cpp: p.starterCode?.cpp || "",
            java: p.starterCode?.java || "",
          };
          accCodes = { ...defaultCodes, ...accCodes };
          setQuestion(p);
        }

        setCodePerLanguage(accCodes);
        setCode(accCodes[language] || p?.starterCode?.[language] || p?.starterCode?.javascript || "");

        const subs = getUserProblemSubmissions(currentId, params.slug);
        setSubmissions(subs);
        const s = getUserStats(currentId);
        setIsProblemSolved(s.solvedProblems.some((p: any) => p.slug === params.slug));
        clearEditorMarkers();
        setRunResult(null);
        setSubmitFeedback(null);
        setHasRun(false);
      };

      window.addEventListener("codearena_account_changed", handleAccountChange);
      return () => {
        window.removeEventListener("codearena_account_changed", handleAccountChange);
      };
    }
  }, [params.slug, router]);

  // Run Code (Public Testcases)
  const handleRunCode = async () => {
    const activeAcc = getActiveAccount();
    if (!activeAcc) {
      router.push(`/login?redirect=/problems/${params.slug}`);
      return;
    }

    setIsRunning(true);
    setHasRun(true);
    setConsoleTab("test-result");
    if (consoleView === "minimized") setConsoleView("normal");
    setSubmitFeedback(null);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: question.slug,
          language,
          code,
          isSubmission: false
        })
      });

      if (res.ok) {
        const data: ExecutionSummary = await res.json();
        setRunResult(data);
        setActiveTestCase(data.status === "Accepted" ? 0 : data.failedTestCaseIndex);
        updateEditorMarkers(data, code);
      } else {
        const errJson = await res.json().catch(() => null);
        if (errJson && errJson.status) {
          setRunResult(errJson);
          setActiveTestCase(errJson.status === "Accepted" ? 0 : errJson.failedTestCaseIndex);
          updateEditorMarkers(errJson, code);
        } else if (language === "javascript") {
          const fallback = evaluateJavaScript(code, question, question.publicTestCases);
          setRunResult(fallback);
          setActiveTestCase(fallback.status === "Accepted" ? 0 : fallback.failedTestCaseIndex);
          updateEditorMarkers(fallback, code);
        } else {
          const fallback: ExecutionSummary = {
            status: "Runtime Error",
            statusColor: "text-amber-500",
            runtime: "0ms",
            memory: "0MB",
            totalTestCases: question.publicTestCases.length,
            passedTestCases: 0,
            failedTestCaseIndex: 0,
            testResults: question.publicTestCases.map((tc, idx) => ({
              caseIndex: idx,
              passed: false,
              input: tc.input,
              expectedOutput: tc.output,
              actualOutput: "",
              stdout: "",
              error: "Execution error occurred."
            })),
            errorDetails: "Execution error occurred."
          };
          setRunResult(fallback);
          setActiveTestCase(0);
          updateEditorMarkers(fallback, code);
        }
      }
    } catch (err: any) {
      if (language === "javascript") {
        const fallback = evaluateJavaScript(code, question, question.publicTestCases);
        setRunResult(fallback);
        setActiveTestCase(fallback.status === "Accepted" ? 0 : fallback.failedTestCaseIndex);
        updateEditorMarkers(fallback, code);
      } else {
        const fallback: ExecutionSummary = {
          status: "Runtime Error",
          statusColor: "text-amber-500",
          runtime: "0ms",
          memory: "0MB",
          totalTestCases: question.publicTestCases.length,
          passedTestCases: 0,
          failedTestCaseIndex: 0,
          testResults: question.publicTestCases.map((tc, idx) => ({
            caseIndex: idx,
            passed: false,
            input: tc.input,
            expectedOutput: tc.output,
            actualOutput: "",
            stdout: "",
            error: err.message || "Failed to reach execution runner."
          })),
          errorDetails: err.message || "Network error"
        };
        setRunResult(fallback);
        setActiveTestCase(0);
        updateEditorMarkers(fallback, code);
      }
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Code (All Testcases: Public + Hidden)
  const handleSubmit = async () => {
    const activeAcc = getActiveAccount();
    if (!activeAcc) {
      router.push(`/login?redirect=/problems/${params.slug}`);
      return;
    }

    setIsRunning(true);
    setHasRun(true);
    setConsoleTab("test-result");
    if (consoleView === "minimized") setConsoleView("normal");

    try {
      let data: ExecutionSummary;
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: question.slug,
          language,
          code,
          isSubmission: true
        })
      });

      if (res.ok) {
        data = await res.json();
      } else {
        const errJson = await res.json().catch(() => null);
        if (errJson && errJson.status) {
          data = errJson;
        } else if (language === "javascript") {
          const allCases = [...question.publicTestCases, ...question.hiddenTestCases];
          data = evaluateJavaScript(code, question, allCases);
        } else {
          const allCases = [...question.publicTestCases, ...question.hiddenTestCases];
          data = {
            status: "Runtime Error",
            statusColor: "text-amber-500",
            runtime: "0ms",
            memory: "0MB",
            totalTestCases: allCases.length,
            passedTestCases: 0,
            failedTestCaseIndex: 0,
            testResults: allCases.map((tc, idx) => ({
              caseIndex: idx,
              passed: false,
              input: tc.input,
              expectedOutput: tc.output,
              actualOutput: "",
              stdout: "",
              error: "Execution error occurred."
            })),
            errorDetails: "Execution error occurred."
          };
        }
      }

      setRunResult(data);
      setActiveTestCase(data.status === "Accepted" ? 0 : data.failedTestCaseIndex);
      updateEditorMarkers(data, code);

      const isAccepted = data.status === "Accepted";
      
      // Store complete submission INCLUDING submitted code and details
      const newSubmission: SavedSubmission = {
        id: Math.random().toString(36).substring(7),
        status: data.status,
        passedCases: `${data.passedTestCases} / ${data.totalTestCases}`,
        runtime: data.runtime,
        memory: data.memory,
        language,
        code: code,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: "Today",
        errorDetails: data.errorDetails,
        testResults: data.testResults
      };

      const activeAcc = getActiveAccount();
      const activeId = activeAcc?.id || "default";

      // Save submission scoped to active user
      saveUserProblemSubmission(activeId, params.slug, newSubmission);
      const updatedSubmissions = [newSubmission, ...submissions];
      setSubmissions(updatedSubmissions);

      if (isAccepted) {
        setIsProblemSolved(true);
        const solveResult = recordUserSolve(
          activeId,
          {
            slug: question.slug,
            title: question.title,
            difficulty: question.difficulty,
          },
          language,
          data.runtime,
          data.memory
        );

        const accountDisplayName = activeAcc?.name || activeAcc?.username || "You";

        if (solveResult.isNewSolve) {
          setSubmitFeedback({
            status: "Accepted 🎉",
            message: `All ${data.totalTestCases}/${data.totalTestCases} test cases passed! +15 DSA Rating earned. (Account: ${accountDisplayName})`,
            isSuccess: true,
          });
        } else {
          setSubmitFeedback({
            status: "Accepted 🎉",
            message: `All ${data.totalTestCases}/${data.totalTestCases} test cases passed! (Problem already solved by ${accountDisplayName}).`,
            isSuccess: true,
          });
        }
      } else {
        setSubmitFeedback({
          status: `${data.status} ❌`,
          message: `Passed ${data.passedTestCases} of ${data.totalTestCases} test cases. Review failure diagnostics to fix.`,
          isSuccess: false
        });
      }
    } catch (e: any) {
      setSubmitFeedback({
        status: "Execution Failed",
        message: e.message || "An unexpected error occurred while testing your code.",
        isSuccess: false
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Restore code from submission into the Monaco editor
  const handleLoadSubmissionIntoEditor = (sub: SavedSubmission) => {
    setCode(sub.code);
    clearEditorMarkers();
    const rawLang = (sub.language || "").toLowerCase();
    const subLang: "javascript" | "python" | "cpp" | "java" =
      rawLang.includes("py") ? "python" :
      rawLang.includes("cpp") || rawLang.includes("c++") ? "cpp" :
      rawLang.includes("java") && !rawLang.includes("script") ? "java" :
      "javascript";

    setLanguage(subLang);
    saveCodeForLanguage(subLang, sub.code);
    setLoadedIntoEditorNotice(true);
    setTimeout(() => setLoadedIntoEditorNotice(false), 3000);
  };

  // Copy code to clipboard
  const handleCopyCode = (textToCopy: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const currentResultCase: TestResult | undefined = runResult?.testResults[activeTestCase];
  const activePublicCase: TestCase | undefined = question.publicTestCases[activeTestCase];

  if (authChecked && !currentUser) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mx-auto shadow-inner">
            🔒
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight">Student Login Required</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You must be registered and signed in to view questions, write solutions in the Monaco IDE, and submit code to the leaderboard.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={() => router.push(`/login?redirect=/problems/${params.slug}`)} className="flex-1 font-bold h-11">
              Sign In &rarr;
            </Button>
            <Button onClick={() => router.push(`/register?redirect=/problems/${params.slug}`)} variant="outline" className="flex-1 font-bold h-11">
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top IDE Header */}
      <header className="h-14 border-b flex items-center justify-between px-5 bg-card/90 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/problems')}
            className="text-xs font-semibold gap-1.5"
          >
            ← Problems
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="font-bold text-base flex items-center gap-2.5">
            <span>{question.title}</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              question.difficulty === 'EASY' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : question.difficulty === 'MEDIUM' 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {question.difficulty}
            </span>
            {isProblemSolved && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                ✓ Solved
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {loadedIntoEditorNotice && (
            <span className="text-xs text-emerald-400 font-semibold animate-in fade-in">
              ✓ Solution loaded into editor!
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <select 
              className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg border border-border/80 outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as any)}
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python 3</option>
              <option value="cpp">C++ (g++ 17)</option>
              <option value="java">Java</option>
            </select>
            <button
              onClick={handleResetCode}
              title={`Reset ${language === "cpp" ? "C++" : language} code to starter template`}
              className="h-7 w-7 rounded-lg bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/80 text-xs font-bold transition-colors flex items-center justify-center"
            >
              ↺
            </button>
          </div>

          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleRunCode} 
            disabled={isRunning}
            className="h-8 text-xs font-semibold px-4 gap-1.5 hover:bg-secondary/80"
          >
            <span>▶</span> Run Code
          </Button>

          <Button 
            size="sm" 
            onClick={handleSubmit} 
            disabled={isRunning}
            className="h-8 text-xs font-semibold px-5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/30"
          >
            <span>🚀</span> Submit
          </Button>

          <div className="ml-2">
            <AccountSwitcher />
          </div>
        </div>
      </header>

      {/* Main Split Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Description, Editorial, Submissions */}
        <div className="w-1/2 border-r flex flex-col bg-card overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-4 bg-muted/20">
              <TabsList className="bg-transparent h-10">
                <TabsTrigger value="description" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full text-xs font-semibold">
                  Description
                </TabsTrigger>
                <TabsTrigger value="editorial" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full text-xs font-semibold">
                  Editorial & Hints
                </TabsTrigger>
                <TabsTrigger value="submissions" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full text-xs font-semibold">
                  Submissions {submissions.length > 0 && `(${submissions.length})`}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Description Tab */}
            <TabsContent value="description" className="flex-1 overflow-y-auto p-6 m-0 focus-visible:outline-none space-y-6">
              <div className="space-y-4 leading-relaxed">
                <p className="whitespace-pre-wrap text-sm text-foreground/90 font-sans leading-relaxed">
                  {question.description}
                </p>

                {/* Examples */}
                <div className="space-y-4 pt-2">
                  <h3 className="font-bold text-sm text-foreground">Examples:</h3>
                  {question.publicTestCases.map((tc, idx) => (
                    <div key={idx} className="space-y-1.5 p-3.5 rounded-xl bg-secondary/30 border border-border/60 font-mono text-xs">
                      <p className="font-semibold text-muted-foreground font-sans">Example {idx + 1}:</p>
                      <div>
                        <span className="text-muted-foreground font-semibold">Input: </span>
                        <span className="text-foreground">{tc.input}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-semibold">Output: </span>
                        <span className="text-foreground font-bold">{tc.output}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                {question.constraints && question.constraints.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="font-bold text-sm text-foreground">Constraints:</h3>
                    <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground font-mono">
                      {question.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Editorial / Hints Tab */}
            <TabsContent value="editorial" className="flex-1 overflow-y-auto p-6 m-0 space-y-4">
              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/60">
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
                    <span>💡</span> Algorithm Hint
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Think about the optimal time complexity. Can you reduce an O(n²) brute-force check to O(n) or O(log n) using a hash map, two pointers, or binary search?
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/60">
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
                    <span>⚙️</span> Time & Space Complexity Target
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Time: O(n) | Space: O(n) or O(1). Be mindful of array indexing and boundary conditions.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Submissions Tab - WITH CODE VIEW & DETAILS */}
            <TabsContent value="submissions" className="flex-1 p-6 m-0 overflow-y-auto pb-12">
              {/* Detailed View for Selected Submission */}
              {selectedSubmission ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <button 
                      onClick={() => setSelectedSubmission(null)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      ← Back to All Submissions
                    </button>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleCopyCode(selectedSubmission.code)}
                        className="h-7 text-xs"
                      >
                        {copiedCode ? "✓ Copied" : "Copy Code"}
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleLoadSubmissionIntoEditor(selectedSubmission)}
                        className="h-7 text-xs bg-primary text-primary-foreground font-semibold"
                      >
                        Restore to Editor
                      </Button>
                    </div>
                  </div>

                  {/* Submission Header Card */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    selectedSubmission.status === "Accepted" 
                      ? "bg-emerald-500/10 border-emerald-500/30" 
                      : "bg-rose-500/10 border-rose-500/30"
                  }`}>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className={`text-lg font-black ${
                          selectedSubmission.status === "Accepted" ? "text-emerald-400" : "text-rose-400"
                        }`}>
                          {selectedSubmission.status === "Accepted" ? "✓ Accepted" : `✕ ${selectedSubmission.status}`}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary font-mono uppercase font-bold text-muted-foreground">
                          {selectedSubmission.language}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted at {selectedSubmission.time} ({selectedSubmission.passedCases} test cases passed)
                      </p>
                    </div>

                    <div className="text-right font-mono text-xs space-y-0.5">
                      <div>Runtime: <strong className="text-foreground">{selectedSubmission.runtime}</strong></div>
                      <div>Memory: <strong className="text-foreground">{selectedSubmission.memory}</strong></div>
                    </div>
                  </div>

                  {/* Error Details (if any) */}
                  {selectedSubmission.errorDetails && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs whitespace-pre-wrap">
                      <p className="font-bold mb-1">Execution Failure Details:</p>
                      {selectedSubmission.errorDetails}
                    </div>
                  )}

                  {/* Submitted Code Viewer */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Submitted Solution Code
                      </label>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {selectedSubmission.code.split('\n').length} lines
                      </span>
                    </div>
                    <div className="rounded-xl border border-border/80 bg-[#1e1e1e] overflow-hidden shadow-xl">
                      <div className="p-4 overflow-x-auto font-mono text-xs text-neutral-200 leading-relaxed max-h-[380px] overflow-y-auto">
                        <pre className="font-mono">
                          <code>{selectedSubmission.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground space-y-3">
                  <div className="text-3xl">📝</div>
                  <p className="font-semibold text-sm">No submissions recorded yet.</p>
                  <p className="text-xs">Click "Submit" in the header to run all test cases and view your submitted solutions here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold px-1">
                    <span>Recent Submissions ({submissions.length})</span>
                    <span>Click any solution to view full code</span>
                  </div>

                  {submissions.map((sub, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedSubmission(sub)}
                      className={`p-4 border rounded-xl transition-all cursor-pointer group hover:scale-[1.01] shadow-sm ${
                        sub.status === "Accepted" 
                          ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/10" 
                          : "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-500/10"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${
                            sub.status === "Accepted" ? "text-emerald-400" : "text-rose-400"
                          }`}>
                            {sub.status === "Accepted" ? "✓ Accepted" : `✕ ${sub.status}`}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary font-mono font-semibold uppercase text-muted-foreground">
                            {sub.language}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">{sub.time}</span>
                      </div>

                      {/* Code preview snippet */}
                      {sub.code && (
                        <div className="my-2 p-2 rounded-lg bg-black/40 border border-border/40 font-mono text-[11px] text-muted-foreground truncate group-hover:text-foreground/90 transition-colors">
                          {sub.code.trim().split('\n')[0] || "// Code solution"}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono pt-1">
                        <div className="flex gap-4">
                          <span>Passed: <strong className="text-foreground">{sub.passedCases}</strong></span>
                          <span>Runtime: <strong className="text-foreground">{sub.runtime}</strong></span>
                          <span>Memory: <strong className="text-foreground">{sub.memory}</strong></span>
                        </div>
                        <span className="text-primary font-semibold text-xs group-hover:underline flex items-center gap-1">
                          View Code &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel: Monaco Editor & Resizable Judge Console */}
        <div className="w-1/2 flex flex-col">
          {/* Editor Container with Dynamic Height */}
          <div className={`border-b relative transition-all duration-300 flex flex-col ${
            consoleView === "expanded" 
              ? "h-40 shrink-0" 
              : consoleView === "minimized" 
              ? "flex-1" 
              : "flex-[3]"
          }`}>
            {/* Real IDE Error Diagnostic Strip */}
            {runResult && runResult.status !== "Accepted" && (
              <div className="bg-rose-950/80 border-b border-rose-500/40 px-3.5 py-2 flex items-center justify-between text-xs text-rose-300 font-mono shrink-0 shadow-inner z-10 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span className="font-extrabold px-2 py-0.5 rounded bg-rose-500/25 text-rose-300 border border-rose-500/40 text-[11px] shrink-0 uppercase tracking-wide flex items-center gap-1.5 shadow-sm">
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                    ✕ {runResult.status}
                  </span>
                  <span className="truncate text-rose-100 font-semibold text-[11px]">
                    {runResult.testResults[runResult.failedTestCaseIndex]?.error || runResult.errorDetails?.split("\n")[0] || "Code evaluation failed"}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {runResult.errorLine && (
                    <button
                      onClick={() => {
                        if (editorRef.current && runResult.errorLine) {
                          editorRef.current.revealLineInCenter(runResult.errorLine);
                          editorRef.current.setPosition({ lineNumber: runResult.errorLine, column: 1 });
                          editorRef.current.focus();
                        }
                      }}
                      className="px-2 py-0.5 rounded bg-rose-500/30 hover:bg-rose-500/40 text-rose-100 font-bold text-[11px] border border-rose-500/40 transition-colors shadow-sm"
                      title="Jump to error line in editor"
                    >
                      Line {runResult.errorLine}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setConsoleTab("test-result");
                      if (consoleView === "minimized") setConsoleView("normal");
                    }}
                    className="px-2.5 py-0.5 rounded bg-secondary hover:bg-secondary/80 text-foreground font-bold text-[11px] transition-colors"
                  >
                    View Diff &rarr;
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 relative overflow-hidden">
              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language}
                theme="vs-dark"
                value={code}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  monacoRef.current = monaco;
                }}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineHeight: 22,
                  padding: { top: 16, bottom: 16 },
                  fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Judge Console with Expand/Collapse & No-Clipping Layout */}
          <div className={`flex flex-col bg-card overflow-hidden transition-all duration-300 ${
            consoleView === "expanded" 
              ? "flex-1" 
              : consoleView === "minimized" 
              ? "h-11 shrink-0" 
              : "flex-[3] min-h-[300px]"
          }`}>
            <Tabs value={consoleTab} onValueChange={setConsoleTab} className="flex-1 flex flex-col">
              {/* Console Navigation Header */}
              <div className="h-11 border-b flex items-center justify-between px-4 bg-muted/20 shrink-0">
                <TabsList className="bg-transparent h-full">
                  <TabsTrigger 
                    value="testcases" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full text-xs font-semibold"
                  >
                    Testcases
                  </TabsTrigger>
                  <TabsTrigger 
                    value="test-result" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full text-xs font-semibold"
                  >
                    Test Result {runResult && `(${runResult.status})`}
                  </TabsTrigger>
                </TabsList>

                {/* Right controls: Feedback pill & Height toggle */}
                <div className="flex items-center gap-3">
                  {submitFeedback && (
                    <span className={`text-xs font-bold ${submitFeedback.isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {submitFeedback.status}
                    </span>
                  )}

                  <div className="flex items-center border rounded-lg bg-secondary/50 overflow-hidden text-xs">
                    <button
                      onClick={() => setConsoleView(consoleView === "expanded" ? "normal" : "expanded")}
                      className={`px-2 py-1 transition-colors hover:bg-secondary font-semibold flex items-center gap-1 ${
                        consoleView === "expanded" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                      title={consoleView === "expanded" ? "Restore normal size" : "Expand console view"}
                    >
                      {consoleView === "expanded" ? "▼ Normal" : "▲ Expand"}
                    </button>
                    <button
                      onClick={() => setConsoleView(consoleView === "minimized" ? "normal" : "minimized")}
                      className={`px-2 py-1 transition-colors hover:bg-secondary text-muted-foreground ${
                        consoleView === "minimized" ? "bg-secondary text-foreground font-bold" : ""
                      }`}
                      title={consoleView === "minimized" ? "Restore console" : "Minimize console"}
                    >
                      {consoleView === "minimized" ? "▲ Show" : "—"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab 1: Testcases Config */}
              <TabsContent value="testcases" className="flex-1 overflow-y-auto p-4 pb-12 m-0 space-y-4">
                <div className="flex items-center gap-2">
                  {question.publicTestCases.map((_, idx) => (
                    <Button 
                      key={idx} 
                      size="sm" 
                      variant={activeTestCase === idx ? "secondary" : "ghost"}
                      onClick={() => setActiveTestCase(idx)}
                      className="h-7 text-xs font-mono font-semibold"
                    >
                      Case {idx + 1}
                    </Button>
                  ))}
                </div>

                {activePublicCase && (
                  <div className="space-y-4 font-mono text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Input Parameters
                      </label>
                      <div className="mt-1 p-3.5 rounded-xl bg-secondary/40 border border-border/60 text-foreground whitespace-pre-wrap break-all shadow-inner leading-relaxed">
                        {activePublicCase.input}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Expected Output
                      </label>
                      <div className="mt-1 p-3.5 rounded-xl bg-secondary/40 border border-border/60 text-foreground font-bold whitespace-pre-wrap break-all shadow-inner leading-relaxed">
                        {activePublicCase.output}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: Test Result (No-Clipping, Fully Scrollable Output) */}
              <TabsContent value="test-result" className="flex-1 overflow-y-auto p-4 pb-16 m-0 space-y-4">
                {!hasRun && !isRunning ? (
                  <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-muted-foreground text-xs space-y-2 py-8">
                    <span>Click "Run Code" to evaluate your solution against test cases.</span>
                  </div>
                ) : isRunning ? (
                  <div className="h-full min-h-[180px] flex items-center justify-center gap-3 text-muted-foreground text-xs py-8">
                    <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span>Executing and evaluating test cases...</span>
                  </div>
                ) : runResult ? (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    {/* Header Verdict Banner */}
                    <div className="flex flex-wrap items-center justify-between p-3.5 rounded-xl bg-secondary/40 border border-border/80 gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-xl font-extrabold ${runResult.statusColor}`}>
                          {runResult.status === "Accepted" ? "✓ Accepted" : `✕ ${runResult.status}`}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          ({runResult.passedTestCases}/{runResult.totalTestCases} cases passed)
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                        <span>Runtime: <strong className="text-foreground">{runResult.runtime}</strong></span>
                        <span>Memory: <strong className="text-foreground">{runResult.memory}</strong></span>
                      </div>
                    </div>

                    {/* Submission Alert Message */}
                    {submitFeedback && (
                      <div className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                        submitFeedback.isSuccess 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                        <span>{submitFeedback.isSuccess ? '🎉' : '⚠️'}</span>
                        <span>{submitFeedback.message}</span>
                      </div>
                    )}

                    {/* Real IDE Diagnostic Error Box */}
                    {runResult.status !== "Accepted" && (
                      <div className="rounded-xl border border-rose-500/40 bg-[#160b0e] overflow-hidden shadow-lg animate-in fade-in duration-200">
                        <div className="bg-rose-500/15 border-b border-rose-500/30 px-4 py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
                            <span className="font-bold text-xs uppercase tracking-wider text-rose-300">
                              {runResult.errorType || (runResult.status === "Wrong Answer" ? "AssertionError [ERR_ASSERTION]" : runResult.status)}
                            </span>
                            {runResult.errorLine && (
                              <button
                                onClick={() => {
                                  if (editorRef.current && runResult.errorLine) {
                                    editorRef.current.revealLineInCenter(runResult.errorLine);
                                    editorRef.current.setPosition({ lineNumber: runResult.errorLine, column: 1 });
                                    editorRef.current.focus();
                                  }
                                }}
                                className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/25 text-rose-200 border border-rose-500/40 hover:bg-rose-500/40 transition-colors"
                              >
                                Line {runResult.errorLine} ↗
                              </button>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-rose-400/80">
                            Failed on Case {runResult.failedTestCaseIndex + 1} of {runResult.totalTestCases}
                          </span>
                        </div>
                        <div className="p-4 space-y-2 text-xs font-mono text-rose-200 whitespace-pre-wrap leading-relaxed break-all">
                          {runResult.errorDetails || runResult.testResults[runResult.failedTestCaseIndex]?.error || "Code evaluation failed. Review test cases below."}
                        </div>
                      </div>
                    )}

                    {/* Testcase Pills */}
                    {runResult.testResults.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {runResult.testResults.map((r, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveTestCase(idx)}
                              className={`h-7 px-3 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                                activeTestCase === idx 
                                  ? 'bg-secondary text-foreground ring-1 ring-primary' 
                                  : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <span className={`h-2 w-2 rounded-full ${r.passed ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                              Case {idx + 1}
                            </button>
                          ))}
                        </div>

                        {/* Selected Test Case Inspection (Full View, No Clipping) */}
                        {currentResultCase && (
                          <div className="space-y-3 font-mono text-xs">
                            {/* Input Block */}
                            <div>
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Input</label>
                                <button 
                                   onClick={() => handleCopyCode(currentResultCase.input)}
                                   className="text-[10px] text-muted-foreground hover:text-foreground"
                                >
                                  Copy
                                </button>
                              </div>
                              <div className="mt-1 p-3 rounded-xl bg-secondary/40 border border-border/60 text-foreground whitespace-pre-wrap break-all leading-relaxed shadow-inner">
                                {currentResultCase.input}
                              </div>
                            </div>

                            {/* Actual vs Expected Output Blocks */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                    Your Output
                                  </label>
                                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${currentResultCase.passed ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
                                    {currentResultCase.passed ? 'Passed ✓' : 'Failed ✕'}
                                  </span>
                                </div>
                                <div className={`mt-1.5 p-3 rounded-xl border whitespace-pre-wrap break-all font-bold min-h-[52px] shadow-inner leading-relaxed ${
                                  currentResultCase.passed 
                                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                }`}>
                                  {currentResultCase.actualOutput || (currentResultCase.error?.includes("undefined") ? "undefined (no return value)" : currentResultCase.error ? "Execution Failed" : "undefined")}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                    Expected Output
                                  </label>
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                    Target ✓
                                  </span>
                                </div>
                                <div className="mt-1.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-300 font-bold whitespace-pre-wrap break-all min-h-[52px] shadow-inner leading-relaxed">
                                  {currentResultCase.expectedOutput}
                                </div>
                              </div>
                            </div>

                            {/* Failure Diagnosis & Mismatch Diff */}
                            {!currentResultCase.passed && (currentResultCase.diffExplanation || currentResultCase.error) && (
                              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs space-y-1.5 shadow-sm">
                                <div className="font-bold flex items-center gap-1.5 text-rose-400 text-[11px] uppercase tracking-wider">
                                  <span>🔍</span> Diagnostic Explanation:
                                </div>
                                <p className="whitespace-pre-wrap leading-relaxed text-rose-200">
                                  {currentResultCase.diffExplanation || currentResultCase.error}
                                </p>
                              </div>
                            )}

                            {/* Stdout / Console output */}
                            {currentResultCase.stdout && (
                              <div>
                                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                  Standard Output (console.log / print)
                                </label>
                                <div className="mt-1 p-3 rounded-xl bg-secondary/30 border border-border/50 text-muted-foreground whitespace-pre-wrap break-all shadow-inner leading-relaxed">
                                  {currentResultCase.stdout}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
