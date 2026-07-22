import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateLeccionDto {
  @IsInt({ message: 'El id_subtema debe ser un número entero' })
  @IsNotEmpty({ message: 'El id_subtema es requerido' })
  idSubtema!: number;

  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título de la lección es requerido' })
  @MaxLength(255, { message: 'El título no puede superar los 255 caracteres' })
  tituloLeccion!: string;

  @IsOptional()
  @IsString({ message: 'El subtítulo debe ser una cadena de texto' })
  @MaxLength(255, {
    message: 'El subtítulo no puede superar los 255 caracteres',
  })
  subtituloLeccion!: string;

  @IsNotEmpty({ message: 'La descripción de la lección es requerida' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcionLeccion!: string;

  @IsNotEmpty({ message: 'El contenido de la lección es requerido' })
  contenidoLeccion!: any;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  tips!: string;

  @IsNumber()
  @IsNotEmpty({ message: 'El num_orden es obligatorio.' })
  numOrden!: number;
}
