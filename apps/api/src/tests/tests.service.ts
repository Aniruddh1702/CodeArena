import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async getUpcomingTests(userId: string) {
    const assignments = await this.prisma.testAssignment.findMany({
      where: { userId },
      include: {
        test: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            status: true,
            duration: true,
            startTime: true,
            endTime: true,
            maxAttempts: true,
          },
        },
      },
    });

    // Also find tests assigned via batch
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        organizationMemberships: {
          include: {
             organization: {
                 include: {
                     batches: {
                         include: {
                             students: {
                                 where: { userId }
                             }
                         }
                     }
                 }
             }
          }
        }
      }
    });

    let batchAssignedTests: any[] = [];
    if(user?.organizationMemberships) {
        for(const membership of user.organizationMemberships) {
            for(const batch of membership.organization.batches) {
                if(batch.students.length > 0) {
                     const tests = await this.prisma.testAssignment.findMany({
                         where: { batchId: batch.id },
                         include: {
                             test: {
                               select: {
                                 id: true,
                                 title: true,
                                 description: true,
                                 type: true,
                                 status: true,
                                 duration: true,
                                 startTime: true,
                                 endTime: true,
                                 maxAttempts: true,
                               },
                             },
                           },
                     });
                     batchAssignedTests = [...batchAssignedTests, ...tests];
                }
            }
        }
    }

    const allTests = [...assignments, ...batchAssignedTests].map(a => {
        // compute question count separately or include it
        return {
            ...a.test,
            questionCount: 0 // Placeholder, compute properly in Phase 3
        }
    });

    // Remove duplicates
    const uniqueTests = Array.from(new Set(allTests.map(a => a.id)))
        .map(id => allTests.find(a => a.id === id));

    return uniqueTests.filter(t => t.status === 'SCHEDULED' || t.status === 'ACTIVE');
  }

  async getRecentAssessments(userId: string) {
      const attempts = await this.prisma.testAttempt.findMany({
          where: { userId, status: 'EVALUATED' },
          orderBy: { submittedAt: 'desc' },
          take: 5,
          include: {
              test: { select: { title: true } }
          }
      });

      return attempts.map(a => ({
          id: a.id,
          testId: a.testId,
          testTitle: a.test.title,
          score: a.score,
          totalPoints: a.totalPoints,
          accuracy: a.accuracy,
          timeTaken: a.timeTaken,
          status: a.status,
          questionsAttempted: 0, // Placeholder
          questionsSolved: 0 // Placeholder
      }));
  }
}
