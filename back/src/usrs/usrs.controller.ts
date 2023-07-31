import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  UploadedFile,
  ValidationPipe,
  UsePipes,
  createParamDecorator,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { UsrsService } from './usrs.service';
import { UpdateUsrDto } from './dto/update-usr.dto';
import { LoginGuard } from 'src/login/login.guard';
import { UsrEntity } from './entities/usr.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, ExecutionContext } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateLoginDto } from 'src/login/dto/update-login.dto';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { Response } from 'express';

const FileValidator = createParamDecorator(
  (allowedExtensions: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const file: Express.Multer.File = request.file;

    if (file) {
      const extension = extname(file.originalname);
      if (!allowedExtensions.includes(extension.toLowerCase())) {
        throw new Error('Invalid file extension');
      }
    }

    return file;
  },
);

export function MaxFileSize(
  maxSize: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'maxFileSize',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: any) {
          if (value && value.size) {
            return value.size <= maxSize;
          }
          return true;
        },
        defaultMessage(args: any) {
          return `The file exceeds the maximum allowed size of ${maxSize} bytes.`;
        },
      },
    });
  };
}

@Controller('usrs')
export class UsrsController {
  constructor(private readonly usrsService: UsrsService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() createLoginDto: UpdateLoginDto) {
    const pippo = await this.usrsService.create(createLoginDto);

    return new UsrEntity(pippo);
  }

  @Post('/login')
  async login(@Body() { email, password }) {
    const usr = await this.usrsService.auth(email, password);
    return usr;
  }

  @Post('login2fa')
  async login2fa(@Body() { email, password, twofacode }) {
    return await this.usrsService.auth2fa(email, password, twofacode);
  }

  @UseGuards(LoginGuard)
  @Get('/getusers')
  async findAll() {
    return (await this.usrsService.findAll()).map(
      (user) => new UsrEntity(user),
    );
  }

  @UseGuards(LoginGuard)
  @Get('/getself')
  async findSelf(@Req() req: any) {
    const userId = req.user.sub;
    const user = await this.usrsService.findOne(userId);
    return new UsrEntity(user);
  }

  @UseGuards(LoginGuard)
  @Get('/getuser/:id')
  async findOne(@Param('id') id: number) {
    const user = await this.usrsService.findOne(+id);
    return new UsrEntity(user);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(LoginGuard)
  @Patch('/changenick')
  async update(@Body() newNick: any, @Req() req: any) {
    const userId: number = req.user.sub;
    const updated = await this.usrsService.updateUsr(userId, newNick);
    return new UsrEntity(updated);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(LoginGuard)
  @Patch('/update')
  async updateUsr(@Body() data: any, @Req() req: any) {
    const userId: number = req.user.sub;
    const updated = await this.usrsService.updateUsr(userId, data);
    return new UsrEntity(updated);
  }

  @UseGuards(LoginGuard)
  @Post('/img')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/public/avatars',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile()
    @FileValidator(['.jpg', '.jpeg', '.png'])
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    const newFilePath: string = process.env.SELF_URL + file.path.slice(3);

    const updatedData: UpdateUsrDto = { image: newFilePath };
    const userId: number = req.user.sub;
    const updated = await this.usrsService.updateUsr(userId, updatedData);
    return new UsrEntity(updated);
  }

  @Post('generate2fa')
  @UseGuards(LoginGuard)
  async register(@Res() response: Response, @Req() request) {
    const { otpAuthUrl } =
      await this.usrsService.generateTwoFactorAuthenticationSecret(
        request.user.sub,
        request.email,
      );

    response.json(await this.usrsService.generateQrCodeDataURL(otpAuthUrl));
    return;
  }

  @UseGuards(LoginGuard)
  @Post('2faOn')
  async turnOnTwoFactorAuthentication(@Req() req, @Body() body) {
    const isCodeValid =
      await this.usrsService.isTwoFactorAuthenticationCodeValid(
        body.twoFactorAuthenticationCode,
        req.user.sub,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usrsService.updateUsr(req.user.sub, { twoFaActive: true });
  }

  @UseGuards(LoginGuard)
  @Get('/getMatches/:id')
  async getMatches(@Param('id') id: number) {
    const matches = await this.usrsService.getMatchesByUserId(+id);
    const resp = [];
    for (let i = 0; i < matches.length; i++) {
      const nick = await this.usrsService.getUsrNick(matches[i].otherPlayerId);
      resp.push({ nick: nick, ...matches[i] });
    }
    return resp;
  }

  @UseGuards(LoginGuard)
  @Get('/getStats/:id')
  async getStats(@Param('id') id) {
    const stats = await this.usrsService.getStats(+id);
    return stats;
  }
}
