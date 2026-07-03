import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTemaDto {
  @IsNotEmpty()
  @IsString()
  nombreTema!: string;

  @IsNotEmpty()
  @IsString()
  descripcionTema!: string;
}
