import { Controller, Get, Post, Delete, Patch, Param, Query, Body, UseGuards, Headers, Req, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORGANIZATION_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all platform users for Admin Panel' })
  async listAllUsersAdmin(
    @Query('role') role?: UserRole,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const p = page ? parseInt(String(page), 10) : 1;
    const ps = pageSize ? parseInt(String(pageSize), 10) : 1000;
    const result = await this.usersService.listUsers({
      role,
      search,
      page: isNaN(p) ? 1 : p,
      pageSize: isNaN(ps) ? 1000 : ps,
    });
    return { success: true, data: result };
  }

  @Get('profile/:username')
  @ApiOperation({ summary: 'Get public user profile' })
  async getPublicProfile(@Param('username') username: string) {
    const profile = await this.usersService.getPublicProfile(username);
    return { success: true, data: profile };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own profile' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() data: { firstName?: string; lastName?: string; bio?: string; isPublicProfile?: boolean },
  ) {
    const profile = await this.usersService.updateProfile(userId, data);
    return { success: true, data: profile };
  }

  @Get()
  @ApiOperation({ summary: 'List users' })
  async listUsers(
    @Query('role') role?: UserRole,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const p = page ? parseInt(String(page), 10) : 1;
    const ps = pageSize ? parseInt(String(pageSize), 10) : 1000;
    const result = await this.usersService.listUsers({
      role,
      search,
      page: isNaN(p) ? 1 : p,
      pageSize: isNaN(ps) ? 1000 : ps,
    });
    return { success: true, data: result };
  }

  @Patch(':id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORGANIZATION_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend a user (admin only)' })
  async suspendUser(@Param('id') id: string, @CurrentUser('id') adminId: string) {
    await this.usersService.suspendUser(id, adminId || 'admin');
    return { success: true, message: 'User suspended' };
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORGANIZATION_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a user (admin only)' })
  async activateUser(@Param('id') id: string) {
    await this.usersService.activateUser(id);
    return { success: true, message: 'User activated' };
  }

  @Delete('clear-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear all users from database (Super Admin only)' })
  async clearAllUsers(@Query('confirm') confirm?: string) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Database reset is permanently disabled in production');
    }
    if (confirm !== 'PERMANENT_WIPE') {
      throw new ForbiddenException('Dangerous operation: confirm=PERMANENT_WIPE query parameter is required');
    }
    const result = await this.usersService.clearAllUsers();
    return { success: true, message: 'All users cleared successfully', result };
  }

  @Post('clear-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear all users from database (Super Admin only)' })
  async clearAllUsersPost(@Query('confirm') confirm?: string) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Database reset is permanently disabled in production');
    }
    if (confirm !== 'PERMANENT_WIPE') {
      throw new ForbiddenException('Dangerous operation: confirm=PERMANENT_WIPE query parameter is required');
    }
    const result = await this.usersService.clearAllUsers();
    return { success: true, message: 'All users cleared successfully', result };
  }
}
