//vue

import { Socket } from "socket.io-client";

export interface OnlineUser {
  nickName: string;
  id: number;
  playing: boolean;
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
  friends: number[];
  listenersActive: boolean;
  modalOpen: { id: number; chat: boolean };
  lastOnline: string;
  blockedUsrs: number[];
  chanSettingsModal: string;
  gameRoomName?: string;
  twoFaActive: boolean;
  showOnline: boolean;
  matches: any[];
  stats: UserStats;
  isNew: boolean;
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
  toNick: string;
}

export interface Conversation {
  id: number;
  messages: Message[];
  updated: boolean;
  nick?: string;
  otherUsrId?: number;
}

export interface Conversations {
  conversations: Conversation[];
  fetched: boolean;
}

export interface ChanMessage {
  chan: string;
  msg: string;
  timestamp: Date;
  user?: string;
  senderId: number;
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
  id: number;
}

export interface Match {
  id: number;
  nick: string;
  won: boolean;
}

export interface UserStats {
  played: number;
  won: number;
  lost: number;
  elo: number;
}
