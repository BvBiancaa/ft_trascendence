import { Injectable } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { quarantadueAuthHandler } from 'src/services/session.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { generate } from 'generate-password';
import * as bcrypt from 'bcrypt';
import { CreateUsrDto } from 'src/usrs/dto/create-usr.dto';

export const hashing = 10;
@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(req, res) {
    const pwd = generate({
      length: 10,
      symbols: true,
      numbers: true,
      uppercase: true,
      lowercase: true,
      strict: true,
    });
    const hashedPassword = await bcrypt.hash(pwd, hashing);
    const userData = await quarantadueAuthHandler(req, res);
    let newUser: CreateLoginDto = {
      uid: userData.id,
      email: userData.email,
      name: userData.first_name,
      image: userData.image.link,
      login: userData.login,
      displayName: userData.displayname,
      token42: userData.token42,
      nickName: userData.login,
      friends: [],
      password: hashedPassword,
      blockedUsrs: [],
      twoFaActive: false,
      twoFaSecret: '',
      isNew: true,
    };
    const userExists = await this.prisma.user.count({
      where: { uid: newUser.uid },
    });
    if (!userExists) {
      newUser = await this.prisma.user.create({ data: newUser });
    } else {
      newUser = await this.prisma.user.update({
        where: { uid: newUser.uid },
        data: { token42: userData.token42, password: hashedPassword },
      });
      if (newUser.twoFaActive == true) {
        const baseUrl = process.env.FRONT_BASE_URL; //cambia a scuola
        const redirectUrl = `${baseUrl}/?tfa=true&email=${newUser.email}&ablm=${pwd}`;
        return res.redirect(redirectUrl);
      }
    }
    const payload = { sub: newUser.id, username: newUser.login };
    const baseUrl = process.env.FRONT_BASE_URL; //cambia a scuola
    const token = await this.jwtService.signAsync(payload);

    const redirectUrl = `${baseUrl}/?token=${token}&id=${newUser.id}`;
    return res.redirect(redirectUrl);
  }
}
