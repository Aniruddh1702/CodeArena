import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        avatarUrl: true,
        bio: true,
        isPublicProfile: true,
        emailVerified: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getPublicProfile(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        bio: true,
        isPublicProfile: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!user.isPublicProfile) throw new NotFoundException('Profile is private');

    // Get rating
    const rating = await this.prisma.rating.findUnique({
      where: { userId: user.id },
    });

    // Get achievements
    const achievements = await this.prisma.userAchievement.findMany({
      where: { userId: user.id },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
      take: 10,
    });

    return {
      ...user,
      rating,
      achievements: achievements.map((ua) => ({
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        unlockedAt: ua.unlockedAt,
      })),
    };
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; bio?: string; isPublicProfile?: boolean }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        isPublicProfile: true,
        avatarUrl: true,
      },
    });
  }

  async listUsers(options: {
    role?: UserRole;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const validPage = Math.max(1, Number(options.page) || 1);
    const validPageSize = Math.max(1, Math.min(100, Number(options.pageSize) || 20));
    const skip = (validPage - 1) * validPageSize;
    const { role, search } = options;
    const where: any = {};

    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    try {
      const [items, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
            emailVerified: true,
            createdAt: true,
            lastLoginAt: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: validPageSize,
        }),
        this.prisma.user.count({ where }),
      ]);

      return {
        items,
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

  async suspendUser(userId: string, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'SUPER_ADMIN') throw new ForbiddenException('Cannot suspend a super admin');

    return this.prisma.user.update({
      where: { id: userId },
      data: { status: 'SUSPENDED' },
    });
  }

  async activateUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
    });
  }
}
