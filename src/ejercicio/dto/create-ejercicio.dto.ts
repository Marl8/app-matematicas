import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DificultadSubtema } from '../../subtema/entities/enums/dificultad.enum';
import { CreateOpcionesEjercicioDto } from '../../opciones_ejercicio/dto/create-opciones_ejercicio.dto';

export class CreateEjercicioDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El id_leccion es obligatorio.' })
  id_leccion!: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El num_orden es obligatorio.' })
  num_orden!: number;

  @IsString()
  @IsNotEmpty({ message: 'El título de ejercicio es obligatorio.' })
  titulo_ejercicio!: string;

  @IsString()
  @IsNotEmpty({ message: 'El enunciado del ejercicio es obligatorio.' })
  enunciado_ejercicio!: string;

  @IsString()
  @IsOptional()
  explicacion_ejercicio?: string;

  @IsNotEmpty()
  @IsEnum(DificultadSubtema, {
    message: 'La dificultad debe ser BAJA, MEDIA o ALTA',
  })
  dificultad_ejercicio!: DificultadSubtema;

  @IsNumber()
  @Min(0, { message: 'La recompensa de XP no puede ser negativa.' })
  recompensa_xp!: number;

  @IsArray({ message: 'Las opciones deben ser un arreglo.' })
  @IsNotEmpty({ message: 'El ejercicio debe contener al menos una opción.' })
  @ValidateNested({ each: true }) // Valida cada objeto dentro del array
  @Type(() => CreateOpcionesEjercicioDto) // Transforma el JSON al tipo de clase DTO
  opciones!: CreateOpcionesEjercicioDto[];
}
