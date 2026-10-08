import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getGlobalLeaderboard(page: number = 1, pageSize: number = 100) {
    const validPage = Math.max(1, Number(page) || 1);
    const validPageSize = Math.max(1, Math.min(1000, Number(pageSize) || 100));
    const skip = (validPage - 1) * validPageSize;

    try {
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            createdAt: true,
            lastLoginAt: true,
            ratings: {
              select: {
                dsaRating: true,
                contestRating: true,
                problemsSolved: true,
              },
              take: 1,
            },
            organizationMemberships: {
              select: {
                organization: {
                  select: { name: true },
                },
              },
              take: 1,
            },
            _count: {
              select: { submissions: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: validPageSize,
        }),
        this.prisma.user.count(),
      ]);

      const mapped = users.map((u) => {
        const ratingObj = u.ratings?.[0];
        const score = ratingObj?.dsaRating || 1450;
        const problemsSolved = ratingObj?.problemsSolved || u._count?.submissions || 0;
        const org = u.organizationMemberships?.[0]?.organization?.name || 'CodeArena Academy';
        const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username;

        return {
          userId: u.id,
          username: u.username,
          name,
          firstName: u.firstName,
          lastName: u.lastName,
          avatarUrl: u.avatarUrl,
          score,
          problemsSolved,
          org,
          joinedAt: u.createdAt,
          lastLoginAt: u.lastLoginAt || u.createdAt,
        };
      });

      // Sort by score descending, then problems solved descending
      mapped.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.problemsSolved !== a.problemsSolved) return b.problemsSolved - a.problemsSolved;
        return a.username.localeCompare(b.username);
      });

      const itemsWithRank = mapped.map((item, index) => ({
        ...item,
        rank: skip + index + 1,
      }));

      return {
        items: itemsWithRank,
        total,
        page: validPage,
        pageSize: validPageSize,
        totalPages: Math.ceil(total / validPageSize),
      };
    } catch (e) {
      return {
        items: [],
        total: 0,
        page: validPage,
        pageSize: validPageSize,
        totalPages: 0,
      };
    }
  }
}
