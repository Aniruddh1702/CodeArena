import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    listUsers: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    getPublicProfile: jest.fn().mockResolvedValue({ username: 'testuser' }),
    updateProfile: jest.fn().mockResolvedValue({ id: 'user-1' }),
    suspendUser: jest.fn().mockResolvedValue({ id: 'user-2', status: 'SUSPENDED' }),
    activateUser: jest.fn().mockResolvedValue({ id: 'user-2', status: 'ACTIVE' }),
    clearAllUsers: jest.fn().mockResolvedValue({ count: 10 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listAllUsersAdmin', () => {
    it('should query users service with parsed page and pageSize', async () => {
      const res = await controller.listAllUsersAdmin(UserRole.STUDENT, 'alice', '2', '25');
      expect(mockUsersService.listUsers).toHaveBeenCalledWith({
        role: UserRole.STUDENT,
        search: 'alice',
        page: 2,
        pageSize: 25,
      });
      expect(res.success).toBe(true);
    });
  });

  describe('clearAllUsers security', () => {
    it('should throw ForbiddenException if confirmation token is missing', async () => {
      await expect(controller.clearAllUsers(undefined)).rejects.toThrow(ForbiddenException);
      expect(mockUsersService.clearAllUsers).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if confirmation token is incorrect', async () => {
      await expect(controller.clearAllUsers('WRONG_TOKEN')).rejects.toThrow(ForbiddenException);
      expect(mockUsersService.clearAllUsers).not.toHaveBeenCalled();
    });

    it('should execute clearAllUsers when confirm=PERMANENT_WIPE is provided in test environment', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';
      const res = await controller.clearAllUsers('PERMANENT_WIPE');
      expect(res.success).toBe(true);
      expect(mockUsersService.clearAllUsers).toHaveBeenCalled();
      process.env.NODE_ENV = originalEnv;
    });

    it('should permanently reject clearAllUsers in production even with confirm=PERMANENT_WIPE', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      await expect(controller.clearAllUsers('PERMANENT_WIPE')).rejects.toThrow(ForbiddenException);
      process.env.NODE_ENV = originalEnv;
    });
  });
});
