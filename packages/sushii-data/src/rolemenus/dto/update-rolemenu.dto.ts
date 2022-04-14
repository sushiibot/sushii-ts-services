import { PartialType } from '@nestjs/swagger';
import { CreateRolemenuDto } from './create-rolemenu.dto';

export class UpdateRolemenuDto extends PartialType(CreateRolemenuDto) {}
