import { NextRequest, NextResponse } from "next/server";
import { getUserRegistry } from "@/lib/userActivity";
import { getBackendApiUrl } from "@/lib/api-config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const apiUrl = getBackendApiUrl();
    const userMap = new Map<string, any>();

    // 1. Fetch from database leaderboard and users endpoints
    try {
      const endpoints = [
        `${apiUrl}/api/leaderboard/global?page=1&pageSize=1000`,
        `${apiUrl}/api/users/admin/all?pageSize=1000`,
      ];

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          });

          if (res.ok) {
            const json = await res.json().catch(() => null);
            const items = json?.data?.items || json?.items || [];
            if (Array.isArray(items)) {
              for (const u of items) {
                const uKey = (u.username || "").toLowerCase().trim();
                if (uKey && !userMap.has(uKey)) {
                  userMap.set(uKey, {
                    userId: u.userId || u.id || `usr_${uKey}`,
                    username: u.username,
                    name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username,
                    score: u.score !== undefined ? u.score : 1450,
                    problemsSolved: u.problemsSolved !== undefined ? u.problemsSolved : 0,
                    avatarUrl: u.avatarUrl,
                    org: u.org || u.college || "CodeArena Academy",
                    joinedAt: u.joinedAt || u.createdAt || "Registered Coder",
                    lastLoginAt: u.lastLoginAt,
                  });
                }
              }
            }
          }
        } catch (e) {}
      }
    } catch (err) {
      console.error("Failed to query backend for leaderboard:", err);
    }

    // 2. Merge all live signed-in students and registered accounts across all devices
    const liveRegistry = getUserRegistry();
    Array.from(liveRegistry.values()).forEach((regUser) => {
      const uKey = (regUser.username || "").toLowerCase().trim();
      if (!uKey) return;
      if (!userMap.has(uKey)) {
        userMap.set(uKey, {
          userId: regUser.id || `usr_${uKey}`,
          username: regUser.username,
          name: regUser.name || regUser.username,
          score: regUser.score || 1450,
          problemsSolved: regUser.problemsSolved || 0,
          avatarUrl: undefined,
          org: regUser.college || "CodeArena Academy",
          joinedAt: regUser.registeredAt || "Registered Coder",
          lastLoginAt: regUser.lastLoginAt,
        });
      } else {
        // Update score/solved if registry has newer live numbers
        const existing = userMap.get(uKey);
        if (regUser.score && regUser.score > existing.score) existing.score = regUser.score;
        if (regUser.problemsSolved && regUser.problemsSolved > existing.problemsSolved) {
          existing.problemsSolved = regUser.problemsSolved;
        }
        if (regUser.college) existing.org = regUser.college;
        if (regUser.lastLoginAt) existing.lastLoginAt = regUser.lastLoginAt;
      }
    });

    const items = Array.from(userMap.values());

    // Sort by rating desc, then solved desc
    items.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.problemsSolved !== a.problemsSolved) return b.problemsSolved - a.problemsSolved;
      return a.username.localeCompare(b.username);
    });

    const rankedItems = items.map((u, index) => ({
      ...u,
      rank: index + 1,
    }));

    return NextResponse.json({
      success: true,
      count: rankedItems.length,
      items: rankedItems,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to load leaderboard",
      items: [],
    });
  }
}
