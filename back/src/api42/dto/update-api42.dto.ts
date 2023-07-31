import { PartialType } from '@nestjs/mapped-types';
import { CreateApi42Dto } from './create-api42.dto';

export class UpdateApi42Dto extends PartialType(CreateApi42Dto) {}
