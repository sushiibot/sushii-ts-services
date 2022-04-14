import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Logger } from '@nestjs/common';
import {
  fromStoredUserModel,
  fromTransportUserModel,
  getDefaultTransportUserModel,
  TransportUserModel,
} from './entities/user.entity';
import {
  fromStoredUserLevelRankedModel,
  getDefaultTransportUserLevelRankedModel,
  TransportUserLevelRankedModel,
  UserLevelRankedModelType,
} from './entities/userRank.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<TransportUserModel> {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(id) },
    });

    if (!user) {
      return getDefaultTransportUserModel(id);
    }

    return fromStoredUserModel.parse(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    if (updateUserDto.id.toString() !== id) {
      throw new HttpException('ID cannot be changed', HttpStatus.BAD_REQUEST);
    }

    // Converts string config to prisma config
    const updatedUserStrict = fromTransportUserModel.safeParse(updateUserDto);

    if (!updatedUserStrict.success) {
      this.logger.warn(updatedUserStrict.error, 'failed to parse user');

      throw new HttpException(
        'Invalid user update data',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.user.upsert({
      where: { id: updatedUserStrict.data.id },
      update: updatedUserStrict.data,
      create: updatedUserStrict.data,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async getRank(
    id: string,
    guildId: string,
  ): Promise<TransportUserLevelRankedModel> {
    // Tagged template is safe from SQL injections
    const level = await this.prisma.$queryRaw<UserLevelRankedModelType[]>`
      SELECT user_id as userId,
             guild_id as guildId,
             msg_all_time as msgAllTime,
             msg_month as msgMonth,
             msg_week as msgWeek,
             msg_day as msgDay,
             last_msg as lastMsg,
             msg_all_time_rank as msgAllTimeRank,
             msg_all_time_total as msgAllTimeTotal,
             msg_month_rank as msgMonthRank,
             msg_month_total as msgMonthTotal,
             msg_week_rank as msgWeekRank,
             msg_week_total as msgWeekTotal,
             msg_day_rank as msgDayRank,
             msg_day_total as msgDayTotal
         FROM (
             SELECT *,
                 ROW_NUMBER() OVER(
                     PARTITION BY EXTRACT(DOY FROM last_msg),
                                   EXTRACT(YEAR FROM last_msg)
                                   ORDER BY msg_day DESC
                 ) AS msg_day_rank,
                 (
                     SELECT COUNT(*)
                       FROM app_public.user_levels
                       WHERE extract(DOY  from last_msg) = extract(DOY  from now())
                         AND extract(YEAR from last_msg) = extract(YEAR from now())
                         AND guild_id = $1
                 ) AS msg_day_total,
                 ROW_NUMBER() OVER(
                     PARTITION BY EXTRACT(WEEK FROM last_msg),
                                   EXTRACT(YEAR FROM last_msg)
                                   ORDER BY msg_week DESC
                 ) AS msg_week_rank,
                 (
                     SELECT COUNT(*)
                       FROM app_public.user_levels
                       WHERE extract(WEEK from last_msg) = extract(WEEK from now())
                         AND extract(YEAR from last_msg) = extract(YEAR from now())
                         AND guild_id = $1
                 ) AS msg_week_total,
                 ROW_NUMBER() OVER(
                     PARTITION BY EXTRACT(MONTH FROM last_msg),
                                   EXTRACT(YEAR FROM last_msg)
                                   ORDER BY msg_month DESC
                 ) AS msg_month_rank,
                 (
                     SELECT COUNT(*)
                       FROM app_public.user_levels
                       WHERE extract(MONTH from last_msg) = extract(MONTH from now())
                         AND extract(YEAR  from last_msg) = extract(YEAR  from now())
                         AND guild_id = ${guildId}
                 ) AS msg_month_total,
                 ROW_NUMBER() OVER(ORDER BY msg_all_time DESC) AS msg_all_time_rank,
                 COUNT(*) OVER() AS msg_all_time_total
             FROM app_public.user_levels WHERE guild_id = ${guildId}
         ) t
      WHERE t.user_id = ${id}`;

    if (!level) {
      return getDefaultTransportUserLevelRankedModel(id, guildId);
    }

    return fromStoredUserLevelRankedModel.parse(level);
  }

  async getGlobalXP(id: string): Promise<string> {
    const res = await this.prisma.userLevel.aggregate({
      _sum: {
        msgAllTime: true,
      },
      where: {
        userId: BigInt(id),
      },
    });

    if (!res._sum.msgAllTime) {
      return '0';
    }

    return res._sum.msgAllTime.toString();
  }
}
