import { NextRequest, NextResponse } from "next/server";
import {
  getServerSubmissions,
  saveServerSubmission,
  getServerContests,
  ContestSubmission,
} from "@/lib/server-contest-store";

// GET /api/contests/[id]/submissions - Get all submissions for a contest
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissions = getServerSubmissions(params.id);
    return NextResponse.json({
      success: true,
      contestId: params.id,
      submissions,
      count: submissions.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// POST /api/contests/[id]/submissions - Record student submission to the server
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    if (!body || !body.userEmail || !body.problemSlug) {
      return NextResponse.json(
        { success: false, message: "User Email and Problem Slug are required" },
        { status: 400 }
      );
    }

    const contests = getServerContests();
    const contest = contests.find((c) => c.id === params.id);
    if (contest) {
      const email = String(body.userEmail).toLowerCase().trim();
      const submittedUsers = (contest.submittedUsers || []).map((e) => e.toLowerCase().trim());
      if (submittedUsers.includes(email)) {
        return NextResponse.json(
          {
            success: false,
            message: "You have already submitted the assignment. Further submissions are disabled.",
            alreadySubmitted: true,
          },
          { status: 403 }
        );
      }
    }

    const newSub: ContestSubmission = {
      id: body.id || `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      contestId: params.id,
      userEmail: body.userEmail,
      userName: body.userName || "Student",
      problemSlug: body.problemSlug,
      problemTitle: body.problemTitle || body.problemSlug,
      status: body.status || "ACCEPTED",
      score: body.score || 0,
      penaltyMinutes: body.penaltyMinutes || 0,
      submittedAt: body.submittedAt || new Date().toISOString(),
      language: body.language || "javascript",
      code: body.code || "",
      runtime: body.runtime || "45 ms",
      memory: body.memory || "42.0 MB",
      passedTestCases: body.passedTestCases,
      totalTestCases: body.totalTestCases,
    };

    const saved = saveServerSubmission(newSub);

    return NextResponse.json({
      success: true,
      submission: saved,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to record submission" },
      { status: 500 }
    );
  }
}
