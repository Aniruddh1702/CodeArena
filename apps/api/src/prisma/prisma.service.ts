import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connected to database successfully');
    } catch (err: any) {
      console.warn('⚠️ Initial database connection delayed or pending:', err.message);
      this.retryConnect(1);
    }
  }

  private retryConnect(attempt: number) {
    if (attempt > 6) {
      console.error('❌ Database connection failed after multiple retries.');
      return;
    }
    const delay = Math.min(1000 * Math.pow(2, attempt), 15000);
    setTimeout(async () => {
      try {
        await this.$connect();
        console.log(`✅ Database connection established on retry attempt ${attempt}`);
      } catch (err: any) {
        this.retryConnect(attempt + 1);
      }
    }, delay);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
