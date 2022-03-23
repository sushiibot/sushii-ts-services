import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from 'src/redis/redis.module';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, RedisModule, PrismaModule],
  controllers: [HealthController],
})
export class HealthModule {}
