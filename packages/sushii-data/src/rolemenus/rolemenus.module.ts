import { Module } from '@nestjs/common';
import { RolemenusService } from './rolemenus.service';
import { RolemenusController } from './rolemenus.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RolemenusController],
  providers: [RolemenusService],
})
export class RolemenusModule {}
