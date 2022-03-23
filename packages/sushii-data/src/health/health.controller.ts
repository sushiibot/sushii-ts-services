import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { PrismaHealthIndicator } from '../prisma/prisma.health';
import { RedisHealthIndicator } from '../redis/redis.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prisma.isHealthy('prisma'),
      () => this.redis.isHealthy('redis'),
    ]);
  }
}
