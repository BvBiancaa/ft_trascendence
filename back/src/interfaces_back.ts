export interface Message {
  chan: string;
  msg: string;
  timestamp: Date;
  user?: string;
}

//socket.services.ts

export interface OnlineUser {
  nickName: string;
  id: number;
  playing: boolean;
}

export interface Channel {
  name: string;
  isPrivate: boolean;
  users: OnlineUser[];
  password: string;
  isProtected: boolean;
  messages: [];
  ops: OnlineUser[];
  bannedUsers: OnlineUser[];
  mutedUsers: OnlineUser[];
}

export interface gameRoom {
  room: string;
  players: number;
  player1?: number;
  player2?: number;
  playersReady: boolean[];
  char1?: string;
  char2?: string;
}

//
