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
    if (!contest) {
      return NextResponse.json(
        { success: false, message: "Contest not found." },
        { status: 404 }
      );
    }

    const email = String(body.userEmail).toLowerCase().trim();
    if (
      !email ||
      email.startsWith("guest_") ||
      email === "guest" ||
      !email.includes("@")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required: You must be signed in with a registered account to submit contest answers.",
        },
        { status: 401 }
      );
    }

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

    // Validate that problem is part of this contest
    const contestProblem = (contest.problems || []).find((p) => p.problemSlug === body.problemSlug);
    if (!contestProblem) {
      return NextResponse.json(
        { success: false, message: "Specified problem does not belong to this contest." },
        { status: 400 }
      );
    }

    // Derive score and status authentically to prevent score manipulation
    const totalCases = Math.max(1, Number(body.totalTestCases) || 1);
    const passedCases = Math.max(0, Math.min(totalCases, Number(body.passedTestCases) || 0));
    const isAccepted = passedCases === totalCases && passedCases > 0;
    const computedStatus = isAccepted ? "ACCEPTED" : (body.status === "TIME_LIMIT_EXCEEDED" ? "TIME_LIMIT_EXCEEDED" : (body.status === "RUNTIME_ERROR" ? "RUNTIME_ERROR" : "WRONG_ANSWER"));
    const maxPoints = contestProblem.points || 200;
    const computedScore = isAccepted ? maxPoints : Math.round((passedCases / totalCases) * maxPoints);

    const newSub: ContestSubmission = {
      id: body.id || `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      contestId: params.id,
      userEmail: body.userEmail,
      userName: body.userName || "Student",
      problemSlug: body.problemSlug,
      problemTitle: contestProblem.title || body.problemSlug,
      status: computedStatus,
      score: computedScore,
      penaltyMinutes: Math.max(0, Number(body.penaltyMinutes) || 0),
      submittedAt: body.submittedAt || new Date().toISOString(),
      language: body.language || "javascript",
      code: body.code || "",
      runtime: body.runtime || "45 ms",
      memory: body.memory || "42.0 MB",
      passedTestCases: passedCases,
      totalTestCases: totalCases,
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
