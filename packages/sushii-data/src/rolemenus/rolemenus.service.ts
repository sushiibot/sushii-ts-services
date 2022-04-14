import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRolemenuDto } from './dto/create-rolemenu.dto';
import { UpdateRolemenuDto } from './dto/update-rolemenu.dto';
import {
  modelToRoleMenuTransport,
  RoleMenuTransport,
  transportToRoleMenuModel,
} from './entities/rolemenu.entity';

@Injectable()
export class RolemenusService {
  constructor(private prisma: PrismaService) {}

  async create(createRolemenuDto: CreateRolemenuDto): Promise<void> {
    const input = transportToRoleMenuModel.parse(createRolemenuDto);

    await this.prisma.roleMenu.create({
      data: input,
    });
  }

  async findOne(
    channelId: string,
    userId: string,
  ): Promise<RoleMenuTransport | null> {
    const res = this.prisma.roleMenu.findFirst({
      where: {
        channelId: BigInt(channelId),
        editorId: BigInt(userId),
      },
    });

    if (!res) {
      return null;
    }

    return modelToRoleMenuTransport.parse(res);
  }

  update(id: string, updateRolemenuDto: UpdateRolemenuDto) {
    return `This action updates a #${id} rolemenu`;
  }

  remove(id: string) {
    return `This action removes a #${id} rolemenu`;
  }
}
