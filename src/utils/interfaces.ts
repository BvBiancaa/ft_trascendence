//vue

import { Socket } from "socket.io-client";

export interface OnlineUser {
  nickName: string;
  id: number;
}

export interface OnlineUsers {
  onlineUsers: OnlineUser[];
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
  friends: number[];
  listenersActive: boolean;
  modalOpen: number;
  lastOnline: string;
  blockedUsrs: number[];
  chanSettingsModal: string;
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

export interface ChanSettings {
  isPrivate: boolean;
  isPwdProtected: boolean;
  password?: string;
}

export interface JoinedChan {
  name: string;
  isPrivate: boolean;
  users: OnlineUser[];
  password: string;
  isProtected: boolean;
  messages: ChanMessage[];
  ops: OnlineUser[];
  bannedUsers: OnlineUser[];
  mutedUsers: OnlineUser[];
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  receiverId: number;
  fromNick: string;
}

export interface Conversation {
  id: number;
  messages: Message[];
  updated: boolean;
  nick?: string;
}

export interface Conversations {
  conversations: Conversation[];
  fetched: boolean;
}

export interface ChanMessage {
  chan: string;
  msg: string;
  timestamp: string;
  user?: string;
}

export interface UserForList {
  displayName: string;
  elo: number;
  email: string;
  friends: number[];
  gamePlayed: number;
  id: number;
  image: string;
  login: string;
  loses: number;
  name: string;
  nickName: string;
  uid: number | null;
  wins: number;
}

export interface UserForModal {
  nick: string;
  image: string;
  wins: number;
  loses: number;
  elo: number;
  gamePlayed: number;
  id: number;
}
