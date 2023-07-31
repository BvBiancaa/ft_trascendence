import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OnlineUser, Channel, gameRoom } from '../interfaces_back';
import { CreateMessageDto } from './dto/create-msg-dto';
import { generate } from 'generate-password';
import { hashing } from 'src/usrs/usrs.service';
import * as bcrypt from 'bcrypt';
import { channel } from 'diagnostics_channel';

@Injectable()
export class SocketsService {
  constructor(private prisma: PrismaService) {}
  onlineUsers: OnlineUser[] = []; //UTENTI ONLINE IN QUESTO MOMENTO
  channels: Channel[] = []; //CANALI (NON VENGONO SALVATI NEL DATABASE)
  gameRooms: gameRoom[] = [];

  async addUsr(id: number) {
    if (this.onlineUsers.find((usr) => usr.id == id)) {
      return { users: this.onlineUsers, channels: this.mapChannels() };
    }
    const usr = await this.prisma.user.findUnique({ where: { id: id } });
    const newOnlineUsr: OnlineUser = {
      nickName: usr.nickName,
      id: usr.id,
      playing: false,
    };
    this.onlineUsers.push(newOnlineUsr);

    return this.onlineUsers;
  }

  async removeUsr(id: number) {
    const changedChans = [];
    let gameRoomName: string = '';
    const idx = this.onlineUsers.findIndex((usr) => usr.id == id);
    this.channels.forEach((chan) => {
      const tmpi = chan.users.findIndex((usr) => usr.id == id);
      if (tmpi != -1) {
        changedChans.push(chan);
      }
    });
    if ((await this.prisma.user.count()) > 0) {
      await this.prisma.user.update({
        where: { id: id },
        data: { lastOnline: new Date() },
      });
    }
    const idxG = this.gameRooms.findIndex(
      (room) => room.player1 == id || room.player2 == id,
    );
    if (idxG != -1) {
      if (this.gameRooms[idxG].player1 == id) {
        this.gameRooms[idxG].player1 = null;
        this.gameRooms[idxG].players--;
        this.gameRooms[idxG].playersReady[0] = false;
      } else if (this.gameRooms[idxG].player2 == id) {
        this.gameRooms[idxG].player2 = null;
        this.gameRooms[idxG].players--;
        this.gameRooms[idxG].playersReady[1] = false;
      }
      gameRoomName = this.gameRooms[idxG].room;
      if (this.gameRooms[idxG].players <= 0) {
        this.gameRooms.splice(idxG, 1);
      }
    }
    this.channels = this.channels.filter((chan) => chan.users.length > 0);
    this.onlineUsers.splice(idx, 1);
    return {
      users: this.onlineUsers,
      channels: this.mapChannels(),
      changedChans: changedChans,
      gameRoomName: gameRoomName,
    };
  }

  async createOrJoinChan(name: string, id: number) {
    const idx = this.channels.findIndex((chan) => chan.name == name);
    const usr = this.onlineUsers.find((usr) => usr.id == id);
    if (idx == -1) {
      const newChan: Channel = {
        name: name,
        isPrivate: false,
        users: [usr],
        password: '',
        isProtected: false,
        messages: [],
        ops: [usr],
        bannedUsers: [],
        mutedUsers: [],
      };
      this.channels.push(newChan);
    } else {
      const chan = this.channels[idx];
      if (chan.bannedUsers.find((usr) => usr.id == id)) {
        return 'banned';
      }
      if (chan.isPrivate) {
        return 'private';
      }
      if (chan.isProtected) {
        return 'protected';
      }
      if (
        !chan.users.find((usr) => usr.id == id) &&
        !chan.bannedUsers.find((usr) => usr.id == id)
      ) {
        chan.users.push(usr);
      }
    }
    return this.mapChannels();
  }

  async joinProtected(name: string, password: string, userId: number) {
    const idx = this.channels.findIndex((chan) => chan.name == name);
    const usr = this.onlineUsers.find((usr) => usr.id == userId);
    if (idx != -1) {
      const chan = this.channels[idx];
      const isPasswordValid = await bcrypt.compare(password, chan.password);
      if (isPasswordValid) {
        chan.users.push(usr);
        return this.mapChannels();
      }
      return 'invalidPwd';
    }
  }

  async leaveChan(name: string, id: number) {
    const idx = this.channels.findIndex((chan) => chan.name == name);
    if (idx != -1) {
      const chan = this.channels[idx];
      const tmpi = chan.users.findIndex((usr) => usr.id == id);
      if (tmpi != -1) {
        this.channels[idx].users.splice(tmpi, 1);
      }
      const tmpiOp = chan.ops.findIndex((usr) => usr.id == id);
      if (tmpiOp != -1) {
        this.channels[idx].ops.splice(tmpiOp, 1);
      }
      this.channels = this.channels.filter((chan) => chan.users.length > 0);
    }
    return this.mapChannels();
  }

