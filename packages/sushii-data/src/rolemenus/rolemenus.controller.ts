import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolemenusService } from './rolemenus.service';
import { CreateRolemenuDto } from './dto/create-rolemenu.dto';
import { UpdateRolemenuDto } from './dto/update-rolemenu.dto';

@Controller('rolemenus')
export class RolemenusController {
  constructor(private readonly rolemenusService: RolemenusService) {}

  @Post()
  create(@Body() createRolemenuDto: CreateRolemenuDto) {
    return this.rolemenusService.create(createRolemenuDto);
  }

  @Get(':channelId/:userId')
  findOne(
    @Param('channelId') channelId: string,
    @Param('userId') userId: string,
  ) {
    return this.rolemenusService.findOne(channelId, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRolemenuDto: UpdateRolemenuDto,
  ) {
    return this.rolemenusService.update(+id, updateRolemenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolemenusService.remove(+id);
  }
}
