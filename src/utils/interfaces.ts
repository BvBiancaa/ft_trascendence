//vue

import { Socket } from "socket.io-client";

export interface OnlineUser {
  nickName: string;
  id: number;
}

export interface OnlineUsers {
  onlineUsers: OnlineUser[];
}

export interface Message {
  chan: string;
  msg: string;
  timestamp: number;
  user?: string;
}

export interface User {
  authenticated: boolean;
  currentToken: string;
  id: number;
  uid: string;
  name: string;
  image: string;
  login: string;
  displayName: string;
  email: string;
  nickName: string;
  wins: number;
  loses: number;
  elo: number;
  gamePlayed: number;
  friends: number[] | null[];
  listenersActive: boolean;
}

export interface OnlineSocket {
  socket: Socket | null;
}

export interface OnlineUser {
  nickName: string;
  id: number;
}

export interface ChannelFromOutside {
  name: string;
  isPrivate: boolean;
}

export interface JoinedChan {
  name: string;
  isPrivate: boolean;
  users: OnlineUser[];
  password: string;
  isProtected: boolean;
  messages: Message[];
  ops: OnlineUser[];
}
