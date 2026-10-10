import { NextRequest, NextResponse } from "next/server";
import { 
  getAssessmentReport, 
  recordAssessmentStudentResult, 
  AssessmentStudentResult 
} from "@/lib/server-assessment-store";

// GET /api/org/tests/[id]/report - Fetch dynamic assessment report
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = getAssessmentReport(params.id);
    return NextResponse.json({
      success: true,
      report
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch assessment report" },
      { status: 500 }
    );
  }
}

// POST /api/org/tests/[id]/report - Record student assessment submission & grade
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    if (!body || !body.studentId) {
      return NextResponse.json(
        { success: false, message: "studentId is required" },
        { status: 400 }
      );
    }

    const newResult: AssessmentStudentResult = {
      id: body.id || `res_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      testId: params.id,
      studentId: body.studentId,
      studentName: body.studentName || "Student",
      studentEmail: body.studentEmail,
      score: typeof body.score === "number" ? body.score : 0,
      timeTaken: body.timeTaken || `${body.timeTakenMinutes || 30}m`,
      timeTakenMinutes: body.timeTakenMinutes || 30,
      status: body.status || "Evaluated",
      submittedAt: body.submittedAt || new Date().toISOString(),
      language: body.language || "javascript",
      code: body.code || "",
      passedTestCases: body.passedTestCases,
      totalTestCases: body.totalTestCases
    };

    const saved = recordAssessmentStudentResult(newResult);
    const updatedReport = getAssessmentReport(params.id);

    return NextResponse.json({
      success: true,
      message: "Assessment submission successfully recorded and graded.",
      result: saved,
      report: updatedReport
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to record assessment submission" },
      { status: 500 }
    );
  }
}
