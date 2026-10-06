import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('student-dashboard')
  @ApiOperation({ summary: 'Get student dashboard data' })
  async getStudentDashboard(@CurrentUser('id') userId: string) {
    const data = await this.analyticsService.getStudentDashboard(userId);
    return { success: true, data };
  }
}
