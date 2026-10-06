import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'List active organizations' })
  async findAll(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
      const p = page ? parseInt(String(page), 10) : 1;
      const ps = pageSize ? parseInt(String(pageSize), 10) : 20;
      const result = await this.orgService.findAll({
        page: isNaN(p) ? 1 : p,
        pageSize: isNaN(ps) ? 20 : ps,
      });
      return { success: true, data: result };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get organization details' })
  async findOne(@Param('slug') slug: string) {
      const result = await this.orgService.findBySlug(slug);
      return { success: true, data: result };
  }
}
