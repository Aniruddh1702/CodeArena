import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { QuestionDifficulty, QuestionStatus, UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new question (Teachers & Admins)' })
  async create(@Body() data: any, @CurrentUser('id') userId: string) {
      const result = await this.questionsService.create(data, userId);
      return { success: true, data: result };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a question (Teachers & Admins)' })
  async update(@Param('id') id: string, @Body() data: any) {
      const result = await this.questionsService.update(id, data);
      return { success: true, data: result };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a question (Teachers & Admins)' })
  async remove(@Param('id') id: string) {
      await this.questionsService.delete(id);
      return { success: true, message: 'Question deleted' };
  }

  @Get()
  @ApiOperation({ summary: 'List published questions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'difficulty', required: false, enum: QuestionDifficulty })
  @ApiQuery({ name: 'topic', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('difficulty') difficulty?: QuestionDifficulty,
    @Query('topic') topic?: string,
    @Query('search') search?: string,
  ) {
    const p = page ? parseInt(String(page), 10) : 1;
    const ps = pageSize ? parseInt(String(pageSize), 10) : 20;
    const result = await this.questionsService.findAll({
      page: isNaN(p) ? 1 : p,
      pageSize: isNaN(ps) ? 20 : ps,
      difficulty,
      topic,
      search,
      status: QuestionStatus.PUBLISHED,
    });
    return { success: true, data: result };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get question details by slug' })
  async findOne(@Param('slug') slug: string) {
    const question = await this.questionsService.findBySlug(slug);
    return { success: true, data: question };
  }
}

