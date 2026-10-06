import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getUserNotifications(userId: string, page: number = 1, pageSize: number = 20) {
      const validPage = Math.max(1, Number(page) || 1);
      const validPageSize = Math.max(1, Math.min(100, Number(pageSize) || 20));
      const skip = (validPage - 1) * validPageSize;

      try {
        const [items, total] = await Promise.all([
            this.prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: validPageSize,
            }),
            this.prisma.notification.count({ where: { userId } })
        ]);

        const unreadCount = await this.prisma.notification.count({
            where: { userId, read: false }
        });

        return {
            items,
            total,
            unreadCount,
            page: validPage,
            pageSize: validPageSize,
            totalPages: Math.ceil(total / validPageSize)
        };
      } catch (e) {
        return {
            items: [],
            total: 0,
            unreadCount: 0,
            page: validPage,
            pageSize: validPageSize,
            totalPages: 0
        };
      }
  }

  async markAsRead(id: string, userId: string) {
      const notification = await this.prisma.notification.findUnique({ where: { id }});
      if(!notification || notification.userId !== userId) throw new NotFoundException('Notification not found');

      return this.prisma.notification.update({
          where: { id },
          data: { read: true }
      });
  }

  async markAllAsRead(userId: string) {
      return this.prisma.notification.updateMany({
          where: { userId, read: false },
          data: { read: true }
      });
  }
}