  mapChannels() {
    return this.channels.map((chan) => {
      return {
        name: chan.name,
        isPrivate: chan.isPrivate,
      };
    });
  }

  findJoinedChan(id: number) {
    let joined = undefined;
    if (this.channels.length > 0) {
      joined = this.channels.filter((chan) =>
        chan.users.find((user) => user.id == id),
      );
    }

    return joined;
  }

  getChanUsrList(name: string) {
    const idx = this.channels.findIndex((chan) => chan.name == name);
    if (idx != -1) {
      return {
        users: this.channels[idx].users,
        ops: this.channels[idx].ops,
        banned: this.channels[idx].bannedUsers,
        muted: this.channels[idx].mutedUsers,
      };
    } else {
      return { users: [], ops: [], banned: [] };
    }
  }

  getClientName(id: number) {
    return this.onlineUsers.find((usr) => usr.id == id).nickName;
  }

  changeNick(id: number, newNick: string) {
    const idx = this.onlineUsers.findIndex((usr) => usr.id == id);
    if (idx != -1) {
      this.onlineUsers[idx].nickName = newNick;
    }
    return this.onlineUsers;
  }

  findChan(name: string) {
    return this.channels.find((chan) => chan.name == name);
  }

  kickUsr(name: string, user: number, from: string) {
    const chan = this.findChan(name);
    if (chan) {
      const idxOp = chan.ops.findIndex((e) => e.id == user);
      if (idxOp != -1) {
        return undefined;
      }
      const idx = chan.users.findIndex((e) => e.id == user);
      if (idx != -1) {
        chan.users.splice(idx, 1);
      }

      return this.getChanLists(name);
    }
    return undefined;
  }

  banUsr(name: string, user: number, from: string) {
    const chan = this.findChan(name);
    if (chan) {
      const idxOp = chan.ops.findIndex((e) => e.id == user);
      if (idxOp != -1) {
        return undefined;
      }
      const idx = chan.users.findIndex((e) => e.id == user);
      if (idx != -1) {
        chan.bannedUsers.push(chan.users[idx]);
        chan.users.splice(idx, 1);
      }

      return this.getChanLists(name);
    }
    return undefined;
  }

  unBanUsr(name: string, user: number) {
    const chan = this.findChan(name);
    if (chan) {
      const idxOp = chan.ops.findIndex((e) => e.id == user);
      if (idxOp != -1) {
        return undefined;
      }
      const idx = chan.bannedUsers.findIndex((e) => e.id == user);
      if (idx != -1) {
        chan.bannedUsers.splice(idx, 1);
      }
      return this.getChanLists(name);
    }
    return undefined;
  }

  opUsr(name: string, user: number) {
    const chan = this.findChan(name);
    if (chan) {
      const idxOp = chan.ops.findIndex((e) => e.id == user);
      if (idxOp != -1) {
        return undefined;
      }
      const idx = chan.users.findIndex((e) => e.id == user);
      if (idx != -1) {
        chan.ops.push(chan.users[idx]);
      }

      return this.getChanLists(name);
    }
    return undefined;
  }

  deOpUsr(name: string, user: number) {
    const chan = this.findChan(name);
    if (chan) {
      const idxOp = chan.ops.findIndex((e) => e.id == user);
      if (idxOp == -1) {
        return undefined;
      } else {
        chan.ops.splice(idxOp, 1);
      }
      return this.getChanLists(name);
    }
    return undefined;
  }

  async privmsg(messageDto: any) {
    const dest = await this.prisma.user.findUnique({
      where: { id: messageDto.receiverId },
    });
    if (dest.blockedUsrs.includes(messageDto.senderId)) {
    } else {
      return await this.prisma.message.create({
        data: {
          content: messageDto.content,
          senderId: messageDto.senderId,
          receiverId: messageDto.receiverId,
          fromNick: messageDto.fromNick,
          toNick: messageDto.toNick,
        },
      });
    }
  }

