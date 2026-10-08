import { NextRequest, NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/api-config";

export async function GET(req: NextRequest) {
  try {
    const apiUrl = getBackendApiUrl();
    const res = await fetch(`${apiUrl}/api/questions?pageSize=100`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => null);
    return NextResponse.json(data || { success: true, data: { items: [] } });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiUrl = getBackendApiUrl();

    // Extract authorization header or token cookie
    let authHeader = req.headers.get("authorization");
    if (!authHeader) {
      const token = req.cookies.get("token")?.value;
      if (token) authHeader = `Bearer ${token}`;
    }

    // Check if body is an array of questions (bulk import)
    const questionsToImport = Array.isArray(body) ? body : [body];
    const results = [];
    const errors = [];

    for (const q of questionsToImport) {
      try {
        const payload = {
          title: q.title,
          slug: q.slug || q.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          description: q.description || "",
          difficulty: q.difficulty || "MEDIUM",
          methodName: q.methodName || "solution",
          constraints: Array.isArray(q.constraints) ? q.constraints : [],
          starterCode: q.starterCode || {
            javascript: `var ${q.methodName || "solution"} = function() {\n    \n};`,
            python: `class Solution:\n    def ${q.methodName || "solution"}(self):\n        pass`,
          },
          supportedLanguages: q.supportedLanguages || ["javascript", "python", "cpp", "java"],
          testCases: [
            ...(Array.isArray(q.publicTestCases) ? q.publicTestCases.map((tc: any, i: number) => ({ ...tc, isPublic: true, order: i })) : []),
            ...(Array.isArray(q.hiddenTestCases) ? q.hiddenTestCases.map((tc: any, i: number) => ({ ...tc, isPublic: false, order: 100 + i })) : []),
            ...(Array.isArray(q.testCases) ? q.testCases : []),
          ],
        };

        if (authHeader) {
          const apiRes = await fetch(`${apiUrl}/api/questions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader,
            },
            body: JSON.stringify(payload),
          });
          const apiData = await apiRes.json().catch(() => null);
          if (apiRes.ok) {
            results.push(apiData?.data || payload);
          } else {
            // Still accept locally even if DB reject (e.g. unique constraint or offline)
            results.push(payload);
          }
        } else {
          results.push(payload);
        }
      } catch (err: any) {
        errors.push({ question: q.title, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      imported: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to process question creation" },
      { status: 500 }
    );
  }
}
