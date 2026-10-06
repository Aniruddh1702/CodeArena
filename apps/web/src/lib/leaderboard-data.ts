export interface LeaderboardUser {
  rank?: number;
  userId: string;
  username: string;
  name: string;
  org: string;
  score: number; // DSA Rating
  problemsSolved: number;
  accuracy: number;
  badge?: string;
  isCurrentUser?: boolean;
  avatarUrl?: string;
  tier: "Grandmaster" | "Candidate Master" | "Expert" | "Specialist" | "Pupil" | "Newbie";
  bio: string;
  joinedAt: string;
}

export function getTierFromRating(rating: number): "Grandmaster" | "Candidate Master" | "Expert" | "Specialist" | "Pupil" | "Newbie" {
  if (rating >= 2200) return "Grandmaster";
  if (rating >= 1900) return "Candidate Master";
  if (rating >= 1600) return "Expert";
  if (rating >= 1400) return "Specialist";
  if (rating >= 1200) return "Pupil";
  return "Newbie";
}

export const COMMUNITY_LEADERS: LeaderboardUser[] = [
  {
    userId: "u1",
    username: "tourist_algo",
    name: "Gennady Korotkevich",
    org: "Google",
    score: 2180,
    problemsSolved: 15,
    accuracy: 94.2,
    tier: "Candidate Master",
    bio: "Competitive programming veteran. Passionate about graph algorithms and dynamic programming.",
    joinedAt: "January 2026"
  },
  {
    userId: "u2",
    username: "byte_master",
    name: "Elena Rostova",
    org: "Meta",
    score: 2045,
    problemsSolved: 14,
    accuracy: 91.0,
    tier: "Candidate Master",
    bio: "Senior Infrastructure Engineer. Practicing competitive DSA daily to stay sharp.",
    joinedAt: "January 2026"
  },
  {
    userId: "u3",
    username: "dp_god",
    name: "David Park",
    org: "MIT",
    score: 1960,
    problemsSolved: 13,
    accuracy: 88.5,
    tier: "Candidate Master",
    bio: "CS Master's student at MIT. Exploring combinatorial optimization and DP tricks.",
    joinedAt: "February 2026"
  },
  {
    userId: "u4",
    username: "sarah_k",
    name: "Sarah Kim",
    org: "Stanford",
    score: 1820,
    problemsSolved: 11,
    accuracy: 86.4,
    tier: "Expert",
    bio: "Competitive programmer & open source contributor. Stanford CS '26.",
    joinedAt: "February 2026"
  },
  {
    userId: "u5",
    username: "alex_chen",
    name: "Alex Chen",
    org: "CodeArena Academy",
    score: 1715,
    problemsSolved: 9,
    accuracy: 84.0,
    tier: "Expert",
    bio: "Building high-performance distributed systems. Solving problems on CodeArena.",
    joinedAt: "March 2026"
  },
  {
    userId: "u6",
    username: "priya_sharma",
    name: "Priya Sharma",
    org: "CodeArena Academy",
    score: 1610,
    problemsSolved: 7,
    accuracy: 82.5,
    tier: "Expert",
    bio: "Software developer preparing for FAANG interviews. Focusing on Trees & Graphs.",
    joinedAt: "March 2026"
  },
  {
    userId: "u7",
    username: "marcus_v",
    name: "Marcus Vance",
    org: "University of Tech",
    score: 1535,
    problemsSolved: 4,
    accuracy: 79.0,
    tier: "Specialist",
    bio: "CS Undergraduate. Two pointers and sliding window enthusiast.",
    joinedAt: "March 2026"
  },
  {
    userId: "u8",
    username: "rohit_kumar",
    name: "Rohit Kumar",
    org: "CodeArena Academy",
    score: 1490,
    problemsSolved: 2,
    accuracy: 77.5,
    tier: "Specialist",
    bio: "Full-stack engineer leveling up core algorithms and competitive programming.",
    joinedAt: "March 2026"
  },
  {
    userId: "u9",
    username: "lisa_w",
    name: "Lisa Wang",
    org: "CodeArena Academy",
    score: 1450,
    problemsSolved: 1,
    accuracy: 75.0,
    tier: "Specialist",
    bio: "Aspiring backend developer. Consistent daily coding practice.",
    joinedAt: "April 2026"
  },
  {
    userId: "u10",
    username: "kevin_b",
    name: "Kevin Brown",
    org: "University of Tech",
    score: 1420,
    problemsSolved: 0,
    accuracy: 70.0,
    tier: "Specialist",
    bio: "Starting my DSA journey. Coding through arrays and math puzzles.",
    joinedAt: "April 2026"
  },
  {
    userId: "u11",
    username: "arjun_m",
    name: "Arjun Mehta",
    org: "CodeArena Academy",
    score: 1380,
    problemsSolved: 0,
    accuracy: 68.0,
    tier: "Pupil",
    bio: "Student exploring recursion, dynamic programming, and binary search.",
    joinedAt: "April 2026"
  }
];

