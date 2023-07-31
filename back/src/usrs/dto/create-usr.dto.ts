import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsArray,
  IsUrl,
} from 'class-validator';

export class CreateUsrDto {
  @IsNumber()
  @IsNotEmpty()
  id?: number;

  @IsNumber()
  @IsNotEmpty()
  uid?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  displayname: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  token42: string;

  @IsString()
  @IsNotEmpty()
  nickName: string;

  @IsArray()
  @IsOptional()
  friends: number[];

  password: string;

  lastOnline: Date;

  blockedUsrs: number[];

  @IsOptional()
  twoFaSecret: string;

  twoFaActive: boolean;

  isNew: boolean;
}
