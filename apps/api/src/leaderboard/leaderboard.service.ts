import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getGlobalLeaderboard(page: number = 1, pageSize: number = 50) {
      const validPage = Math.max(1, Number(page) || 1);
      const validPageSize = Math.max(1, Math.min(100, Number(pageSize) || 50));
      const skip = (validPage - 1) * validPageSize;
      
      try {
        const [items, total] = await Promise.all([
            this.prisma.rating.findMany({
                orderBy: { dsaRating: 'desc' },
                skip,
                take: validPageSize,
                include: {
                    user: {
                        select: { id: true, username: true, firstName: true, lastName: true, avatarUrl: true }
                    }
                }
            }),
            this.prisma.rating.count()
        ]);

        return {
            items: items.map((r, index) => ({
                rank: skip + index + 1,
                userId: r.user.id,
                username: r.user.username,
                firstName: r.user.firstName,
                lastName: r.user.lastName,
                avatarUrl: r.user.avatarUrl,
                score: r.dsaRating,
                problemsSolved: r.problemsSolved
            })),
            total,
            page: validPage,
            pageSize: validPageSize,
            totalPages: Math.ceil(total / validPageSize)
        };
      } catch (e) {
        return {
            items: [],
            total: 0,
            page: validPage,
            pageSize: validPageSize,
            totalPages: 0
        };
      }
  }
}
