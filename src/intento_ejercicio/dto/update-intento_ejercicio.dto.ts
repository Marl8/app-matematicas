import { PartialType } from '@nestjs/swagger';
import { CreateIntentoEjercicioDto } from './create-intento_ejercicio.dto';

export class UpdateIntentoEjercicioDto extends PartialType(CreateIntentoEjercicioDto) {}
