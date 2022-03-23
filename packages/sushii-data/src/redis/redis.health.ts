import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { RedisService } from './redis.service';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.redisService.client.ping();
      return this.getStatus(key, true);
    } catch (e) {
      throw new HealthCheckError('Redis check failed', e);
    }
  }
}
