import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Submissions')
@Controller('submissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit code for evaluation' })
  async submitCode(
    @CurrentUser('id') userId: string,
    @Body('questionId') questionId: string,
    @Body('language') language: string,
    @Body('code') code: string,
  ) {
    const submission = await this.submissionsService.submitCode(userId, questionId, language, code);
    return { success: true, data: submission };
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user submissions' })
  async getMySubmissions(
    @CurrentUser('id') userId: string,
    @Query('questionId') questionId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const p = page ? parseInt(String(page), 10) : 1;
    const ps = pageSize ? parseInt(String(pageSize), 10) : 20;
    const result = await this.submissionsService.getUserSubmissions(
      userId,
      questionId,
      isNaN(p) ? 1 : p,
      isNaN(ps) ? 20 : ps
    );
    return { success: true, data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get submission status by ID' })
  async getSubmissionStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    const submission = await this.submissionsService.getSubmissionStatus(id, userId);
    return { success: true, data: submission };
  }
}
