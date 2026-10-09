import { NextRequest, NextResponse } from "next/server";
import {
  getServerContests,
  saveServerContest,
  deleteServerContest,
  Contest,
} from "@/lib/server-contest-store";

// GET /api/contests/[id] - Get a single contest with all embedded problems
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contests = getServerContests();
    const contest = contests.find((c) => c.id === params.id);
    if (!contest) {
      return NextResponse.json(
        { success: false, message: "Contest not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      contest,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch contest" },
      { status: 500 }
    );
  }
}

// PATCH /api/contests/[id] - Update contest (e.g. status, register user, time)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const contests = getServerContests();
    const contest = contests.find((c) => c.id === params.id);
    if (!contest) {
      return NextResponse.json(
        { success: false, message: "Contest not found" },
        { status: 404 }
      );
    }

    const updated: Contest = {
      ...contest,
      ...body,
      id: contest.id, // Preserve ID
    };

    if (body.registerUserEmail) {
      const email = String(body.registerUserEmail).toLowerCase();
      const currentUsers = updated.registeredUsers || [];
      if (!currentUsers.includes(email)) {
        updated.registeredUsers = [...currentUsers, email];
        updated.participantsCount = Math.max(
          updated.participantsCount + 1,
          updated.registeredUsers.length
        );
      }
    }

    saveServerContest(updated);

    return NextResponse.json({
      success: true,
      contest: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update contest" },
      { status: 500 }
    );
  }
}

// DELETE /api/contests/[id] - Delete a contest
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    deleteServerContest(params.id);
    return NextResponse.json({
      success: true,
      message: `Contest ${params.id} deleted.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete contest" },
      { status: 500 }
    );
  }
}
