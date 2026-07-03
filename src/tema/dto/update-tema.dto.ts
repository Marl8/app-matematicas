import { PartialType } from '@nestjs/mapped-types';
import { CreateTemaDto } from './create-tema.dto';

// PartialType hace que todos los campos de CreateTemaDto sean opcionales para el UPDATE
export class UpdateTemaDto extends PartialType(CreateTemaDto) {}
