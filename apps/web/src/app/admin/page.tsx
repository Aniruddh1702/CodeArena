"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Label, Tabs, TabsList, TabsTrigger, TabsContent } from "@codearena/ui";
import {
  getAllProblems,
  getCustomProblems,
  saveCustomProblem,
  deleteCustomProblem,
  ProblemDefinition,
  TestCase,
} from "@/lib/problems-data";
import { getActiveAccount, getAllAccounts } from "@/lib/auth-session";

const AVAILABLE_TOPICS = [
  "Arrays",
  "Strings",
  "Dynamic Programming",
  "Graphs",
  "Binary Search",
  "Linked List",
  "Trees",
  "Stack",
  "Hash Table",
  "Math",
  "Greedy",
  "Two Pointers",
  "Backtracking",
  "Sliding Window",
  "Bit Manipulation",
  "Recursion",
];

const DEFAULT_SAMPLE_JSON = [
  {
    "title": "Palindrome Number",
    "slug": "palindrome-number",
    "difficulty": "EASY",
    "topics": [{ "name": "Math" }, { "name": "Two Pointers" }],
    "description": "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.\n\nFor example, `121` is a palindrome while `123` is not.",
    "constraints": ["-2^31 <= x <= 2^31 - 1"],
    "methodName": "isPalindrome",
    "supportedLanguages": ["javascript", "python", "cpp", "java"],
    "starterCode": {
      "javascript": "/**\n * @param {number} x\n * @return {boolean}\n */\nvar isPalindrome = function(x) {\n    \n};",
      "python": "class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        pass",
      "cpp": "class Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};",
      "java": "class Solution {\n    public boolean isPalindrome(int x) {\n        \n    }\n}"
    },
    "publicTestCases": [
      {
        "input": "x = 121",
        "output": "true",
        "args": [121],
        "expected": true
      },
      {
        "input": "x = -121",
        "output": "false",
        "args": [-121],
        "expected": false
      },
      {
        "input": "x = 10",
        "output": "false",
        "args": [10],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "x = 0",
        "output": "true",
        "args": [0],
        "expected": true
      }
    ]
  }
];

