import { PartialType } from '@nestjs/mapped-types';
import { CreateSubtemaDto } from './create-subtema.dto';

export class UpdateSubtemaDto extends PartialType(CreateSubtemaDto) {}
