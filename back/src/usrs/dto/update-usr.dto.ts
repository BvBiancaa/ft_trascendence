import { PartialType } from '@nestjs/mapped-types';
import { CreateUsrDto } from './create-usr.dto';

export class UpdateUsrDto extends PartialType(CreateUsrDto) {}
