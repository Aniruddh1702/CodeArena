import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TestsService } from './tests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Tests')
@Controller('tests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming tests assigned to the user' })
  async getUpcoming(@CurrentUser('id') userId: string) {
    const tests = await this.testsService.getUpcomingTests(userId);
    return { success: true, data: tests };
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recently completed assessments' })
  async getRecent(@CurrentUser('id') userId: string) {
      const tests = await this.testsService.getRecentAssessments(userId);
      return { success: true, data: tests };
  }
}
