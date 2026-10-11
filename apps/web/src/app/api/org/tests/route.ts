import { NextRequest, NextResponse } from "next/server";
import { getAllAssessments, saveAssessmentTest, AssessmentTest } from "@/lib/server-assessment-store";

// GET /api/org/tests - List all tests created by org
export async function GET(_req: NextRequest) {
  try {
    const tests = getAllAssessments();
    return NextResponse.json({
      success: true,
      tests
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch assessments" },
      { status: 500 }
    );
  }
}

// POST /api/org/tests - Create new assessment test on the server
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.title) {
      return NextResponse.json(
        { success: false, message: "Title is required for assessment" },
        { status: 400 }
      );
    }

    const newTest: AssessmentTest = {
      id: body.id || `test_${Date.now()}`,
      title: body.title,
      type: body.type || "EXAM",
      status: body.status || "SCHEDULED",
      durationMinutes: body.durationMinutes || 90,
      batchesAssigned: body.batchesAssigned || 1,
      questionCount: body.questionCount || 4,
      questions: body.questions || [],
      startTime: body.startTime || new Date().toISOString(),
    };

    saveAssessmentTest(newTest);

    return NextResponse.json({
      success: true,
      test: newTest,
      message: "Assessment created successfully on server"
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create assessment" },
      { status: 500 }
    );
  }
}
