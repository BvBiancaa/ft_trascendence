import { Controller, Get, Req, Res } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get()
  async doLogin(@Req() req, @Res() res) {
    await this.loginService.login(req, res);
    return;
  }
}