export default function AdminPortalPage() {
  const router = useRouter();

  // Authentication & Gate State
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState("questions");

  // Questions State
  const [allQuestions, setAllQuestions] = useState<ProblemDefinition[]>([]);
  const [customSlugs, setCustomSlugs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Form State for Manual Creation / Editing
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    difficulty: "EASY" as "EASY" | "MEDIUM" | "HARD",
    topics: ["Arrays"],
    customTopicInput: "",
    methodName: "",
    description: "",
    constraintsText: "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
    codeJs: "",
    codePy: "",
    codeCpp: "",
    codeJava: "",
  });

  const [testCases, setTestCases] = useState<
    Array<{ input: string; output: string; argsStr: string; expectedStr: string; isPublic: boolean }>
  >([
    { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", argsStr: "[[2, 7, 11, 15], 9]", expectedStr: "[0, 1]", isPublic: true },
    { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", argsStr: "[[3, 2, 4], 6]", expectedStr: "[1, 2]", isPublic: true },
  ]);

  const [formFeedback, setFormFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // File Drop & Import State
  const [isDragging, setIsDragging] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [parsedImportItems, setParsedImportItems] = useState<any[]>([]);
  const [importFeedback, setImportFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check auth session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdmin = localStorage.getItem("codearena_admin_authorized");
      const activeAccount = getActiveAccount();
      if (storedAdmin === "true" || activeAccount?.role === "SUPER_ADMIN") {
        setIsAuthorized(true);
      }
      loadQuestions();
    }
  }, []);

  const loadQuestions = () => {
    const list = getAllProblems();
    const custom = getCustomProblems();
    setAllQuestions(list);
    setCustomSlugs(new Set(Object.keys(custom)));
  };

  const handleVerifyPasscode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVerifying(true);
    setPasscodeError("");

    try {
      const activeAccount = getActiveAccount();
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim(), userId: activeAccount?.id }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Invalid Admin Passcode.");
      }

      setIsAuthorized(true);
      localStorage.setItem("codearena_admin_authorized", "true");
      loadQuestions();
    } catch (err: any) {
      setPasscodeError(err.message || "Failed to verify admin passcode.");
    } finally {
      setVerifying(false);
    }
  };

  const handleLockAdmin = () => {
    localStorage.removeItem("codearena_admin_authorized");
    document.cookie = "codearena_admin_auth=; path=/; max-age=0";
    setIsAuthorized(false);
  };

  // Helper to auto-generate method name and starter templates
  const autoGenerateTemplates = (title: string, rawMethodName?: string) => {
    const method = rawMethodName || title.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+(.)/g, (_, c) => c.toUpperCase()) || "solve";
    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "custom-problem";

    const codeJs = `/**\n * @param {any} input\n * @return {any}\n */\nvar ${method} = function(...args) {\n    // Implement your algorithmic solution\n    \n};`;
    const codePy = `class Solution:\n    def ${method}(self, *args):\n        # Implement your solution here\n        pass`;
    const codeCpp = `class Solution {\npublic:\n    auto ${method}(auto... args) {\n        // Your solution\n    }\n};`;
    const codeJava = `class Solution {\n    public Object ${method}(Object... args) {\n        // Your solution\n        return null;\n    }\n}`;

    return { method, slug, codeJs, codePy, codeCpp, codeJava };
  };

  // Handle Title change in Question Creator
  const handleTitleChange = (val: string) => {
    const generated = autoGenerateTemplates(val, formData.methodName);
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === "" || prev.slug === autoGenerateTemplates(prev.title).slug ? generated.slug : prev.slug,
      methodName: prev.methodName === "" ? generated.method : prev.methodName,
      codeJs: prev.codeJs === "" ? generated.codeJs : prev.codeJs,
      codePy: prev.codePy === "" ? generated.codePy : prev.codePy,
      codeCpp: prev.codeCpp === "" ? generated.codeCpp : prev.codeCpp,
      codeJava: prev.codeJava === "" ? generated.codeJava : prev.codeJava,
    }));
  };

  // Populate form for editing existing question
  const handleEditQuestion = (p: ProblemDefinition) => {
    setEditingSlug(p.slug);
    setFormData({
      title: p.title,
      slug: p.slug,
      difficulty: p.difficulty,
      topics: p.topics.map((t) => t.name),
      customTopicInput: "",
      methodName: p.methodName || "solution",
      description: p.description,
      constraintsText: p.constraints?.join("\n") || "",
      codeJs: p.starterCode.javascript,
      codePy: p.starterCode.python,
      codeCpp: p.starterCode.cpp,
      codeJava: p.starterCode.java,
    });

    const cases = [
      ...p.publicTestCases.map((tc) => ({
        input: tc.input,
        output: tc.output,
        argsStr: JSON.stringify(tc.args),
        expectedStr: JSON.stringify(tc.expected),
        isPublic: true,
      })),
      ...p.hiddenTestCases.map((tc) => ({
        input: tc.input,
        output: tc.output,
        argsStr: JSON.stringify(tc.args),
        expectedStr: JSON.stringify(tc.expected),
        isPublic: false,
      })),
    ];
    setTestCases(cases.length > 0 ? cases : [{ input: "", output: "", argsStr: "[]", expectedStr: "null", isPublic: true }]);
    setActiveTab("create");
    setFormFeedback(null);
  };

  // Reset form
  const handleResetForm = () => {
    setEditingSlug(null);
    setFormData({
      title: "",
      slug: "",
      difficulty: "EASY",
      topics: ["Arrays"],
      customTopicInput: "",
      methodName: "",
      description: "",
      constraintsText: "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
      codeJs: "",
      codePy: "",
      codeCpp: "",
      codeJava: "",
    });
    setTestCases([
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", argsStr: "[[2, 7, 11, 15], 9]", expectedStr: "[0, 1]", isPublic: true },
    ]);
    setFormFeedback(null);
  };

  // Add / Remove Topic
  const toggleTopic = (topic: string) => {
    setFormData((prev) => {
      const exists = prev.topics.includes(topic);
      const updated = exists ? prev.topics.filter((t) => t !== topic) : [...prev.topics, topic];
      return { ...prev, topics: updated.length > 0 ? updated : ["Algorithms"] };
    });
  };

  const handleAddCustomTopic = () => {
    if (!formData.customTopicInput.trim()) return;
    const topic = formData.customTopicInput.trim();
    if (!formData.topics.includes(topic)) {
      setFormData((prev) => ({
        ...prev,
        topics: [...prev.topics, topic],
        customTopicInput: "",
      }));
    }
  };

  // Save Question
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (!formData.title.trim()) {
      setFormFeedback({ type: "error", message: "Problem title is required." });
      return;
    }

    const cleanSlug = formData.slug.trim() || formData.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const cleanMethod = formData.methodName.trim() || "solution";

    // Validate and parse test cases
    const parsedPublicCases: TestCase[] = [];
    const parsedHiddenCases: TestCase[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      let parsedArgs: any[] = [];
      let parsedExpected: any = null;

      try {
        parsedArgs = JSON.parse(tc.argsStr);
        if (!Array.isArray(parsedArgs)) parsedArgs = [parsedArgs];
      } catch (err) {
        setFormFeedback({ type: "error", message: `Test Case #${i + 1}: Invalid Arguments JSON format.` });
        return;
      }

      try {
        parsedExpected = JSON.parse(tc.expectedStr);
      } catch (err) {
        // Fallback to raw string if valid JSON primitive
        parsedExpected = tc.expectedStr;
      }

      const caseObj: TestCase = {
        input: tc.input || `Test Case ${i + 1}`,
        output: tc.output || String(tc.expectedStr),
        args: parsedArgs,
        expected: parsedExpected,
      };

      if (tc.isPublic) {
        parsedPublicCases.push(caseObj);
      } else {
        parsedHiddenCases.push(caseObj);
      }
    }

    if (parsedPublicCases.length === 0 && parsedHiddenCases.length === 0) {
      setFormFeedback({ type: "error", message: "Please provide at least one test case." });
      return;
    }

    const templates = autoGenerateTemplates(formData.title, cleanMethod);

    const problemToSave: ProblemDefinition = {
      id: `custom_${Date.now()}`,
      slug: cleanSlug,
      title: formData.title.trim(),
      difficulty: formData.difficulty,
      topics: formData.topics.map((t) => ({ name: t })),
      description: formData.description.trim() || `Solve the ${formData.title} challenge. Read constraints carefully.`,
      constraints: formData.constraintsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      methodName: cleanMethod,
      supportedLanguages: ["javascript", "python", "cpp", "java"],
      starterCode: {
        javascript: formData.codeJs.trim() || templates.codeJs,
        python: formData.codePy.trim() || templates.codePy,
        cpp: formData.codeCpp.trim() || templates.codeCpp,
        java: formData.codeJava.trim() || templates.codeJava,
      },
      publicTestCases: parsedPublicCases,
      hiddenTestCases: parsedHiddenCases,
    };

    // 1. Save to local repository
    saveCustomProblem(problemToSave);

    // 2. Sync to Backend API
    try {
      await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(problemToSave),
      });
    } catch (e) {
      console.warn("Backend sync optional:", e);
    }

    loadQuestions();
    setFormFeedback({
      type: "success",
      message: `Question "${problemToSave.title}" saved successfully! It is now live in the practice bank and IDE.`,
    });

    if (!editingSlug) {
      handleResetForm();
    }
  };

  // Delete Question
  const handleDelete = (slug: string) => {
    if (confirm(`Are you sure you want to delete question "${slug}"?`)) {
      deleteCustomProblem(slug);
      loadQuestions();
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const questions = getAllProblems();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `codearena_questions_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Download Sample Template
  const handleDownloadTemplate = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(DEFAULT_SAMPLE_JSON, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "codearena_sample_question_template.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Parse File Drop / Import Text
  const parseAndValidateJson = (content: string) => {
    setImportFeedback(null);
    try {
      const parsed = JSON.parse(content);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      const validated = items.map((q: any, i: number) => {
        const title = q.title || `Imported Question ${i + 1}`;
        const slug = q.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const method = q.methodName || autoGenerateTemplates(title).method;
        const diff = (["EASY", "MEDIUM", "HARD"].includes(q.difficulty?.toUpperCase()) ? q.difficulty.toUpperCase() : "MEDIUM") as any;

        const publicCases = (q.publicTestCases || q.testCases || []).map((tc: any, tcIdx: number) => ({
          input: tc.input || `Test ${tcIdx + 1}`,
          output: String(tc.output ?? tc.expected ?? ""),
          args: Array.isArray(tc.args) ? tc.args : [tc.input],
          expected: tc.expected !== undefined ? tc.expected : tc.output,
        }));

        const hiddenCases = (q.hiddenTestCases || []).map((tc: any, tcIdx: number) => ({
          input: tc.input || `Hidden ${tcIdx + 1}`,
          output: String(tc.output ?? tc.expected ?? ""),
          args: Array.isArray(tc.args) ? tc.args : [tc.input],
          expected: tc.expected !== undefined ? tc.expected : tc.output,
        }));

        const templates = autoGenerateTemplates(title, method);

        const problemDef: ProblemDefinition = {
          id: q.id || `custom_${Date.now()}_${i}`,
          slug,
          title,
          difficulty: diff,
          topics: Array.isArray(q.topics)
            ? q.topics.map((t: any) => ({ name: typeof t === "string" ? t : t.name || "Algorithms" }))
            : [{ name: "Algorithms" }],
          description: q.description || `Solve ${title}.`,
          constraints: Array.isArray(q.constraints) ? q.constraints : ["1 <= n <= 10^5"],
          methodName: method,
          supportedLanguages: ["javascript", "python", "cpp", "java"],
          starterCode: {
            javascript: q.starterCode?.javascript || templates.codeJs,
            python: q.starterCode?.python || templates.codePy,
            cpp: q.starterCode?.cpp || templates.codeCpp,
            java: q.starterCode?.java || templates.codeJava,
          },
          publicTestCases: publicCases.length > 0 ? publicCases : [
            { input: "example input", output: "example output", args: ["example input"], expected: "example output" }
          ],
          hiddenTestCases: hiddenCases,
        };

        return problemDef;
      });

      setParsedImportItems(validated);
      setImportFeedback({
        type: "success",
        message: `Successfully parsed ${validated.length} question(s). Review below and click "Import All Questions" to publish.`,
      });
    } catch (err: any) {
      setImportFeedback({ type: "error", message: `Invalid JSON format: ${err.message}` });
      setParsedImportItems([]);
    }
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = String(event.target?.result || "");
        setImportJsonText(text);
        parseAndValidateJson(text);
      };
      reader.readAsText(file);
    }
  };

  // Handle File Input Change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = String(event.target?.result || "");
        setImportJsonText(text);
        parseAndValidateJson(text);
      };
      reader.readAsText(file);
    }
  };

  // Execute Bulk Import
  const handleExecuteImport = async () => {
    if (parsedImportItems.length === 0) return;

    for (const item of parsedImportItems) {
      saveCustomProblem(item);
    }

    try {
      await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedImportItems),
      });
    } catch (e) {}

    loadQuestions();
    setImportFeedback({
      type: "success",
      message: `🎉 Successfully imported and published ${parsedImportItems.length} question(s) to the platform!`,
    });
    setParsedImportItems([]);
    setImportJsonText("");
  };

  // Filtered Questions List
  const filteredQuestions = allQuestions.filter((q) => {
    const isCustom = customSlugs.has(q.slug);
    if (typeFilter === "CUSTOM" && !isCustom) return false;
    if (typeFilter === "BUILT_IN" && isCustom) return false;
    if (difficultyFilter !== "ALL" && q.difficulty !== difficultyFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchSlug = q.slug.toLowerCase().includes(query);
      const matchTopic = q.topics.some((t) => t.name.toLowerCase().includes(query));
      if (!matchTitle && !matchSlug && !matchTopic) return false;
    }
    return true;
  });

  // Locked Gate View for Unauthorized Users
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 selection:bg-primary/30">
        <Card className="w-full max-w-md shadow-2xl border-destructive/40 bg-card/90 backdrop-blur-xl">
          <CardHeader className="space-y-2 text-center pb-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-destructive/15 border border-destructive/30 flex items-center justify-center text-3xl shadow-inner">
              🔐
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-foreground">
              CodeArena Admin Portal
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Restricted access. Only verified platform administrators can access Question Management & System Controls.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleVerifyPasscode} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="passcode" className="text-xs font-bold text-foreground">
                  Master Admin Passcode
                </Label>
                <Input
                  id="passcode"
                  type="password"
                  placeholder="Enter administrator passcode..."
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (passcodeError) setPasscodeError("");
                  }}
                  required
                  className="h-10 text-xs font-mono"
                />
              </div>

              {passcodeError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{passcodeError}</span>
                </div>
              )}

              <Button type="submit" className="w-full h-10 text-xs font-bold bg-primary hover:bg-primary/90" disabled={verifying}>
                {verifying ? "Verifying..." : "Unlock Admin Access"}
              </Button>
            </form>

            <div className="pt-2 border-t border-border/50 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPasscode("codearena-admin-2026");
                }}
                className="text-[11px] text-muted-foreground hover:text-foreground h-8"
              >
                Insert Default Passcode (codearena-admin-2026)
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="text-xs text-muted-foreground hover:text-primary h-8"
              >
                &larr; Return to Student Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Full Admin Portal
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl border-border/80 shadow-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-extrabold text-xl tracking-tight text-foreground flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-destructive to-purple-600 flex items-center justify-center text-primary-foreground font-black text-sm shadow-md">
                🛡️
              </div>
              Code<span className="text-primary">Arena</span> <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/15 text-destructive font-mono font-bold border border-destructive/30">ADMIN</span>
            </Link>
          </div>

          <nav className="hidden md:flex gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("questions")}
              className={`transition-colors ${activeTab === "questions" ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground"}`}
            >
              Question Bank ({allQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`transition-colors ${activeTab === "create" ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground"}`}
            >
              Manual Creator
            </button>
            <button
              onClick={() => setActiveTab("import")}
              className={`transition-colors ${activeTab === "import" ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground"}`}
            >
              File Drop / Import
            </button>
            <button
              onClick={() => setActiveTab("system")}
              className={`transition-colors ${activeTab === "system" ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground"}`}
            >
              System Health
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/problems">
              <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                Practice Bank &rarr;
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-muted-foreground hover:text-foreground">
                Dashboard
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLockAdmin}
              className="h-8 text-xs font-bold shadow-sm"
              title="Lock Admin and require passcode again"
            >
              🔒 Lock
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 container mx-auto px-6 py-8 space-y-6 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 border-border/60">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Question Operations & Content Studio</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Add, edit, drop files, and manage algorithmic problems across the platform with immediate IDE synchronization.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={() => {
                  handleResetForm();
                  setActiveTab("create");
                }}
                className="h-8 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
              >
                <span>➕</span> Create Question
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("import")}
                className="h-8 text-xs font-semibold gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
              >
                <span>📁</span> Drop / Import File
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportJson}
                className="h-8 text-xs font-semibold gap-1.5"
                title="Download complete JSON backup of all problems"
              >
                <span>📥</span> Export JSON
              </Button>
            </div>
          </div>

          {/* TAB 1: QUESTION BANK LIST */}
          <TabsContent value="questions" className="space-y-4 m-0 focus-visible:outline-none">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between p-4 rounded-xl bg-card border border-border/80 shadow-sm">
              <div className="w-full md:w-80">
                <Input
                  placeholder="Search by title, slug, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-muted-foreground font-semibold">Filter:</span>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="h-9 text-xs rounded-md bg-secondary px-3 py-1 border border-border font-medium"
                >
                  <option value="ALL">All Difficulties</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="h-9 text-xs rounded-md bg-secondary px-3 py-1 border border-border font-medium"
                >
                  <option value="ALL">All Sources</option>
                  <option value="CUSTOM">Custom Admin Only ({customSlugs.size})</option>
                  <option value="BUILT_IN">Built-in Only ({allQuestions.length - customSlugs.size})</option>
                </select>
              </div>
            </div>

            {/* Questions Table */}
            <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/60 text-muted-foreground uppercase tracking-wider font-mono text-[10px] border-b border-border">
                    <tr>
                      <th className="py-3 px-4">Title & Slug</th>
                      <th className="py-3 px-4">Difficulty</th>
                      <th className="py-3 px-4">Topics</th>
                      <th className="py-3 px-4">Method Name</th>
                      <th className="py-3 px-4">Test Cases</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                          No questions matched your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredQuestions.map((q) => {
                        const isCustom = customSlugs.has(q.slug);
                        const totalCases = (q.publicTestCases?.length || 0) + (q.hiddenTestCases?.length || 0);

                        return (
                          <tr key={q.slug} className="hover:bg-secondary/30 transition-colors">
                            <td className="py-3.5 px-4 font-semibold">
                              <div className="text-foreground text-xs font-bold">{q.title}</div>
                              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{q.slug}</div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  q.difficulty === "EASY"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    : q.difficulty === "MEDIUM"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                }`}
                              >
                                {q.difficulty}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {q.topics?.slice(0, 3).map((t, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 rounded bg-secondary text-[10px] text-foreground font-medium">
                                    {t.name}
                                  </span>
                                ))}
                                {q.topics && q.topics.length > 3 && (
                                  <span className="text-[10px] text-muted-foreground font-mono">+{q.topics.length - 3}</span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-[11px] text-primary">
                              {q.methodName || "solution"}()
                            </td>

                            <td className="py-3.5 px-4 font-mono text-xs">
                              {totalCases} cases ({q.publicTestCases?.length || 0} pub / {q.hiddenTestCases?.length || 0} hid)
                            </td>

                            <td className="py-3.5 px-4">
                              {isCustom ? (
                                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold border border-primary/30">
                                  Custom Admin
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-medium border border-border">
                                  Built-in
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditQuestion(q)}
                                  className="h-7 px-2.5 text-[11px]"
                                >
                                  Edit
                                </Button>

                                <Link href={`/problems/${q.slug}`} target="_blank">
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px] text-primary hover:text-primary">
                                    ▶ IDE
                                  </Button>
                                </Link>

                                {isCustom && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDelete(q.slug)}
                                    className="h-7 px-2 text-[11px] text-destructive hover:bg-destructive/10"
                                  >
                                    ✕
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: MANUAL QUESTION CREATOR / EDITOR */}
          <TabsContent value="create" className="space-y-6 m-0 focus-visible:outline-none">
            <Card className="shadow-lg border-border/80 bg-card">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-xl">
                    {editingSlug ? `Editing Question: ${formData.title}` : "Create & Publish New Question"}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Configure question parameters, test cases, and starter code. Saved questions will be immediately available in the IDE.
                  </CardDescription>
                </div>
                {editingSlug && (
                  <Button variant="outline" size="sm" onClick={handleResetForm} className="text-xs h-8">
                    Cancel Edit (Create New)
                  </Button>
                )}
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSaveQuestion} className="space-y-6">
                  {/* Basic Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="title" className="text-xs font-bold">Problem Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g. Valid Palindrome"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="slug" className="text-xs font-bold">Problem Slug (URL identifier) *</Label>
                      <Input
                        id="slug"
                        placeholder="e.g. valid-palindrome"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                        className="h-9 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="difficulty" className="text-xs font-bold">Difficulty</Label>
                      <select
                        id="difficulty"
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                        className="w-full h-9 text-xs rounded-md bg-secondary px-3 py-1 border border-border font-medium"
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Method Name & Topics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="methodName" className="text-xs font-bold">
                        Target Method Name *
                      </Label>
                      <Input
                        id="methodName"
                        placeholder="e.g. isPalindrome"
                        value={formData.methodName}
                        onChange={(e) => setFormData({ ...formData, methodName: e.target.value })}
                        required
                        className="h-9 text-xs font-mono"
                      />
                      <p className="text-[10px] text-muted-foreground">The function name called during test evaluation.</p>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <Label className="text-xs font-bold">Topics & Categories</Label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {AVAILABLE_TOPICS.map((topic) => {
                          const selected = formData.topics.includes(topic);
                          return (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => toggleTopic(topic)}
                              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                                selected
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "bg-secondary text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {selected ? "✓ " : ""}{topic}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          placeholder="Add custom topic..."
                          value={formData.customTopicInput}
                          onChange={(e) => setFormData({ ...formData, customTopicInput: e.target.value })}
                          className="h-8 text-xs max-w-xs"
                        />
                        <Button type="button" size="sm" variant="outline" onClick={handleAddCustomTopic} className="h-8 text-xs">
                          Add Topic
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Description & Constraints */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="description" className="text-xs font-bold">Problem Description (Markdown supported)</Label>
                      <textarea
                        id="description"
                        rows={6}
                        placeholder="Explain the problem statement, parameters, return format, and edge cases..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded-md bg-secondary/50 p-3 text-xs border border-border font-sans focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="constraints" className="text-xs font-bold">Constraints (1 per line)</Label>
                      <textarea
                        id="constraints"
                        rows={6}
                        placeholder="e.g.&#10;1 <= nums.length <= 10^5&#10;-10^9 <= nums[i] <= 10^9"
                        value={formData.constraintsText}
                        onChange={(e) => setFormData({ ...formData, constraintsText: e.target.value })}
                        className="w-full rounded-md bg-secondary/50 p-3 text-xs border border-border font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Test Cases Builder */}
                  <div className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border/80">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">Test Cases Builder ({testCases.length})</h3>
                        <p className="text-[11px] text-muted-foreground">Define inputs, JSON arguments, and expected outputs for automatic evaluation.</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTestCases([
                            ...testCases,
                            { input: "", output: "", argsStr: "[]", expectedStr: '""', isPublic: true },
                          ]);
                        }}
                        className="h-8 text-xs font-semibold gap-1"
                      >
                        <span>➕</span> Add Test Case
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {testCases.map((tc, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-card border border-border/70 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary font-mono">Case #{idx + 1}</span>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={tc.isPublic}
                                  onChange={(e) => {
                                    const updated = [...testCases];
                                    updated[idx].isPublic = e.target.checked;
                                    setTestCases(updated);
                                  }}
                                  className="rounded"
                                />
                                <span>Public Example</span>
                              </label>

                              {testCases.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTestCases(testCases.filter((_, i) => i !== idx));
                                  }}
                                  className="text-xs text-destructive hover:underline"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-[11px] text-muted-foreground">Display Input</Label>
                              <Input
                                placeholder='e.g. nums = [2,7,11,15], target = 9'
                                value={tc.input}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].input = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="h-8 text-xs font-mono"
                              />
                            </div>

                            <div>
                              <Label className="text-[11px] text-muted-foreground">Arguments JSON array [arg1, arg2, ...] *</Label>
                              <Input
                                placeholder='e.g. [[2,7,11,15], 9]'
                                value={tc.argsStr}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].argsStr = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="h-8 text-xs font-mono"
                              />
                            </div>

                            <div>
                              <Label className="text-[11px] text-muted-foreground">Display Output</Label>
                              <Input
                                placeholder='e.g. [0, 1]'
                                value={tc.output}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].output = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="h-8 text-xs font-mono"
                              />
                            </div>

                            <div>
                              <Label className="text-[11px] text-muted-foreground">Expected Return Value JSON *</Label>
                              <Input
                                placeholder='e.g. [0, 1] or true or 42'
                                value={tc.expectedStr}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].expectedStr = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="h-8 text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Starter Code Multi-Language Tabs */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold">Starter Code Templates</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const t = autoGenerateTemplates(formData.title, formData.methodName);
                          setFormData({
                            ...formData,
                            codeJs: t.codeJs,
                            codePy: t.codePy,
                            codeCpp: t.codeCpp,
                            codeJava: t.codeJava,
                          });
                        }}
                        className="h-7 text-[11px]"
                      >
                        🪄 Regenerate Templates
                      </Button>
                    </div>

                    <Tabs defaultValue="js" className="w-full">
                      <TabsList className="bg-secondary/60 h-8">
                        <TabsTrigger value="js" className="text-xs py-1">JavaScript</TabsTrigger>
                        <TabsTrigger value="py" className="text-xs py-1">Python 3</TabsTrigger>
                        <TabsTrigger value="cpp" className="text-xs py-1">C++</TabsTrigger>
                        <TabsTrigger value="java" className="text-xs py-1">Java</TabsTrigger>
                      </TabsList>

                      <TabsContent value="js" className="m-0 pt-2">
                        <textarea
                          rows={6}
                          value={formData.codeJs}
                          onChange={(e) => setFormData({ ...formData, codeJs: e.target.value })}
                          className="w-full rounded-md bg-secondary/80 p-3 text-xs font-mono border border-border focus:outline-none"
                        />
                      </TabsContent>

                      <TabsContent value="py" className="m-0 pt-2">
                        <textarea
                          rows={6}
                          value={formData.codePy}
                          onChange={(e) => setFormData({ ...formData, codePy: e.target.value })}
                          className="w-full rounded-md bg-secondary/80 p-3 text-xs font-mono border border-border focus:outline-none"
                        />
                      </TabsContent>

                      <TabsContent value="cpp" className="m-0 pt-2">
                        <textarea
                          rows={6}
                          value={formData.codeCpp}
                          onChange={(e) => setFormData({ ...formData, codeCpp: e.target.value })}
                          className="w-full rounded-md bg-secondary/80 p-3 text-xs font-mono border border-border focus:outline-none"
                        />
                      </TabsContent>

                      <TabsContent value="java" className="m-0 pt-2">
                        <textarea
                          rows={6}
                          value={formData.codeJava}
                          onChange={(e) => setFormData({ ...formData, codeJava: e.target.value })}
                          className="w-full rounded-md bg-secondary/80 p-3 text-xs font-mono border border-border focus:outline-none"
                        />
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Feedback Messages */}
                  {formFeedback && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                        formFeedback.type === "success"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      }`}
                    >
                      <span>{formFeedback.type === "success" ? "✓" : "⚠️"}</span>
                      <span>{formFeedback.message}</span>
                      {formFeedback.type === "success" && (
                        <Link href={`/problems/${formData.slug || autoGenerateTemplates(formData.title).slug}`} target="_blank" className="underline ml-auto font-bold">
                          Open in IDE &rarr;
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" className="h-10 px-8 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                      {editingSlug ? "Save Changes" : "Create & Publish Question"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleResetForm} className="h-10 text-xs">
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: DRAG & DROP FILE IMPORTER */}
          <TabsContent value="import" className="space-y-6 m-0 focus-visible:outline-none">
            <Card className="shadow-lg border-border/80 bg-card">
              <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Drag & Drop Question Importer</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Drop a JSON question file to bulk import questions with test cases into CodeArena.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="h-8 text-xs font-semibold gap-1.5">
                  <span>📥</span> Download JSON Template
                </Button>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-primary bg-primary/10 scale-[1.01]"
                      : "border-border hover:border-primary/50 hover:bg-secondary/40"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept=".json,.csv,.txt"
                    className="hidden"
                  />
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-3xl mb-3 shadow-inner">
                    📁
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    Drop your question file here, or <span className="text-primary underline">browse</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports JSON files containing single questions or arrays of questions.
                  </p>
                </div>

                {/* Direct JSON Textarea */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="jsonText" className="text-xs font-bold">Or Paste Raw JSON Directly</Label>
                    <button
                      type="button"
                      onClick={() => {
                        const sample = JSON.stringify(DEFAULT_SAMPLE_JSON, null, 2);
                        setImportJsonText(sample);
                        parseAndValidateJson(sample);
                      }}
                      className="text-[11px] text-primary hover:underline font-semibold"
                    >
                      Paste Sample Question
                    </button>
                  </div>
                  <textarea
                    id="jsonText"
                    rows={8}
                    placeholder="Paste JSON array or question object here..."
                    value={importJsonText}
                    onChange={(e) => {
                      setImportJsonText(e.target.value);
                      if (e.target.value.trim()) {
                        parseAndValidateJson(e.target.value);
                      } else {
                        setParsedImportItems([]);
                        setImportFeedback(null);
                      }
                    }}
                    className="w-full rounded-md bg-secondary/60 p-3 text-xs font-mono border border-border focus:outline-none"
                  />
                </div>

                {/* Feedback */}
                {importFeedback && (
                  <div
                    className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                      importFeedback.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    }`}
                  >
                    <span>{importFeedback.type === "success" ? "✓" : "⚠️"}</span>
                    <span>{importFeedback.message}</span>
                  </div>
                )}

                {/* Parsed Preview Table */}
                {parsedImportItems.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Ready to Import ({parsedImportItems.length} Question{parsedImportItems.length > 1 ? "s" : ""})
                      </h4>
                      <Button
                        onClick={handleExecuteImport}
                        className="h-9 px-6 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                      >
                        ✓ Import & Publish All ({parsedImportItems.length})
                      </Button>
                    </div>

                    <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-secondary/60 text-muted-foreground uppercase text-[10px] font-mono border-b border-border">
                          <tr>
                            <th className="py-2.5 px-3">Title</th>
                            <th className="py-2.5 px-3">Slug</th>
                            <th className="py-2.5 px-3">Difficulty</th>
                            <th className="py-2.5 px-3">Method Name</th>
                            <th className="py-2.5 px-3">Test Cases</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {parsedImportItems.map((item, i) => (
                            <tr key={i} className="hover:bg-secondary/30">
                              <td className="py-2.5 px-3 font-bold">{item.title}</td>
                              <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground">{item.slug}</td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary border border-border">
                                  {item.difficulty}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-primary">{item.methodName}()</td>
                              <td className="py-2.5 px-3 font-mono">
                                {(item.publicTestCases?.length || 0) + (item.hiddenTestCases?.length || 0)} cases
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: SYSTEM HEALTH & STATS */}
          <TabsContent value="system" className="space-y-6 m-0 focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card shadow-sm border-border/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Total Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-foreground">{allQuestions.length}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Available in practice bank</p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-sm border-border/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Custom Admin Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-primary">{customSlugs.size}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Created / imported by you</p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-sm border-border/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Built-in Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-foreground">{allQuestions.length - customSlugs.size}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Factory curated set</p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-sm border-border/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Connected Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-emerald-400">{getAllAccounts().length}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Logged in on this browser</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg border-border/80 bg-card">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg">Maintenance & Operations</CardTitle>
                <CardDescription className="text-xs">
                  Tools to manage local storage caches and platform data integrity.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/40 border border-border">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Export All Platform Data</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Download full JSON archive of all built-in and custom questions with complete test suites.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExportJson} className="h-8 text-xs shrink-0">
                    Export Backup (.json)
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/40 border border-border">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Reset Custom Questions</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Clear all custom questions created in admin and revert strictly to default factory questions.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete all custom questions? This action cannot be undone.")) {
                        localStorage.removeItem("customProblems");
                        loadQuestions();
                        alert("Custom questions reset to factory defaults.");
                      }
                    }}
                    className="h-8 text-xs shrink-0"
                  >
                    Reset to Factory
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
