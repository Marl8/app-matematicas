import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
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

  @IsString({ message: 'El contenido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El contenido de la lección es requerido' })
  contenidoLeccion!: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  tips!: string;
}
