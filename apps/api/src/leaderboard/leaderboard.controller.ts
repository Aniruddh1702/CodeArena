import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';

@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('global')
  @ApiOperation({ summary: 'Get global leaderboard' })
  async getGlobalLeaderboard(
      @Query('page') page?: string,
      @Query('pageSize') pageSize?: string
  ) {
      const p = page ? parseInt(page, 10) : 1;
      const ps = pageSize ? parseInt(pageSize, 10) : 50;
      const result = await this.leaderboardService.getGlobalLeaderboard(p, ps);
      return { success: true, data: result };
  }
}
