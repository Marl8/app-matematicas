import { PartialType } from '@nestjs/mapped-types'; // o '@nestjs/swagger' si usas Swagger
import { IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { CreateProgresoUsuarioDto } from './create-progreso_usuario.dto'; // Ajusta la ruta de tu CreateDto

export class UpdateProgresoUsuarioDto extends PartialType(
  CreateProgresoUsuarioDto,
) {
  @IsOptional()
  @IsNumber()
  @Min(1, {
    message: 'El número de orden de la lección no puede ser menor a 1',
  })
  @Max(3, {
    message: 'El número de orden de la lección no puede ser mayor a 3',
  })
  numOrdenLeccion?: number;

  @IsOptional()
  @IsNumber()
  @Min(1, {
    message: 'El número de orden del ejercicio no puede ser menor a 1',
  })
  @Max(3, {
    message: 'El número de orden del ejercicio no puede ser mayor a 3',
  })
  numOrdenEjercicio?: number;

  @IsOptional()
  @IsBoolean({
    message: 'El campo ejercicioCompletado debe ser un valor booleano',
  })
  ejercicioCompletado?: boolean;

  @IsOptional()
  @IsBoolean({
    message: 'El campo xp debe ser un valor booleano',
  })
  xp?: boolean;
}
