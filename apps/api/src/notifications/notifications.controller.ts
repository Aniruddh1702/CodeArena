import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notifService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  async getUserNotifications(
      @CurrentUser('id') userId: string,
      @Query('page') page?: string,
      @Query('pageSize') pageSize?: string
  ) {
      const p = page ? parseInt(String(page), 10) : 1;
      const ps = pageSize ? parseInt(String(pageSize), 10) : 20;
      const result = await this.notifService.getUserNotifications(
        userId,
        isNaN(p) ? 1 : p,
        isNaN(ps) ? 20 : ps
      );
      return { success: true, data: result };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  async markAsRead(@Param('id') id: string, @CurrentUser('id') userId: string) {
      await this.notifService.markAsRead(id, userId);
      return { success: true, message: 'Notification marked as read' };
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@CurrentUser('id') userId: string) {
      await this.notifService.markAllAsRead(userId);
      return { success: true, message: 'All notifications marked as read' };
  }
}
