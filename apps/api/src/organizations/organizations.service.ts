import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: { page?: number; pageSize?: number }) {
    const validPage = Math.max(1, Number(options.page) || 1);
    const validPageSize = Math.max(1, Math.min(100, Number(options.pageSize) || 20));
    const skip = (validPage - 1) * validPageSize;

    try {
      const [items, total] = await Promise.all([
        this.prisma.organization.findMany({
          where: { isActive: true },
          skip,
          take: validPageSize,
          orderBy: { name: 'asc' },
        }),
        this.prisma.organization.count({ where: { isActive: true } }),
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

  async findBySlug(slug: string) {
    const org = await this.prisma.organization.findUnique({
      where: { slug },
    });

    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }
}