export interface LeaderboardResult {
  globalRanked: LeaderboardUser[];
  orgRanked: LeaderboardUser[];
  currentUserGlobalRank: number;
  currentUserOrgRank: number;
  orgName: string;
}

export function getLeaderboards(currentUser: {
  username?: string;
  name?: string;
  org?: string;
  score?: number;
  problemsSolved?: number;
  accuracy?: number;
  bio?: string;
}): LeaderboardResult {
  const effectiveUsername = (currentUser.username || "aniruddh").toLowerCase();
  const effectiveName = currentUser.name || "Aniruddh Shukla";
  const effectiveOrg = currentUser.org || "CodeArena Academy";
  const effectiveScore = typeof currentUser.score === "number" ? currentUser.score : 1450;
  const effectiveSolved = typeof currentUser.problemsSolved === "number" ? currentUser.problemsSolved : 0;
  const effectiveAccuracy = typeof currentUser.accuracy === "number" ? currentUser.accuracy : (effectiveSolved > 0 ? 85.5 : 0.0);

  const userEntry: LeaderboardUser = {
    userId: "current_user",
    username: effectiveUsername,
    name: effectiveName,
    org: effectiveOrg,
    score: effectiveScore,
    problemsSolved: effectiveSolved,
    accuracy: effectiveAccuracy,
    isCurrentUser: true,
    tier: getTierFromRating(effectiveScore),
    bio: currentUser.bio || "Passionate competitive programmer & software engineer on CodeArena.",
    joinedAt: "March 2026"
  };

  // Filter out any mock entry with identical username
  const others = COMMUNITY_LEADERS.filter(
    (u) => u.username.toLowerCase() !== effectiveUsername
  );

  // Combine and sort globally
  const allGlobal = [...others, userEntry].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.problemsSolved - a.problemsSolved;
  });

  const globalRanked: LeaderboardUser[] = allGlobal.map((u, index) => ({
    ...u,
    rank: index + 1,
    badge: index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""
  }));

  const currentUserGlobalRank = globalRanked.find((u) => u.isCurrentUser)?.rank || 1;

  // Filter for user's organization
  const targetOrgLower = effectiveOrg.trim().toLowerCase();
  const allOrg = allGlobal.filter(
    (u) => u.isCurrentUser || u.org.trim().toLowerCase() === targetOrgLower
  );

  // Re-rank within organization
  const orgRanked: LeaderboardUser[] = allOrg.map((u, index) => ({
    ...u,
    rank: index + 1,
    badge: index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""
  }));

  const currentUserOrgRank = orgRanked.find((u) => u.isCurrentUser)?.rank || 1;

  return {
    globalRanked,
    orgRanked,
    currentUserGlobalRank,
    currentUserOrgRank,
    orgName: effectiveOrg
  };
}

export function getPublicProfileData(username: string, currentUser?: {
  username?: string;
  name?: string;
  org?: string;
  score?: number;
  problemsSolved?: number;
}): LeaderboardUser | null {
  const normalized = username.toLowerCase();
  
  if (currentUser && (normalized === (currentUser.username || "").toLowerCase() || normalized === "you")) {
    const score = currentUser.score ?? 1450;
    return {
      userId: "current_user",
      username: currentUser.username || "aniruddh",
      name: currentUser.name || "Aniruddh Shukla",
      org: currentUser.org || "CodeArena Academy",
      score,
      problemsSolved: currentUser.problemsSolved ?? 0,
      accuracy: 85.5,
      isCurrentUser: true,
      tier: getTierFromRating(score),
      bio: "Passionate competitive programmer & software engineer on CodeArena.",
      joinedAt: "March 2026"
    };
  }

  const found = COMMUNITY_LEADERS.find((u) => u.username.toLowerCase() === normalized);
  if (found) return found;

  // Fallback realistic user
  return {
    userId: `mock_${normalized}`,
    username: normalized,
    name: normalized.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    org: "CodeArena Academy",
    score: 1520,
    problemsSolved: 3,
    accuracy: 80.0,
    tier: "Specialist",
    bio: "Competitive coding enthusiast and member of the CodeArena community.",
    joinedAt: "March 2026"
  };
}
