"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@codearena/ui";

export default function TestReportPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Mock Test Report Data
  const reportData = {
      testName: "Data Structures Mid-term",
      date: "Oct 15, 2026",
      metrics: {
          averageScore: 74,
          highestScore: 98,
          lowestScore: 32,
          completionRate: 95
      },
      students: [
          { name: "John Doe", score: 85, timeTaken: "45m", status: "Evaluated" },
          { name: "Alice Smith", score: 98, timeTaken: "38m", status: "Evaluated" },
          { name: "Bob Williams", score: 65, timeTaken: "58m", status: "Evaluated" },
          { name: "Charlie DSA", score: 72, timeTaken: "51m", status: "Evaluated" },
          { name: "Eve Hacker", score: 0, timeTaken: "-", status: "Disqualified (Proctoring)" },
      ]
  };

  useEffect(() => {
      setTimeout(() => setLoading(false), 600);
  }, []);

  if (loading) {
      return <div className="min-h-screen bg-background flex justify-center items-center">Generating Report...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tight flex items-center gap-2">
                <span className="text-primary">Code<span className="text-destructive">Arena</span></span>
                <span className="text-muted-foreground text-sm font-normal">/ Org Panel</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push('/org/tests')}>← Back to Tests</Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8 max-w-5xl">
          <div className="flex justify-between items-end">
              <div>
                  <h1 className="text-3xl font-bold tracking-tight">Assessment Report</h1>
                  <p className="text-muted-foreground">{reportData.testName} • {reportData.date}</p>
              </div>
              <Button>Download CSV</Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Average Score</CardTitle></CardHeader>
                  <CardContent><div className="text-2xl font-bold text-primary">{reportData.metrics.averageScore}%</div></CardContent>
              </Card>
              <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Highest Score</CardTitle></CardHeader>
                  <CardContent><div className="text-2xl font-bold text-green-500">{reportData.metrics.highestScore}%</div></CardContent>
              </Card>
              <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Lowest Score</CardTitle></CardHeader>
                  <CardContent><div className="text-2xl font-bold text-destructive">{reportData.metrics.lowestScore}%</div></CardContent>
              </Card>
              <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Completion Rate</CardTitle></CardHeader>
                  <CardContent><div className="text-2xl font-bold">{reportData.metrics.completionRate}%</div></CardContent>
              </Card>
          </div>

          <Card>
              <CardHeader>
                  <CardTitle>Student Results</CardTitle>
              </CardHeader>
              <div className="rounded-b-md border-t overflow-hidden">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b">
                          <tr>
                              <th className="px-6 py-3 font-medium">Student Name</th>
                              <th className="px-6 py-3 font-medium">Score</th>
                              <th className="px-6 py-3 font-medium">Time Taken</th>
                              <th className="px-6 py-3 font-medium">Status</th>
                          </tr>
                      </thead>
                      <tbody>
                          {reportData.students.map((student, i) => (
                              <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                                  <td className="px-6 py-4 font-medium">{student.name}</td>
                                  <td className="px-6 py-4 font-bold">{student.score}%</td>
                                  <td className="px-6 py-4 text-muted-foreground">{student.timeTaken}</td>
                                  <td className="px-6 py-4">
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                          student.status.includes('Disqualified') 
                                            ? 'bg-destructive/10 text-destructive' 
                                            : 'bg-green-500/10 text-green-500'
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
