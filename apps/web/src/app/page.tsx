import Link from "next/link";
import { Button } from "@codearena/ui";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-primary">Code<span className="text-destructive">Arena</span></span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
            <Link href="/problems" className="transition-colors hover:text-primary font-medium">
              Practice (150 DSA)
            </Link>
            <Link href="/contests" className="transition-colors hover:text-amber-400 font-medium flex items-center gap-1 text-amber-400/90">
              <span>🏆</span> Contests
            </Link>
            <Link href="/leaderboard" className="transition-colors hover:text-primary">
              Leaderboard
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md text-xs">
                Student Login &rarr;
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" variant="outline" className="text-xs font-semibold">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
            <div className="absolute h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            
            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        🚀 CodeArena 2026 Edition is Live
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter">
                        Master DSA. <br className="hidden sm:inline"/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive">Aces Interviews.</span>
                    </h1>
                    <p className="max-w-[700px] text-lg md:text-xl text-muted-foreground">
                        The definitive platform for learning Data Structures, practicing algorithms, and competing in live contests.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full text-base h-12 px-8 font-bold">Student Login & Enter Arena 🚀</Button>
                        </Link>
                        <Link href="/problems" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full text-base h-12 px-8">Explore 150 Problems</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 bg-muted/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Platform Capabilities</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Built for Students, Teachers, and Companies.</p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Feature 1 */}
                    <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            💻
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Premium IDE Experience</h3>
                        <p className="text-muted-foreground">Monaco-powered editor with auto-complete, vim bindings, and multi-language support (C++, Java, Python, JS).</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            🛡️
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Secure Assessments</h3>
                        <p className="text-muted-foreground">Advanced proctoring, tab tracking, and server-authoritative timers for high-stakes company and college exams.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            🤖
                        </div>
                        <h3 className="mb-2 text-xl font-bold">AI DSA Mentor</h3>
                        <p className="text-muted-foreground">Stuck on a problem? Our AI mentor analyzes your code complexity and offers hints without giving away the answer.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-primary">Code<span className="text-destructive">Arena</span></span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
                © {new Date().getFullYear()} CodeArena. All rights reserved. Built for the next generation of engineers.
            </p>
            <div className="flex gap-4 text-sm font-medium text-muted-foreground">
                <Link href="/terms" className="hover:text-primary">Terms</Link>
                <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
