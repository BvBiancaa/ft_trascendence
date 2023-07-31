import { Exclude } from 'class-transformer';
import { User } from '@prisma/client';

export class UsrEntity implements User {
  constructor(partial: Partial<UsrEntity>) {
    Object.assign(this, partial);
  }
  id: number;
  uid: number;
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
  @Exclude()
  token42: string;
  @Exclude()
  password: string;
  lastOnline: Date;
  blockedUsrs: number[];
  @Exclude()
  twoFaSecret: string;
  twoFaActive: boolean;
  isNew: boolean;
}
