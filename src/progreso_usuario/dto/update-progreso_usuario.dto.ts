import { PartialType } from '@nestjs/mapped-types';
import { CreateProgresoUsuarioDto } from './create-progreso_usuario.dto';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateProgresoUsuarioDto extends PartialType(
  CreateProgresoUsuarioDto,
) {
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'El número de orden no puede ser menor a 1' })
  @Max(3, { message: 'El número de orden no puede ser mayor a 3' })
  numOrdenEjercicio?: number;
}
