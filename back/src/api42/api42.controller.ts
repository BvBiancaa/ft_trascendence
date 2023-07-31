import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Api42Service } from './api42.service';
import { CreateApi42Dto } from './dto/create-api42.dto';
import { UpdateApi42Dto } from './dto/update-api42.dto';
import { LoginGuard } from '../login/login.guard';

@Controller('api42')
export class Api42Controller {
  constructor(private readonly api42Service: Api42Service) {}

  @UseGuards(LoginGuard)
  @Get('/:uid')
  findActive(@Param('uid') uid: string) {
    return this.api42Service.findActive(+uid);
  }
}
