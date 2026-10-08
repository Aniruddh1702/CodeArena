"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { Button, Card, CardHeader, CardTitle, CardContent, Tabs, TabsList, TabsTrigger, TabsContent } from "@codearena/ui";
import { getActiveAccount } from "@/lib/auth-session";

export default function ActiveBattlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("// Implement your solution rapidly...\n\nfunction solve(nums) {\n\n}");
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [opponentProgress, setOpponentProgress] = useState(0); // tests passed
  const [myProgress, setMyProgress] = useState(0);

  useEffect(() => {
    const active = getActiveAccount();
    if (!active) {
      router.push(`/login?redirect=/battles/${params.id}`);
      return;
    }
    setTimeout(() => setLoading(false), 800);
  }, [params.id, router]);

  useEffect(() => {
      if (!loading && timeLeft > 0) {
          const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
          return () => clearInterval(timer);
      }
  }, [loading, timeLeft]);

  // Simulate opponent progress
  useEffect(() => {
      if (!loading) {
          const opTimer = setInterval(() => {
              setOpponentProgress(p => {
                  if (p >= 100) {
                      clearInterval(opTimer);
                      alert("Opponent has completed the challenge! You lose.");
                      router.push('/battles');
                      return p;
                  }
                  // Randomly advance opponent by 0 to 20%
                  return Math.min(100, p + Math.floor(Math.random() * 20));
              });
          }, 8000);
          return () => clearInterval(opTimer);
      }
  }, [loading, router]);

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRunCode = () => {
      setMyProgress(p => Math.min(100, p + 25));
      if (myProgress + 25 >= 100) {
          setTimeout(() => {
              if (typeof window !== 'undefined') {
                  const currentRating = parseInt(localStorage.getItem('dsaRating') || '1450');
                  const nextRating = currentRating + 25;
                  localStorage.setItem('dsaRating', nextRating.toString());
                  alert(`You solved it! You WIN +25 rating! New Rating: ${nextRating}`);
              } else {
                  alert("You solved it! You WIN +25 rating!");
              }
              router.push('/battles');
          }, 500);
      }
  };

  if (loading) {
      return <div className="min-h-screen bg-background flex flex-col items-center justify-center font-bold text-xl">Entering Arena...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Battle Header */}
      <header className="h-14 border-b flex items-center justify-between px-6 bg-secondary/20 shrink-0">
          <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Live Battle</span>
              <span className="font-semibold text-sm">Longest Palindromic Substring</span>
          </div>
          <div className="flex items-center gap-4">
              <div className="text-xl font-mono font-black text-primary animate-pulse">{formatTime(timeLeft)}</div>
          </div>
          <Button variant="destructive" size="sm" onClick={() => router.push('/battles')}>Surrender</Button>
      </header>

      {/* Progress Bars */}
      <div className="h-16 border-b flex px-6 items-center gap-8 bg-card shrink-0">
          <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between text-xs font-bold">
                  <span className="text-primary">You (1450)</span>
                  <span>{myProgress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${myProgress}%` }} />
              </div>
          </div>
          <div className="text-2xl font-black italic text-muted-foreground/30">VS</div>
          <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between text-xs font-bold">
                  <span className="text-destructive">Opponent (1462)</span>
                  <span>{opponentProgress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden flex justify-end">
                  {/* Fills from right to left */}
                  <div className="h-full bg-destructive transition-all duration-500" style={{ width: `${opponentProgress}%` }} />
              </div>
          </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Description */}
          <div className="w-1/3 border-r flex flex-col bg-card overflow-hidden p-6">
              <div className="prose prose-sm dark:prose-invert max-w-none flex-1 overflow-y-auto">
                  <p>Given a string <code>s</code>, return the longest palindromic substring in <code>s</code>.</p>
                  <div className="bg-muted p-3 mt-4 rounded">
                      <strong>Input:</strong> s = "babad"<br/>
                      <strong>Output:</strong> "bab"<br/>
                      <em>Explanation: "aba" is also a valid answer.</em>
                  </div>
              </div>
          </div>

          {/* Right Panel: Editor & Controls */}
          <div className="w-2/3 flex flex-col relative">
              <div className="flex justify-end p-2 border-b bg-card gap-2">
                  <Button variant="secondary" size="sm" onClick={handleRunCode}>Run Tests</Button>
                  <Button size="sm" onClick={handleRunCode}>Submit Solution</Button>
              </div>
              <Editor
                  height="100%"
                  language="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  options={{ minimap: { enabled: false }, fontSize: 15 }}
              />
          </div>
      </div>
    </div>
  );
}
