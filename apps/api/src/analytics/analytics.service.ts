import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getStudentDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return {
        greeting: 'Welcome back!',
        dsaRating: 1450,
        problemsSolved: 0,
        accuracy: 0,
        currentStreak: 0,
        recentActivity: [],
        topicProgress: [
          { topicName: 'Arrays', topicSlug: 'arrays', solved: 0, total: 50, percentage: 0 },
          { topicName: 'Strings', topicSlug: 'strings', solved: 0, total: 30, percentage: 0 },
          { topicName: 'Dynamic Programming', topicSlug: 'dynamic-programming', solved: 0, total: 40, percentage: 0 },
          { topicName: 'Linked List', topicSlug: 'linked-list', solved: 0, total: 40, percentage: 0 },
        ],
        weakTopics: ['Dynamic Programming', 'Graphs'],
      };
    }

    const rating = await this.prisma.rating.findUnique({ where: { userId } });

    // Fetch user's real submissions from DB
    const submissions = await this.prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        question: {
          select: {
            title: true,
            slug: true,
            difficulty: true,
          },
        },
      },
    });

    const acceptedSubmissions = await this.prisma.submission.findMany({
      where: { userId, status: 'ACCEPTED' },
      select: { questionId: true },
      distinct: ['questionId'],
    });

    const totalSubmissions = await this.prisma.submission.count({ where: { userId } });
    const acceptedTotal = await this.prisma.submission.count({ where: { userId, status: 'ACCEPTED' } });
    const uniqueSolved = acceptedSubmissions.length;
    const baseRating = rating?.dsaRating || (1450 + uniqueSolved * 15);
    const accuracy = totalSubmissions > 0 ? Number(((acceptedTotal / totalSubmissions) * 100).toFixed(1)) : 0;
    const currentStreak = uniqueSolved > 0 ? 1 : 0;

    const recentActivity = submissions.map((s) => ({
      type: s.status === 'ACCEPTED' ? 'SOLVED' : 'ATTEMPTED',
      title: s.question?.title || 'Problem Submission',
      slug: s.question?.slug || '',
      difficulty: s.question?.difficulty || 'EASY',
      language: s.language,
      status: s.status,
      timestamp: s.createdAt.toISOString(),
      date: 'Recent',
    }));

    const displayName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username;

    return {
      greeting: `Welcome back, ${displayName}!`,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: displayName,
      },
      dsaRating: baseRating,
      problemsSolved: uniqueSolved,
      accuracy,
      currentStreak,
      recentActivity,
      topicProgress: [
        { topicName: 'Arrays', topicSlug: 'arrays', solved: Math.min(uniqueSolved, 1), total: 50, percentage: Math.min(100, Math.round((Math.min(uniqueSolved, 1) / 50) * 100)) },
        { topicName: 'Strings', topicSlug: 'strings', solved: 0, total: 30, percentage: 0 },
        { topicName: 'Dynamic Programming', topicSlug: 'dynamic-programming', solved: 0, total: 40, percentage: 0 },
        { topicName: 'Linked List', topicSlug: 'linked-list', solved: 0, total: 40, percentage: 0 },
      ],
      weakTopics: ['Dynamic Programming', 'Graphs'],
    };
  }
}
