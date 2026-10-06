"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Tabs, TabsList, TabsTrigger, TabsContent } from "@codearena/ui";

export default function ExamEnvironment({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  
  const starterCodes: Record<string, string> = {
      javascript: '/**\n * @param {ListNode[]} lists\n * @return {ListNode}\n */\nvar mergeKLists = function(lists) {\n    \n};',
      python: 'class Solution:\n    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:\n        ',
      cpp: 'class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        \n    }\n};',
      java: 'class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        \n    }\n}'
  };

  useEffect(() => {
      setCode(starterCodes[language]);
  }, [language]);

  useEffect(() => {
    // Basic Tab Proctoring
    const handleVisibilityChange = () => {
        if (document.hidden) {
            setWarnings(prev => {
                const newCount = prev + 1;
                alert(`Warning ${newCount}/3: Please do not leave the exam tab. Exceeding 3 warnings may lead to disqualification.`);
                return newCount;
            });
        }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Mock fetching exam data
    setTimeout(() => {
        setTest({
            id: params.id,
            title: "Data Structures Mid-term",
            duration: 120, // minutes
            questions: [
                { id: 'q1', title: 'Merge k Sorted Lists', description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.' }
            ]
        });
        setTimeLeft(120 * 60); // seconds
        setLoading(false);
    }, 1000);

    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [params.id]);

  useEffect(() => {
      if (!loading && timeLeft > 0) {
          const timer = setInterval(() => {
              setTimeLeft(prev => prev - 1);
          }, 1000);
          return () => clearInterval(timer);
      }
  }, [loading, timeLeft]);

  const formatTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const submitExam = () => {
      if(confirm("Are you sure you want to submit the exam? You cannot undo this action.")) {
          alert("Exam submitted successfully!");
          router.push('/assessments');
      }
  };

  if (loading) {
      return <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <div className="text-xl font-bold">Initializing Secure Environment...</div>
          <p className="text-muted-foreground text-sm">Please ensure you are in full-screen mode.</p>
      </div>;
  }

  if (warnings >= 3) {
      return (
          <div className="min-h-screen bg-background flex items-center justify-center p-4">
              <Card className="w-full max-w-md border-destructive">
                  <CardHeader>
                      <CardTitle className="text-destructive">Exam Terminated</CardTitle>
                      <CardDescription>You have exceeded the maximum number of tab-switch warnings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button className="w-full" variant="destructive" onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
                  </CardContent>
              </Card>
          </div>
      );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden selection:bg-none">
      {/* Strict Exam Navbar */}
      <header className="h-14 border-b flex items-center justify-between px-6 bg-destructive/5 shrink-0 border-destructive/20">
          <div className="font-bold text-lg flex items-center gap-4">
              <span className="text-destructive font-mono uppercase tracking-widest text-xs border border-destructive/30 px-2 py-1 rounded">Proctored Session</span>
              {test.title}
          </div>
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 font-mono text-lg font-bold text-primary mr-4">
                  <span>⏱️</span>
                  <span className={timeLeft < 300 ? 'text-destructive animate-pulse' : ''}>{formatTime(timeLeft)}</span>
              </div>
              <select 
                  className="bg-secondary text-secondary-foreground rounded-md text-sm px-3 py-1.5 border-none outline-none focus:ring-1 focus:ring-primary mr-2"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
              >
                  <option value="javascript">JAVASCRIPT</option>
                  <option value="python">PYTHON</option>
                  <option value="cpp">C++</option>
                  <option value="java">JAVA</option>
              </select>
              <Button variant="destructive" size="sm" onClick={submitExam}>Submit Exam</Button>
          </div>
      </header>

      {/* Main Workspace (Simplified for exam) */}
      <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Description */}
          <div className="w-1/3 border-r flex flex-col bg-card overflow-hidden p-6">
              <h2 className="text-xl font-bold mb-4">{test.questions[0].title}</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none flex-1 overflow-y-auto">
                  <p className="whitespace-pre-wrap">{test.questions[0].description}</p>
              </div>
          </div>

          {/* Right Panel: Editor */}
          <div className="w-2/3 flex flex-col relative">
              {/* Disable copy-paste overlay could be added here */}
              <Editor
                  height="100%"
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: 'JetBrains Mono, monospace',
                      contextmenu: false, // Disable right click in editor
                  }}
              />
          </div>
      </div>
    </div>
  );
}
