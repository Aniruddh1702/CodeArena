import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionDifficulty, QuestionStatus } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, authorId: string) {
      const existing = await this.prisma.question.findUnique({ where: { slug: data.slug }});
      if(existing) throw new ConflictException('Question with this slug already exists');

      const { topics, tags, examples, testCases, ...questionData } = data;

      return this.prisma.question.create({
          data: {
              title: questionData.title,
              slug: questionData.slug,
              description: questionData.description || '',
              difficulty: questionData.difficulty || 'MEDIUM',
              status: questionData.status || 'PUBLISHED',
              constraints: Array.isArray(questionData.constraints) ? questionData.constraints : [],
              starterCode: questionData.starterCode || {},
              functionSignature: questionData.functionSignature || {},
              timeLimit: questionData.timeLimit || 2000,
              memoryLimit: questionData.memoryLimit || 256,
              supportedLanguages: questionData.supportedLanguages || ['javascript', 'python', 'cpp', 'java'],
              creatorId: authorId,
              testCases: testCases?.length > 0 ? {
                  create: testCases.map((tc: any, index: number) => ({
                      input: typeof tc.input === 'string' ? tc.input : JSON.stringify(tc.input || tc.args || ''),
                      output: typeof tc.output === 'string' ? tc.output : JSON.stringify(tc.output ?? tc.expected ?? ''),
                      isPublic: tc.isPublic ?? true,
                      order: tc.order ?? index,
                      weight: tc.weight ?? 1,
                  })),
              } : undefined,
          }
      });
  }

  async update(id: string, data: any) {
      const existing = await this.prisma.question.findUnique({ where: { id }});
      if(!existing) throw new NotFoundException('Question not found');

      // Basic update, complex relational updates require a dedicated pattern
      return this.prisma.question.update({
          where: { id },
          data
      });
  }

  async delete(id: string) {
      const existing = await this.prisma.question.findUnique({ where: { id }});
      if(!existing) throw new NotFoundException('Question not found');

      return this.prisma.question.delete({ where: { id } });
  }

  async findAll(options: {
    page?: number;
    pageSize?: number;
    difficulty?: QuestionDifficulty;
    status?: QuestionStatus;
    topic?: string;
    search?: string;
  }) {
    const validPage = Math.max(1, Number(options.page) || 1);
    const validPageSize = Math.max(1, Math.min(100, Number(options.pageSize) || 20));
    const skip = (validPage - 1) * validPageSize;
    const { difficulty, status = 'PUBLISHED', topic, search } = options;
    const where: any = { status };

    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (topic) {
      where.topics = {
        some: {
          topic: { slug: topic },
        },
      };
    }

    try {
      const [items, total] = await Promise.all([
        this.prisma.question.findMany({
          where,
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            status: true,
            solveCount: true,
            attemptCount: true,
            topics: { include: { topic: { select: { name: true, slug: true } } } },
            tags: { include: { tag: { select: { name: true, slug: true } } } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: validPageSize,
        }),
        this.prisma.question.count({ where }),
      ]);

      return {
        items: items.map(item => ({
          ...item,
          topics: item.topics.map(t => t.topic),
          tags: item.tags.map(t => t.tag),
        })),
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

  async findBySlug(slug: string) {
    const question = await this.prisma.question.findUnique({
      where: { slug },
      include: {
        topics: { include: { topic: true } },
        tags: { include: { tag: true } },
        examples: { orderBy: { order: 'asc' } },
        testCases: { where: { isPublic: true }, orderBy: { order: 'asc' } },
      },
    });

    if (!question) throw new NotFoundException('Question not found');

    const { testCases, ...safeQuestion } = question;
    
    return {
      ...safeQuestion,
      publicTestCases: testCases,
      topics: question.topics.map(t => t.topic),
      tags: question.tags.map(t => t.tag),
    };
  }
}
