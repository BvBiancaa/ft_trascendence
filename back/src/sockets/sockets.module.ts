import { Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { SocketsGateway } from './sockets.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SocketsGateway, SocketsService],
  imports: [PrismaModule],
})
export class SocketsModule {}
