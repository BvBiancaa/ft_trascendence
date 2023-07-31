import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsArray,
  IsUrl,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateLoginDto {
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
  displayName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  token42: string;

  @IsString()
  @IsNotEmpty()
  nickName: string;

  @IsArray()
  @IsOptional()
  friends: number[];

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
  password: string;

  blockedUsrs: number[];

  @IsOptional()
  twoFaSecret: string;

  twoFaActive: boolean;

  isNew: boolean;
}
