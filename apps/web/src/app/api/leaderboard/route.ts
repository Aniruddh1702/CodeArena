import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const res = await fetch(`${apiUrl}/api/leaderboard/global?page=1&pageSize=100`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      return NextResponse.json({ success: true, items: [] });
    }

    const json = await res.json().catch(() => null);
    const rawItems = json?.data?.items || json?.items || [];

    const items = rawItems.map((u: any) => ({
      userId: u.userId || u.id,
      username: u.username,
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username,
      score: u.score ? Math.max(1450, u.score) : 1450,
      problemsSolved: u.problemsSolved || 0,
      avatarUrl: u.avatarUrl,
      org: "CodeArena Academy",
    }));

    return NextResponse.json({ success: true, items });
  } catch (err: any) {
    // If backend is offline, return empty list gracefully so local session users still display
    return NextResponse.json({ success: true, items: [] });
  }
}
