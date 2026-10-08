import { NextRequest, NextResponse } from "next/server";
import { getUserRegistry, recordUserLoginEvent } from "@/lib/userActivity";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const map = getUserRegistry();

    // Try merging with backend database leaderboard/users if available
    try {
      const res = await fetch(`${apiUrl}/api/leaderboard/global`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json().catch(() => null);
        const dbItems = json?.items || json?.data?.items || [];
        for (const item of dbItems) {
          const uKey = (item.username || "").toLowerCase();
          if (uKey && !map.has(uKey)) {
            map.set(uKey, {
              id: item.userId || item.id || `usr_${uKey}`,
              username: item.username,
              email: `${item.username}@codearena.dev`,
              name: item.name || item.username,
              role: "STUDENT",
              college: item.college || item.org || "CodeArena Academy",
              score: item.score || 1450,
              problemsSolved: item.problemsSolved || 0,
              lastLoginAt: new Date().toISOString(),
              registeredAt: "2026-09-01T00:00:00.000Z",
              status: "ACTIVE",
            });
          }
        }
      }
    } catch (e) {
      // Continue with in-memory global registry
    }

    const allUsers = Array.from(map.values()).sort(
      (a, b) => new Date(b.lastLoginAt).getTime() - new Date(a.lastLoginAt).getTime()
    );

    return NextResponse.json({
      success: true,
      count: allUsers.length,
      users: allUsers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load platform users" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.username && !body.email) {
      return NextResponse.json({ success: false, message: "Username or email is required" }, { status: 400 });
    }

    const username = body.username || body.email.split("@")[0];
    const recorded = recordUserLoginEvent({
      id: body.id,
      username: username,
      email: body.email,
      name: body.name || (body.firstName ? `${body.firstName || ""} ${body.lastName || ""}`.trim() : username),
      role: body.role || "STUDENT",
      college: body.college,
      score: body.score,
      problemsSolved: body.problemsSolved,
    });

    return NextResponse.json({ success: true, user: recorded });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to record login event" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, role, status } = body;
    const map = getUserRegistry();
    const key = (username || "").toLowerCase();

    if (!key || !map.has(key)) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const user = map.get(key)!;
    if (role) user.role = role;
    if (status) user.status = status;
    map.set(key, user);

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update user" },
      { status: 500 }
    );
  }
}
