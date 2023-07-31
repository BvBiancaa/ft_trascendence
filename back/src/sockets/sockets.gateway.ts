import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

import { Body } from '@nestjs/common';
import { Message } from '../interfaces_back';
import { generate } from 'generate-password';
import { CreateMessageDto } from './dto/create-msg-dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketsGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly socketsService: SocketsService,
    private jwtService: JwtService,
  ) {}

  //QUANDO CLIENT SI CONNETTE LO AGGIUNGO AI CLIENT CONNESSI E MANDO A TUTTI LISTA CLIENT CONNESSI AGGIORNATA

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token;
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const onlineUsers = await this.socketsService.addUsr(payload.sub);
      this.server.emit('whosonline', onlineUsers);
    } catch (error) {
      socket.emit('error', { message: 'you need to login' });
      socket.disconnect();
    }
    return;
  }

  //QUANDO CLIENT SI DISCONNETTE LO RIMUOVO DA TUTTI I CANALI E MANDO A TUTTI LISTA USRS E CANALI AGGIORNATA

  async handleDisconnect(client: Socket) {
    const { users, channels, changedChans, gameRoomName } =
      await this.socketsService.removeUsr(client.handshake.auth.id);
    this.server.emit('whosonline', users);
    this.server.emit('chanlist', channels);
    changedChans.map((chan) => {
      this.leaveChan(chan.name, client);
    });
    if (gameRoomName != '') {
      client.leave(gameRoomName);
      this.server.to(gameRoomName).emit('clientDisconnected');
    }

    return;
  }

  //CHAT

  @SubscribeMessage('chanlist')
  sendChan() {
    const chans = this.socketsService.returnChans();

    this.server.emit('chanlist', chans);
    return;
  }

  @SubscribeMessage('join')
  async joinChan(@MessageBody() body, @ConnectedSocket() client: Socket) {
    const chans = await this.socketsService.createOrJoinChan(
      body,
      client.handshake.auth.id,
    );

    if (chans === 'banned') {
      client.emit('bannedFromChan', {
        chan: body,
      });
      return;
    }
    if (chans === 'private') {
      client.emit('chanIsPrivate', { chan: body });
    }
    if (chans === 'protected') {
      client.emit('chanIsProtected', { chan: body });
    }
    client.join(body);
    client.emit(
      'joinedChannels',
      this.socketsService.findJoinedChan(client.handshake.auth.id),
    );
    const { users, ops, banned, muted } =
      this.socketsService.getChanUsrList(body);
    this.server.to(body).emit('userlist', {
      name: body,
      list: users,
      ops: ops,
      banned: banned,
      muted: muted,
    });
    this.server.emit('chanlist', chans);
    return;
  }

  @SubscribeMessage('leave')
  async leaveChan(@MessageBody() body, @ConnectedSocket() client: Socket) {
    const chans = await this.socketsService.leaveChan(
      body,
      client.handshake.auth.id,
    );
    const { users, ops, banned, muted } =
      this.socketsService.getChanUsrList(body);

    if (users.length > 0) {
      this.server.to(body).emit('userlist', {
        name: body,
        list: users,
        ops: ops,
        banned: banned,
        muted: muted,
      });
    }
    client.leave(body);

    client.emit(
      'joinedChannels',
      this.socketsService.findJoinedChan(client.handshake.auth.id),
    );
    this.server.emit('chanlist', chans);
    return;
  }

  @SubscribeMessage('kickUsr')
  async kickUsr(@ConnectedSocket() client: Socket, @Body() details: any) {
    const sockets = await this.server.in(details.name).fetchSockets();
    const kicked = sockets.find(
      (sock) => sock.handshake.auth.id == details.user,
    );
    const currentChan = this.socketsService.findChan(details.name);

    if (
      currentChan.ops.find((usr) => usr.id == client.handshake.auth.id) !=
      undefined
    ) {
      const kickato = this.socketsService.getClientName(details.user);
      const { users, ops, banned, muted } = this.socketsService.kickUsr(
        details.name,
        details.user,
        client.handshake.auth.id,
      );
      kicked.emit('kicked', { chan: details.name, from: details.from });
      kicked.leave(details.name);
      const kicker = this.socketsService.getClientName(details.from);

      this.server.to(details.name).emit('chanMsg', {
        user: 'SERVER',
        chan: details.name,
        timestamp: new Date(),
        msg: `user ${kicker} kicked ${kickato}`,
        senderId: 0,
      });
      this.server.to(details.name).emit('userlist', {
        name: details.name,
        list: users,
        ops: ops,
        banned: banned,
        muted: muted,
      });
    }
  }

  @SubscribeMessage('banUsr')
  async banUsr(@ConnectedSocket() client: Socket, @Body() details: any) {
    const sockets = await this.server.in(details.name).fetchSockets();
    const bannedUsr = sockets.find(
      (sock) => sock.handshake.auth.id == details.user,
    );
    const currentChan = this.socketsService.findChan(details.name);
    if (
      currentChan.ops.find((usr) => usr.id == client.handshake.auth.id) !=
      undefined
    ) {
      const bannato = this.socketsService.getClientName(details.user);
      const { users, ops, banned, muted } = this.socketsService.banUsr(
        details.name,
        details.user,
        client.handshake.auth.id,
      );
      bannedUsr.emit('banned', { chan: details.name, from: details.from });
      bannedUsr.leave(details.name);
      const banner = this.socketsService.getClientName(details.from);

      this.server.to(details.name).emit('chanMsg', {
        user: 'SERVER',
        chan: details.name,
        timestamp: new Date(),
        msg: `user ${banner} banned ${bannato}`,
      });
      this.server.to(details.name).emit('userlist', {
        name: details.name,
        list: users,
        ops: ops,
        banned: banned,
        muted: muted,
      });
    }
  }

  @SubscribeMessage('unBanUsr')
  async unBanUsr(@ConnectedSocket() client: Socket, @Body() details: any) {
    const sockets = await this.server.in(details.name).fetchSockets();
    const usrToUnban = sockets.find(
      (sock) => sock.handshake.auth.id == details.user,
    );
    const currentChan = this.socketsService.findChan(details.name);
    if (
      currentChan.ops.find((usr) => usr.id == client.handshake.auth.id) !=
      undefined
    ) {
      const sbannato = this.socketsService.getClientName(details.user);
      const { users, ops, banned, muted } = this.socketsService.unBanUsr(
        details.name,
        details.user,
      );
      const unbanner = this.socketsService.getClientName(details.from);

      this.server.to(details.name).emit('chanMsg', {
        user: 'SERVER',
        chan: details.name,
        timestamp: new Date(),
        msg: `user ${unbanner} unbanned ${sbannato}`,
        senderId: 0,
      });
      this.server.to(details.name).emit('userlist', {
        name: details.name,
        list: users,
        ops: ops,
        banned: banned,
        muted: muted,
      });
    }
  }

  @SubscribeMessage('opUsr')
  async opUsr(@ConnectedSocket() client: Socket, @Body() details: any) {
    const sockets = await this.server.in(details.name).fetchSockets();
    const currentChan = this.socketsService.findChan(details.name);
    if (
      currentChan.ops.find((usr) => usr.id == client.handshake.auth.id) !=
      undefined
    ) {
      const oppato = this.socketsService.getClientName(details.user);
      const { users, ops, banned, muted } = this.socketsService.opUsr(
        details.name,
        details.user,
      );
      if (!users || !ops) {
        return;
      }
      const oper = this.socketsService.getClientName(details.from);

      this.server.to(details.name).emit('chanMsg', {
        user: 'SERVER',
        chan: details.name,
        timestamp: new Date(),
        msg: `user ${oper} made ${oppato} op in ${details.name}`,
      });
      this.server.to(details.name).emit('userlist', {
        name: details.name,
        list: users,
        ops: ops,
        banned: banned,
        muted: muted,
      });
    }
  }

  @SubscribeMessage('deOpUsr')
  async deOpUsr(@ConnectedSocket() client: Socket, @Body() details: any) {
    const currentChan = this.socketsService.findChan(details.name);
    if (
      currentChan.ops.find((usr) => usr.id == client.handshake.auth.id) !=
      undefined
    ) {
      const oppato = this.socketsService.getClientName(details.user);
      const { users, ops, banned, muted } = this.socketsService.deOpUsr(
        details.name,
        details.user,
      );
      if (!users || !ops) {
        return;
      }
      const oper = this.socketsService.getClientName(details.from);

      this.server.to(details.name).emit('chanMsg', {
        user: 'SERVER',
        chan: details.name,
        timestamp: new Date(),
        msg: `user ${oper} removed ${oppato} from operators in ${details.name}`,
        senderId: 0,
      });
      this.server.to(details.name).emit('userlist', {
        name: details.name,
        list: users,
        ops: ops,
        banned: banned,
        muted: muted,
      });
    }
  }

  @SubscribeMessage('muteUsr')
  async muteUsr(@ConnectedSocket() client: Socket, @Body() details: any) {
    const currentChan = this.socketsService.findChan(details.name);
    if (
      currentChan.ops.find((usr) => usr.id == client.handshake.auth.id) !=
      undefined
    ) {
      const mutato = this.socketsService.getClientName(details.user);
      const { users, ops, banned, muted } = this.socketsService.muteUsr(
        details.name,
        details.user,
      );
      if (!users || !ops) {
        return;
      }
      const oper = this.socketsService.getClientName(details.from);

      this.server.to(details.name).emit('chanMsg', {
        user: 'SERVER',
        chan: details.name,
        timestamp: new Date(),
        msg: `user ${oper} muted ${mutato} for ${details.time} seconds`,
        senderId: 0,
      });
      this.server.to(details.name).emit('userlist', {
        name: details.name,
        list: users,
        ops: ops,
        banned: banned,
        muted: muted,
      });

      setTimeout(() => {
        const { users, ops, banned, muted } = this.socketsService.unMuteUsr(
          details.name,
          details.user,
        );
        this.server.to(details.name).emit('chanMsg', {
          user: 'SERVER',
          chan: details.name,
          timestamp: new Date(),
          msg: `user ${mutato} can talk again`,
          senderId: 0,
        });
        this.server.to(details.name).emit('userlist', {
          name: details.name,
          list: users,
          ops: ops,
          banned: banned,
          muted: muted,
        });
      }, details.time * 1000);
    }
  }

  @SubscribeMessage('chanMsg')
  async chanMsg(
    @MessageBody() body: Message,
    @ConnectedSocket() client: Socket,
  ) {
    body.user = this.socketsService.getClientName(client.handshake.auth.id);
    if (!this.socketsService.isUsrMuted(client.handshake.auth.id, body.chan)) {
      this.server.to(body.chan).emit('chanMsg', body);
    } else {
      client.emit('youreMuted', {
        chan: body.chan,
      });
    }
  }

  @SubscribeMessage('setRoomPublic')
  setRoomPublic(@Body() data: any, @ConnectedSocket() client: Socket) {
    this.socketsService.setRoomPublic(data.chan, client.handshake.auth.id);
    this.server.emit('chanlist', this.socketsService.returnChans());
    this.server.to(data.chan).emit('madePublic', data.chan);
  }

  @SubscribeMessage('setRoomPrivate')
  setRoomPrivate(@Body() data: any, @ConnectedSocket() client: Socket) {
    this.socketsService.setRoomPrivate(data.chan, client.handshake.auth.id);
    this.server.emit('chanlist', this.socketsService.returnChans());
    this.server.to(data.chan).emit('madePrivate', data.chan);
  }

  @SubscribeMessage('setRoomPassword')
  async setRoomPassword(@Body() data: any, @ConnectedSocket() client: Socket) {
    const reqStatus = await this.socketsService.setRoomPassword(
      data.newpwd,
      data.chan,
      client.handshake.auth.id,
    );
    if (reqStatus.success == true) {
      let msg;
      if (reqStatus.alreadyProt == true) {
        msg = `chan password changed!`;
      } else {
        msg = `chan password activated!`;
      }
      this.server.to(data.chan).emit('chanIsNowProtected', data.chan);
      this.server.to(data.chan).emit('chanMsg', {
        user: 'SERVER',
        chan: data.chan,
        timestamp: new Date(),
        msg: msg,
      });
      this.server.emit('chanlist', this.socketsService.returnChans());
    }
  }

  @SubscribeMessage('unsetRoomPassword')
  unsetRoomPassword(@Body() data: any, @ConnectedSocket() client: Socket) {
    if (
      this.socketsService.unsetRoomPassword(
        data.chan,
        client.handshake.auth.id,
      ) == true
    ) {
      this.server.to(data.chan).emit('chanIsNowUnrotected', data.chan);
      this.server.to(data.chan).emit('chanMsg', {
        user: 'SERVER',
        chan: data.chan,
        timestamp: new Date(),
        msg: `chan is no more password protected!`,
      });
      this.server.emit('chanlist', this.socketsService.returnChans());
    }
  }

  @SubscribeMessage('joinProtected')
  async joinProtected(@MessageBody() body, @ConnectedSocket() client: Socket) {
    const resp = await this.socketsService.joinProtected(
      body.chan,
      body.password,
      client.handshake.auth.id,
    );
    if (resp == 'invalidPwd') {
      client.emit('invalidPwd', {
        chan: body.chan,
      });
    } else {
      client.join(body.chan);
      client.emit(
        'joinedChannels',
        this.socketsService.findJoinedChan(client.handshake.auth.id),
      );
      const { users, ops, banned, muted } = this.socketsService.getChanUsrList(
        body.chan,
      );
      this.server.to(body.chan).emit('userlist', {
        name: body.chan,
        list: users,
        ops: ops,
        banned: banned,
        muted: muted,
      });
      this.server.emit('chanlist', resp);
      return;
    }
  }

  //GIOCO

  @SubscribeMessage('blackrdy')
  blackrdy(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.server.to(body.roomName).emit('blackrdy', {});
  }

  @SubscribeMessage('classic')
  classic(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.server.to(body.roomName).emit('classic', {});
  }

  @SubscribeMessage('modern')
  modern(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.server.to(body.roomName).emit('modern', {});
  }

  @SubscribeMessage('score')
  score(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.server.to(body.roomName).emit('score', {
      score: body.score,
    });
  }

  @SubscribeMessage('speed')
  speed(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.server.to(body.roomName).emit('speed', {
      speed: body.score,
    });
  }

  @SubscribeMessage('player1down')
  player1down(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.server.to(body.roomName).emit('player1down', {
      paddle1y: body.paddle1y,
    });
  }

  @SubscribeMessage('player1up')
  player1up(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.server.to(body.roomName).emit('player1up', {
      paddle1y: body.paddle1y,
    });
  }

  @SubscribeMessage('player2up')
  player2up(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.server.to(body.roomName).emit('player2up', {
      paddle2y: body.paddle2y,
    });
  }

  @SubscribeMessage('player2down')
  player2down(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.server.to(body.roomName).emit('player2down', {
      paddle2y: body.paddle2y,
    });
  }

  @SubscribeMessage('hitp1')
  hitp1(@MessageBody() body: any, @ConnectedSocket() client) {
    this.server.to(body.gameRoom).emit('p1hit', {
      setv: body.setv,
      other: body.other,
      random: Math.floor(Math.random() * 400),
    });
  }

  @SubscribeMessage('hitp2')
  hitp2(@MessageBody() body: any, @ConnectedSocket() client) {
    this.server.to(body.roomName).emit('p2hit', {
      setv: body.setv,
      other: body.other,
      random: Math.floor(Math.random() * 400),
    });
  }

  @SubscribeMessage('ballPos1')
  ballPos1(@ConnectedSocket() client: Socket, @Body() data: any) {
    this.server.to(data.roomName).emit('ballPos1', { y: data.y });
  }

  @SubscribeMessage('ballPos2')
  ballPos2(@ConnectedSocket() client: Socket, @Body() data: any) {
    this.server.to(data.roomName).emit('ballPos2', { y: data.y });
  }

  @SubscribeMessage('iWannaPlay')
  startGame(@MessageBody() body: Message, @ConnectedSocket() client: Socket) {
    this.socketsService.onlineUsers.find(
      (usr) => usr.id == client.handshake.auth.id,
    ).playing = true;
    const { name, ready } = this.socketsService.wannaPlay(
      client.handshake.auth.id,
    );
    client.join(name);
    if (ready == true) {
      client.emit('youareplayer2', {
        roomName: name,
      });
      this.server.to(name).emit('readyMatch');
    } else {
      client.emit('youareplayer1', { roomName: name });
    }
    this.server.emit('whosonline', this.socketsService.onlineUsers);
  }

  @SubscribeMessage('p1Rdy')
  p1Ready(@Body() data: any, @ConnectedSocket() client: Socket) {
    const room = this.socketsService.gameRooms.find(
      (room) => (room.room = data.roomName),
    );
    room.char1 = data.char;
    room.playersReady[0] = true;
    if (room.playersReady[1] == true) {
      this.server.to(data.roomName).emit('allReady', {
        random: Math.floor(Math.random() * 400),
        time: new Date(),
        char1: room.char1,
        char2: room.char2,
      });
    } else {
      this.server.to(data.roomName).emit('p1Rdy', { char: data.char });
    }
  }

  @SubscribeMessage('p2Rdy')
  p2Ready(@Body() data: any, @ConnectedSocket() client: Socket) {
    const room = this.socketsService.gameRooms.find(
      (room) => (room.room = data.roomName),
    );
    room.playersReady[1] = true;
    room.char2 = data.char;
    if (room.playersReady[0] == true) {
      this.server.to(data.roomName).emit('allReady', {
        random: Math.floor(Math.random() * 400),
        time: new Date(),
        char1: room.char1,
        char2: room.char2,
      });
    } else {
      this.server.to(data.roomName).emit('p2Rdy', { char: data.char });
    }
  }

  @SubscribeMessage('challenge')
  async challengeUsr(@Body() data: any, @ConnectedSocket() client: Socket) {
    const sockets = await this.server.fetchSockets();
    const challenged = sockets.find(
      (sock) => sock.handshake.auth.id == data.id,
    );
    if (challenged) {
      challenged.emit('challenged', {
        id: client.handshake.auth.id,
      });
    }
  }

  @SubscribeMessage('challengeAccepted')
  async createChallengeRoom(
    @Body() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const sockets = await this.server.fetchSockets();
    const challenged = sockets.find(
      (sock) => sock.handshake.auth.id == data.otherId,
    );
    const newRoomName = generate({
      length: 10,
      symbols: true,
      numbers: true,
      uppercase: true,
      lowercase: true,
      strict: true,
    });
    this.socketsService.gameRooms.push({
      room: newRoomName,
      players: 2,
      player1: data.otherId,
      player2: client.handshake.auth.id,
      playersReady: [false, false],
    });
    this.socketsService.onlineUsers.find(
      (usr) => usr.id == client.handshake.auth.id,
    ).playing = true;
    this.socketsService.onlineUsers.find(
      (usr) => usr.id == data.otherId,
    ).playing = true;

    this.server.emit('whosonline', this.socketsService.onlineUsers);
    client.join(newRoomName);
    challenged.join(newRoomName);
    this.server.to(newRoomName).emit('gameRoomReady', {
      name: newRoomName,
      p1: data.otherId,
      p2: client.handshake.auth.id,
    });
  }

  @SubscribeMessage('winner')
  async winner(@Body() data: any, @ConnectedSocket() client: Socket) {
    const idx = this.socketsService.gameRooms.findIndex(
      (room) => room.room == data.roomName,
    );

    if (data.winner == 1) {
      this.server.to(data.roomName).emit('player1Win', {
        result: {
          player1: data.result.player1,
          player2: data.result.player2,
        },
      });
      this.socketsService.gameWinner(
        this.socketsService.gameRooms[idx].player1,
        this.socketsService.gameRooms[idx].player2,
        data.result.player1,
        data.result.player2,
        data.winner,
      );
    } else if (data.winner == 2) {
      this.server.to(data.roomName).emit('player2Win', {
        result: {
          player1: data.result.player1,
          player2: data.result.player2,
        },
      });
      this.socketsService.gameWinner(
        this.socketsService.gameRooms[idx].player2,
        this.socketsService.gameRooms[idx].player1,
        data.result.player2,
        data.result.player1,
        data.winner,
      );
    }
    const pl1 = this.socketsService.onlineUsers.find(
      (usr) => usr.id == this.socketsService.gameRooms[idx].player1,
    );
    if (pl1) {
      pl1.playing = false;
    }
    const pl2 = this.socketsService.onlineUsers.find(
      (usr) => usr.id == this.socketsService.gameRooms[idx].player2,
    );
    if (pl2) {
      pl2.playing = false;
    }
    this.server.emit('whosonline', this.socketsService.onlineUsers);

    this.socketsService.gameRooms.splice(idx, 1);
    this.server.in(data.roomName).socketsLeave(data.roomName);
  }

  @SubscribeMessage('gameEnd')
  gameEnd(@ConnectedSocket() client: Socket, @Body() data: any) {
    client.emit('gameEnded');

    return;
  }

  @SubscribeMessage('changedMyMind')
  async cancelWait(@ConnectedSocket() client: Socket) {
    const toWarn = await this.socketsService.cancelWait(
      client.handshake.auth.id,
    );
    toWarn.forEach((room) => {
      client.leave(room);
      this.server.to(room).emit('canceled');
      this.server.in(room).socketsLeave(room);
      this.socketsService.deleteRoom(room);
    });
    this.socketsService.onlineUsers.find(
      (usr) => usr.id == client.handshake.auth.id,
    ).playing = false;

    this.server.emit('whosonline', this.socketsService.onlineUsers);
  }

  //MESSAGGI PRIVATI
  @SubscribeMessage('privMsg')
  async privMsg(
    @MessageBody() message: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const sockets = await this.server.fetchSockets();
    const msg = await this.socketsService.privmsg(message);
    client.emit('privmsg', msg);
    const receiver = sockets.find(
      (sock) => sock.handshake.auth.id == msg.receiverId,
    );
    if (receiver) {
      receiver.emit('privmsg', msg);
    }
  }

  @SubscribeMessage('getMyPrivMsgs')
  async getAllPrivMsg(@ConnectedSocket() client: Socket) {
    const privmsgs = await this.socketsService.getAllPriv(
      client.handshake.auth.id,
    );
    client.emit('yourPrivmsg', privmsgs);
  }

  //UTILITY PER CAMBIO NICKNAME

  @SubscribeMessage('changeNick')
  sendOnlineUsrs(@ConnectedSocket() client: Socket, @Body() newNick: string) {
    const users = this.socketsService.changeNick(
      client.handshake.auth.id,
      newNick,
    );
    this.server.emit('whosonline', users);
    this.server.emit('nickChanged', {
      id: client.handshake.auth.id,
      newNick: newNick,
    });
  }

  @SubscribeMessage('finishedPlaying')
  unsetPlaying(@ConnectedSocket() client: Socket) {
    const user = this.socketsService.onlineUsers.find(
      (usr) => usr.id == client.handshake.auth.id,
    );
    user.playing = false;
    this.server.emit('whosonline', this.socketsService.onlineUsers);
  }
}
