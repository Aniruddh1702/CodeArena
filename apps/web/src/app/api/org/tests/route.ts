import { NextRequest, NextResponse } from "next/server";
import { getAllAssessments } from "@/lib/server-assessment-store";

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
