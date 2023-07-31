import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LoginModule } from './login/login.module';
// import { MessagesModule } from './messages/messages.module';
import { Api42Module } from './api42/api42.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsrsModule } from './usrs/usrs.module';
import { SocketsModule } from './sockets/sockets.module';

@Module({
  imports: [
    PrismaModule,
    LoginModule,
    // MessagesModule,
    Api42Module,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'public'),
      serveRoot: '/public',
    }),
    UsrsModule,
    SocketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
