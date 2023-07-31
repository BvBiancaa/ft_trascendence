import { Module } from '@nestjs/common';
import { UsrsService } from './usrs.service';
import { UsrsController } from './usrs.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsrsController],
  providers: [UsrsService],
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
})
export class UsrsModule {}
