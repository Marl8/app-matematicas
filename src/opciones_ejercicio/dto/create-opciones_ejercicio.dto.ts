import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateOpcionesEjercicioDto {
  @IsString()
  @IsNotEmpty({ message: 'El texto de la opción no puede estar vacío.' })
  texto_opcion!: string;

  @IsString()
  @IsNotEmpty({ message: 'El texto de la explicación no puede estar vacío.' })
  explicacion!: string;

  @IsBoolean({
    message: 'Debe especificar si la opción es correcta (true/false).',
  })
  @IsNotEmpty()
  es_correcta!: boolean;
}
