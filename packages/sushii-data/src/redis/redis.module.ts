import { Module } from '@nestjs/common';
import { RedisHealthIndicator } from './redis.health';
import { RedisService } from './redis.service';

@Module({
  providers: [RedisService, RedisHealthIndicator],
  exports: [RedisService, RedisHealthIndicator],
})
export class RedisModule {}
