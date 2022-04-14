import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { GetUserResponseDto } from './dto/get-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiCreatedResponse({
    type: GetUserResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get(':id/rank/:guildId')
  getRank(@Param('id') id: string, @Param('guildId') guildId: string) {
    return this.usersService.getRank(id, guildId);
  }

  @Get(':id/global-xp')
  getGlobalXP(@Param('id') id: string) {
    return this.usersService.getGlobalXP(id);
  }
}
