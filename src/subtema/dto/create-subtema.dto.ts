import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { DificultadSubtema } from '../entities/enums/dificultad.enum';

export class CreateSubtemaDto {
  @IsNotEmpty()
  @IsNumber()
  idTema!: number;

  @IsNotEmpty()
  @IsString()
  nombreSubtema!: string;

  @IsNotEmpty()
  @IsEnum(DificultadSubtema, {
    message: 'La dificultad debe ser BAJA, MEDIA o ALTA',
  })
  dificultadSubtema!: DificultadSubtema;
}
