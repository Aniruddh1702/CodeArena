import { NextRequest, NextResponse } from "next/server";
import {
  getServerContests,
  saveServerContest,
  clearAllServerContests,
  Contest,
} from "@/lib/server-contest-store";
import { checkAdminAuth } from "@/lib/admin-auth";

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

// POST /api/contests - Create or update a contest with embedded problems (Admin Only)
export async function POST(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required to manage contests." },
        { status: 403 }
      );
    }

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

// DELETE /api/contests - Clear all contests (Admin Only with confirmation)
export async function DELETE(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const confirm = req.nextUrl.searchParams.get("confirm");
    if (confirm !== "CLEAR_ALL") {
      return NextResponse.json(
        { success: false, message: "Dangerous operation: confirm=CLEAR_ALL query parameter required." },
        { status: 400 }
      );
    }

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
