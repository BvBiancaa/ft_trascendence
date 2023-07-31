import { User } from '@prisma/client';

export class CreateMatchDto {
  id?: number;
  otherPlayerId: number;
  player1Score: number;
  player2Score: number;
  won: boolean;
  User: User;
  userId?: number;
  oneOrTwo: number;
}
