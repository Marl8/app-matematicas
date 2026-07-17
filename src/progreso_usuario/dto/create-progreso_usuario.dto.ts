import {
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateProgresoUsuarioDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El id del usuario es obligatorio' })
  idUsuario!: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El id del tema es obligatorio' })
  idTema!: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El id del subtema es obligatorio' })
  idSubtema!: number;

  @IsNumber()
  @IsOptional()
  idLeccion?: number;

  @IsNumber()
  @IsOptional()
  idEjercicio?: number;

  @IsOptional()
  @IsBoolean()
  leccionCompletado?: boolean;

  @IsOptional()
  @IsBoolean()
  subtemaCompletado?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentajeCompletadoTema?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentajeCompletadoSubtema?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  xpTotal?: number;
}
