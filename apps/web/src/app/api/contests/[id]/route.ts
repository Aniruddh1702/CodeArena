import { NextRequest, NextResponse } from "next/server";
import {
  getServerContests,
  saveServerContest,
  deleteServerContest,
  Contest,
} from "@/lib/server-contest-store";
import { checkAdminAuth } from "@/lib/admin-auth";

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

    const checkEmail = (
      req.nextUrl.searchParams.get("userEmail") ||
      req.nextUrl.searchParams.get("email") ||
      ""
    ).toLowerCase().trim();

    const hasSubmitted = Boolean(
      checkEmail &&
      (contest.submittedUsers || []).map((e) => e.toLowerCase().trim()).includes(checkEmail)
    );

    return NextResponse.json({
      success: true,
      contest,
      hasSubmitted,
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

    const isAdmin = checkAdminAuth(req);

    // If non-admin is sending updates, strictly restrict to registration & submission tracking
    if (!isAdmin) {
      const allowedKeys = ["registerUserEmail", "submittedUserEmail", "submittedUsers"];
      const requestedKeys = Object.keys(body);
      const unauthorizedKeys = requestedKeys.filter(k => !allowedKeys.includes(k));
      if (unauthorizedKeys.length > 0) {
        return NextResponse.json(
          { success: false, message: `Unauthorized: Modifying ${unauthorizedKeys.join(", ")} requires administrator privileges.` },
          { status: 403 }
        );
      }
    }

    const updated: Contest = {
      ...contest,
      ...(isAdmin ? body : {}),
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

    if (body.submittedUserEmail) {
      const email = String(body.submittedUserEmail).toLowerCase();
      const currentSubmitted = updated.submittedUsers || [];
      if (!currentSubmitted.includes(email)) {
        updated.submittedUsers = [...currentSubmitted, email];
      }
    }

    if (Array.isArray(body.submittedUsers)) {
      const currentSubmitted = new Set(updated.submittedUsers || []);
      body.submittedUsers.forEach((e: string) => currentSubmitted.add(String(e).toLowerCase()));
      updated.submittedUsers = Array.from(currentSubmitted);
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

// DELETE /api/contests/[id] - Delete a contest (Admin Only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required to delete contests." },
        { status: 403 }
      );
    }

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
