"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@codearena/ui";
import { getActiveAccount, getUserStats } from "@/lib/auth-session";
import { AccountSwitcher } from "@/components/AccountSwitcher";

export default function BattlesLobbyPage() {
  const router = useRouter();
  const [searching, setSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [rating, setRating] = useState(1450);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const active = getActiveAccount();
      if (!active) {
        router.push("/login?redirect=/battles");
        return;
      }
      const activeId = active.id || "default";
      const stats = getUserStats(activeId);
      setRating(stats.dsaRating);
    }
  }, [router]);

  const findMatch = () => {
      setSearching(true);
      // Simulate socket matchmaking delay
      setTimeout(() => {
          setMatchFound(true);
          setTimeout(() => {
              router.push('/battles/b1_demo');
          }, 2000);
      }, 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl tracking-tight text-primary">Code<span className="text-destructive">Arena</span></Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                <Link href="/problems" className="hover:text-primary transition-colors">Practice</Link>
                <Link href="/contests" className="hover:text-primary transition-colors text-amber-400 font-medium">Contests</Link>
                <Link href="/battles" className="text-primary font-semibold">Battles</Link>
                <Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link>
                <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>
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

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="w-full max-w-lg shadow-2xl border-primary/20 text-center py-10 relative overflow-hidden">
              {/* Background styling */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-primary to-destructive" />
              
              <CardHeader className="space-y-4">
                  <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-4xl mb-2">
                      ⚔️
                  </div>
                  <CardTitle className="text-3xl font-extrabold tracking-tight">Code Battles</CardTitle>
                  <CardDescription className="text-base">
                      Compete 1v1 against players of similar skill rating. Fast, real-time algorithms race.
                  </CardDescription>
              </CardHeader>
              
              <CardContent className="mt-8">
                  {matchFound ? (
                      <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                          <div className="text-xl font-bold text-green-500">Match Found!</div>
                          <div className="flex items-center justify-center gap-8 py-4">
                              <div className="flex flex-col items-center">
                                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-xl">U</div>
                                  <span className="mt-2 text-sm font-medium">You (1450)</span>
                              </div>
                              <span className="text-2xl font-black text-muted-foreground italic">VS</span>
                              <div className="flex flex-col items-center">
                                  <div className="w-12 h-12 bg-destructive/20 text-destructive rounded-full flex items-center justify-center text-xl">E</div>
                                  <span className="mt-2 text-sm font-medium">Enemy (1462)</span>
                              </div>
                          </div>
                          <p className="text-sm text-muted-foreground animate-pulse">Entering arena...</p>
                      </div>
                  ) : searching ? (
                      <div className="space-y-6">
                          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                          <div className="text-lg font-medium text-primary animate-pulse">Searching for opponent...</div>
                          <p className="text-sm text-muted-foreground">Estimated wait time: 0:15</p>
                          <Button variant="outline" onClick={() => setSearching(false)}>Cancel Search</Button>
                      </div>
                  ) : (
                      <div className="space-y-6">
                          <div className="bg-secondary/50 p-4 rounded-lg inline-block text-sm font-medium">
                              Your Rating: <span className="text-primary font-bold">{rating}</span>
                          </div>
                          <Button size="lg" className="w-full text-lg h-14" onClick={findMatch}>
                              Find Match
                          </Button>
                      </div>
                  )}
              </CardContent>
          </Card>
      </main>
    </div>
  );
}
