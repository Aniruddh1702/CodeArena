import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionsService } from '../questions/questions.service';
import { SubmissionStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubmissionsService {
  constructor(
    private prisma: PrismaService,
    private questionsService: QuestionsService,
    private config: ConfigService,
  ) {}

  async submitCode(userId: string, questionId: string, language: string, code: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { testCases: true },
    });

    if (!question) throw new NotFoundException('Question not found');
    if (!question.supportedLanguages.includes(language)) {
      throw new BadRequestException('Language not supported for this question');
    }

    // Determine attempt number
    const previousAttempt = await this.prisma.submission.findFirst({
      where: { userId, questionId },
      orderBy: { attemptNumber: 'desc' },
    });
    const attemptNumber = previousAttempt ? previousAttempt.attemptNumber + 1 : 1;

    // Create submission record
    const submission = await this.prisma.submission.create({
      data: {
        userId,
        questionId,
        language,
        code,
        status: SubmissionStatus.QUEUED,
        attemptNumber,
        testCasesTotal: question.testCases.length,
      },
    });

    // TODO: Send to job queue for worker execution
    // This will be implemented in Phase 2
    
    // For now, simulate a fast synchronous response for development if worker is not running
    // In production, this would immediately return the queued submission
    
    return submission;
  }

  async getSubmissionStatus(id: string, userId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        results: { orderBy: { order: 'asc' } },
        question: { select: { title: true, slug: true } },
      },
    });

    if (!submission) throw new NotFoundException('Submission not found');
    
    // Only the submitter or an admin can view the submission
    if (submission.userId !== userId) {
        const user = await this.prisma.user.findUnique({where: {id: userId}});
        if(!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'TEACHER')) {
            throw new NotFoundException('Submission not found'); // obfuscate
        }
    }

    return submission;
  }

  async getUserSubmissions(userId: string, questionId?: string, page: number = 1, pageSize: number = 20) {
      const validPage = Math.max(1, Number(page) || 1);
      const validPageSize = Math.max(1, Math.min(100, Number(pageSize) || 20));
      const skip = (validPage - 1) * validPageSize;

      const where: any = { userId };
      if (questionId) where.questionId = questionId;

      try {
        const [items, total] = await Promise.all([
            this.prisma.submission.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: validPageSize,
                include: {
                    question: { select: { title: true, slug: true, difficulty: true } }
                }
            }),
            this.prisma.submission.count({ where })
        ]);

        return {
            items,
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
