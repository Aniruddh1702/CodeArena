import { NextRequest, NextResponse } from "next/server";
import {
  getServerContests,
  saveServerContest,
  clearAllServerContests,
  Contest,
} from "@/lib/server-contest-store";

// GET /api/contests - Returns all platform contests
export async function GET(req: NextRequest) {
  try {
    const contests = getServerContests();
    return NextResponse.json({
      success: true,
      contests,
      count: contests.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch contests" },
      { status: 500 }
    );
  }
}

// POST /api/contests - Create or update a contest with embedded problems
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.id || !body.title) {
      return NextResponse.json(
        { success: false, message: "Contest ID and Title are required" },
        { status: 400 }
      );
    }

    const saved = saveServerContest(body as Contest);
    return NextResponse.json({
      success: true,
      contest: saved,
      message: `Contest '${saved.title}' saved to server successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to save contest to server" },
      { status: 500 }
    );
  }
}

// DELETE /api/contests - Clear all contests
export async function DELETE(req: NextRequest) {
  try {
    clearAllServerContests();
    return NextResponse.json({
      success: true,
      message: "All contests cleared from server.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to clear contests" },
      { status: 500 }
    );
  }
}
