import { PartialType } from '@nestjs/mapped-types';
import { CreateOpcionesEjercicioDto } from './create-opciones_ejercicio.dto';

export class UpdateOpcionesEjercicioDto extends PartialType(
  CreateOpcionesEjercicioDto,
) {}
