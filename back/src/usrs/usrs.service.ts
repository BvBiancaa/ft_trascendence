import { Injectable } from '@nestjs/common';
import { UpdateUsrDto } from './dto/update-usr.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateLoginDto } from 'src/login/dto/create-login.dto';
import { UpdateLoginDto } from 'src/login/dto/update-login.dto';
import { authenticator } from 'otplib';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { toDataURL } from 'qrcode';

export const hashing = 10;

@Injectable()
export class UsrsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(updateUsrDto: UpdateLoginDto) {
    const hashedPassword = await bcrypt.hash(updateUsrDto.password, hashing);
    let createUsrDto: CreateLoginDto = {
      email: updateUsrDto.email,
      name: updateUsrDto.login,
      image: process.env.SELF_URL + '/public/avatars/defaultuser.png',
      login: updateUsrDto.login,
      displayName: updateUsrDto.login,
      token42: '',
      nickName: updateUsrDto.login,
      friends: [],
      password: hashedPassword,
      blockedUsrs: [],
      twoFaActive: false,
      twoFaSecret: '',
      isNew: true,
    };
    return this.prisma.user.create({ data: createUsrDto });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUsr(id: number, updateUsrDto: UpdateUsrDto) {
    if (updateUsrDto.password) {
      updateUsrDto.password = await bcrypt.hash(updateUsrDto.password, hashing);
    }
    const update = await this.prisma.user.update({
      where: { id: id },
      data: updateUsrDto,
    });
    return update;
  }

  async auth(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    if (user.twoFaActive == true) {
      throw new UnauthorizedException('2faNeeded');
    }
    const payload = { sub: user.id, username: user.login };
    const token = await this.jwtService.signAsync(payload);
    return { accessToken: token };
  }

  async auth2fa(email: string, password: string, twofacode: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const isCodeValid = await this.isTwoFactorAuthenticationCodeValid(
      twofacode,
      user.id,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid 2faCode');
    }
    const payload = { sub: user.id, username: user.login };
    const token = await this.jwtService.signAsync(payload);
    return { accessToken: token };
  }

  async generateTwoFactorAuthenticationSecret(id: number, email: string) {
    const secret = authenticator.generateSecret();

    const otpAuthUrl = authenticator.keyuri(email, 'TRASCENDENCE', secret);

    await this.updateUsr(id, { twoFaSecret: secret });

    return { secret, otpAuthUrl };
  }

  async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    id: any,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFaSecret,
    });
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return await toDataURL(otpAuthUrl);
  }

  async getMatchesByUserId(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        matches: true, // Includi tutti i match dell'utente
      },
    });

    return user.matches;
  }

  async getUsrNick(id: number) {
    const usr = await this.prisma.user.findUnique({ where: { id } });
    return usr.nickName;
  }

  async getStats(id: number) {
    const matches = await this.getMatchesByUserId(id);
    const gamePlayed = matches.length;
    let won = 0;
    let lost = 0;
    let elo = 100;
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].won == true) {
        won++;
        elo += 3;
      } else {
        lost++;
        elo -= 3;
      }
    }
    return { played: gamePlayed, won: won, lost: lost, elo: elo };
  }
}
