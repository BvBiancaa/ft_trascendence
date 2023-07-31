import { Module } from '@nestjs/common';
import { Api42Service } from './api42.service';
import { Api42Controller } from './api42.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [Api42Controller],
  providers: [Api42Service],
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
})
export class Api42Module {}
