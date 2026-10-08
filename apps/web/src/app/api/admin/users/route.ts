import { NextRequest, NextResponse } from "next/server";
import { getUserRegistry, recordUserLoginEvent } from "@/lib/userActivity";
import { getBackendApiUrl } from "@/lib/api-config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const apiUrl = getBackendApiUrl();
    const map = getUserRegistry();

    // 1. Fetch real registered users from PostgreSQL Database via NestJS API
    try {
      const endpoints = [
        `${apiUrl}/api/users/admin/all?pageSize=1000`,
        `${apiUrl}/api/users?pageSize=1000`,
      ];

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          });

          if (res.ok) {
            const json = await res.json().catch(() => null);
            const dbUsers = json?.data?.items || json?.items || [];
            if (Array.isArray(dbUsers) && dbUsers.length > 0) {
              for (const u of dbUsers) {
                const uKey = (u.username || "").toLowerCase().trim();
                if (uKey) {
                  const existing = map.get(uKey);
                  map.set(uKey, {
                    id: u.id || u.userId || `usr_${uKey}`,
                    username: u.username,
                    email: u.email || `${u.username}@codearena.dev`,
                    name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username,
                    role: (u.role as any) || existing?.role || "STUDENT",
                    college: u.college || existing?.college || "CodeArena Academy",
                    score: u.score !== undefined ? u.score : (existing?.score || 1450),
                    problemsSolved: u.problemsSolved !== undefined ? u.problemsSolved : (existing?.problemsSolved || 0),
                    lastLoginAt: u.lastLoginAt || existing?.lastLoginAt || u.createdAt || new Date().toISOString(),
                    registeredAt: u.createdAt || u.registeredAt || existing?.registeredAt || new Date().toISOString(),
                    status: existing?.status || (u.status === "SUSPENDED" ? "SUSPENDED" : "ACTIVE"),
                  });
                }
              }
              break;
            }
          }
        } catch (e) {}
      }
    } catch (e) {
      console.error("Failed to query users from backend API:", e);
    }

    // 2. Try merging with global leaderboard entries if any extra users exist
    try {
      const res = await fetch(`${apiUrl}/api/leaderboard/global`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json().catch(() => null);
        const dbItems = json?.items || json?.data?.items || [];
        for (const item of dbItems) {
          const uKey = (item.username || "").toLowerCase().trim();
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
    } catch (e) {}

    const allUsers = Array.from(map.values()).sort(
      (a, b) => new Date(b.lastLoginAt || b.registeredAt).getTime() - new Date(a.lastLoginAt || a.registeredAt).getTime()
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
    const { username, role, status, userId } = body;
    const map = getUserRegistry();
    const key = (username || "").toLowerCase().trim();

    if (key && map.has(key)) {
      const user = map.get(key)!;
      if (role) user.role = role;
      if (status) user.status = status;
      map.set(key, user);
    }

    // Also forward suspend/activate to backend if status changed
    const apiUrl = getBackendApiUrl();
    if (userId && status) {
      try {
        const endpoint = status === "SUSPENDED" ? `${apiUrl}/api/users/${userId}/suspend` : `${apiUrl}/api/users/${userId}/activate`;
        await fetch(endpoint, { method: "PATCH" });
      } catch (e) {}
    }

    return NextResponse.json({ success: true, user: key ? map.get(key) : null });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { clearUserRegistry } = await import("@/lib/userActivity");
    clearUserRegistry();

    const apiUrl = getBackendApiUrl();
    try {
      await fetch(`${apiUrl}/api/users/clear-all`, { method: "DELETE" });
      await fetch(`${apiUrl}/api/users/clear-all`, { method: "POST" });
    } catch (e) {}

    return NextResponse.json({ success: true, message: "All users cleared successfully for a fresh start." });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to clear users" },
      { status: 500 }
    );
  }
}