  async getAllPriv(id: number) {
    const privMsgs = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: id }, // Messaggi inviati dal mittente al destinatario
          { receiverId: id }, // Messaggi inviati dal destinatario al mittente
        ],
      },
    });
    return privMsgs;
  }

  muteUsr(name: string, id: number) {
    const chan = this.channels.find((chan) => chan.name == name);
    chan.mutedUsers.push({
      id: id,
      nickName: this.onlineUsers.find((usr) => usr.id == id).nickName,
      playing: false,
    });
    return this.getChanLists(name);
  }

  unMuteUsr(name: string, id: number) {
    const chan = this.channels.find((chan) => chan.name == name);
    const idx = chan.mutedUsers.findIndex((usr) => usr.id == id);
    if (idx != -1) {
      chan.mutedUsers.splice(idx, 1);
    }
    return this.getChanLists(name);
  }

  isUsrMuted(id: number, name: string) {
    const chan = this.channels.find((chan) => chan.name == name);
    if (chan.mutedUsers.find((usr) => usr.id == id)) {
      return true;
    }
    return false;
  }

  setRoomPublic(name: string, id: number) {
    const chan = this.channels.find((chan) => chan.name == name);
    if (chan.ops.find((usr) => usr.id == id) && chan.isPrivate) {
      chan.isPrivate = false;
    }
  }

  setRoomPrivate(name: string, id: number) {
    const chan = this.channels.find((chan) => chan.name == name);
    if (chan.ops.find((usr) => usr.id == id) && !chan.isPrivate) {
      chan.isPrivate = true;
    }
  }

  wannaPlay(id: number) {
    for (let i = 0; i < this.gameRooms.length; i++) {
      if (this.gameRooms[i].players == 1) {
        if (this.gameRooms[i].player2 == null) {
          this.gameRooms[i].players++;
          this.gameRooms[i].player2 = id;

          return { name: this.gameRooms[i].room, ready: true };
        } else if (this.gameRooms[i].player1 == null) {
          this.gameRooms[i].players++;
          this.gameRooms[i].player1 = id;

          return { name: this.gameRooms[i].room, ready: true };
        }
      }
    }
    const newRoomName = generate({
      length: 10,
      symbols: true,
      numbers: true,
      uppercase: true,
      lowercase: true,
      strict: true,
    });
    this.gameRooms.push({
      room: newRoomName,
      players: 1,
      player1: id,
      player2: null,
      playersReady: [],
    });

    return { name: newRoomName, ready: false };
  }

  getChanLists(name: string) {
    const chan = this.channels.find((chan) => chan.name == name);
    if (chan) {
      return {
        users: chan.users,
        ops: chan.ops,
        banned: chan.bannedUsers,
        muted: chan.mutedUsers,
      };
    } else {
      return {
        users: [],
        ops: [],
        banned: [],
        muted: [],
      };
    }
  }

  async setRoomPassword(newpwd: string, name: string, clientId: number) {
    let isAlreadyProtected: boolean;
    const chan = this.channels.find((chan) => chan.name == name);
    if (chan) {
      if (chan.isProtected) {
        isAlreadyProtected = true;
      } else {
        isAlreadyProtected = false;
      }
      if (chan.ops.find((usr) => usr.id == clientId)) {
        chan.isProtected = true;
        chan.password = await bcrypt.hash(newpwd, hashing);
        return { success: true, alreadyProt: isAlreadyProtected };
      }
    }
    return { success: false };
  }

  unsetRoomPassword(name: string, clientId: number) {
    const chan = this.channels.find((chan) => chan.name == name);
    if (chan) {
      if (chan.ops.find((usr) => usr.id == clientId) && chan.isProtected) {
        chan.isProtected = false;
        chan.password = '';
        return true;
      }
    }
    return false;
  }

  returnChans() {
    const chansToReturn = [];
    for (let i = 0; i < this.channels.length; i++) {
      const { password, ...channelWithoutPassword } = this.channels[i];
      chansToReturn.push(channelWithoutPassword);
    }
    return chansToReturn;
  }

  async gameWinner(
    idW: number,
    idL: number,
    wScore: number,
    lScore: number,
    win: number,
  ) {
    const winner = await this.prisma.user.findUnique({
      where: { id: idW },
    });
    const loser = await this.prisma.user.findUnique({
      where: { id: idL },
    });
    const matchL = await this.createMatch(
      loser.id,
      winner.id,
      wScore,
      lScore,
      win,
      false,
    );
    const matchW = await this.createMatch(
      winner.id,
      loser.id,
      wScore,
      lScore,
      win,
      true,
    );
    await this.addMatch(loser.id, matchL);
    await this.addMatch(winner.id, matchW);
  }

  //MATCHES

  async createMatch(
    myId: number,
    otherId: number,
    player1Score: number,
    player2Score: number,
    win: number,
    won: boolean,
  ) {
    let oneOrTwo: number;
    if (won == true) {
      oneOrTwo = win;
    } else {
      if (win == 1) {
        oneOrTwo = 2;
      } else {
        oneOrTwo = 1;
      }
    }
    const newMatch = await this.prisma.match.create({
      data: {
        userId: myId,
        otherPlayerId: otherId,
        player1Score: player1Score,
        player2Score: player2Score,
        won: won,
        oneOrTwo: oneOrTwo,
      },
    });
    return newMatch.id;
  }

  async addMatch(userId: number, matchId: number) {
    const updatedUsr = await this.prisma.user.update({
      where: { id: userId },
      data: {
        matches: {
          connect: { id: matchId },
        },
      },
    });
    return updatedUsr;
  }

  deleteRoom(name: string) {
    const idx = this.gameRooms.findIndex((room) => room.room == name);
    if (idx != -1) {
      this.gameRooms.splice(idx, 1);
    }
  }

  async cancelWait(id: number) {
    const toWarn = [];

    for (let i = 0; i < this.gameRooms.length; i++) {
      if (this.gameRooms[i].player1 == id) {
        toWarn.push(this.gameRooms[i].room);
      }
    }
    return toWarn;
  }
}
