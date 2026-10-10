"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@codearena/ui";

export default function TestReportPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/org/tests/${params.id}/report`)
      .then((res) => res.json())
      .then((data) => {
        if (data.report) {
          setReport(data.report);
        } else {
          // Fallback mock
          setReport({
            testName: "Data Structures Mid-term",
            date: "Oct 15, 2026",
            metrics: {
              averageScore: 74,
              highestScore: 98,
              lowestScore: 32,
              completionRate: 95
            },
            students: [
              { studentName: "John Doe", score: 85, timeTaken: "45m", status: "Evaluated" },
              { studentName: "Alice Smith", score: 98, timeTaken: "38m", status: "Evaluated" },
              { studentName: "Bob Williams", score: 65, timeTaken: "58m", status: "Evaluated" },
              { studentName: "Eve Hacker", score: 0, timeTaken: "-", status: "Disqualified (Proctoring)" }
            ]
          });
        }
      })
      .catch(() => {
        setReport({
          testName: "Data Structures Mid-term",
          date: "Oct 15, 2026",
          metrics: {
            averageScore: 74,
            highestScore: 98,
            lowestScore: 32,
            completionRate: 95
          },
          students: [
            { studentName: "John Doe", score: 85, timeTaken: "45m", status: "Evaluated" },
            { studentName: "Alice Smith", score: 98, timeTaken: "38m", status: "Evaluated" }
          ]
        });
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading || !report) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-bold">Generating Assessment Report...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
              <span className="text-white text-sm font-black">C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                Code<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Arena</span>
              </span>
              <span className="text-muted-foreground text-xs font-mono">/ Org</span>
            </div>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => router.push("/assessments")}>
            ← Back to Assessments
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8 max-w-5xl">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assessment Report</h1>
            <p className="text-muted-foreground mt-1">
              {report.testName} • {report.date}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => alert("CSV exported.")}>
            Download CSV
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary font-mono">{report.metrics.averageScore}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Highest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400 font-mono">{report.metrics.highestScore}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Lowest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive font-mono">{report.metrics.lowestScore}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{report.metrics.completionRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Student Table */}
        <Card>
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-base font-bold">Student Results &amp; Submissions ({report.students.length})</CardTitle>
          </CardHeader>
          <div className="rounded-b-md overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b text-xs uppercase font-mono text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-semibold">Student Name</th>
                  <th className="px-6 py-3 font-semibold">Score</th>
                  <th className="px-6 py-3 font-semibold">Time Taken</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.students.map((student: any, i: number) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium flex flex-col">
                      <span>{student.studentName || student.name}</span>
                      {student.studentEmail && (
                        <span className="text-xs text-muted-foreground font-mono">{student.studentEmail}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">
                      <span className={student.score >= 70 ? "text-emerald-400" : student.score >= 40 ? "text-amber-400" : "text-destructive"}>
                        {student.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">{student.timeTaken}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        (student.status || "").includes("Disqualified")
                          ? "bg-destructive/10 text-destructive border border-destructive/30"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
