import { Module } from '@nestjs/common';
import { OpcionesEjercicioService } from './opciones_ejercicio.service';
import { OpcionesEjercicioController } from './opciones_ejercicio.controller';

@Module({
  controllers: [OpcionesEjercicioController],
  providers: [OpcionesEjercicioService],
})
export class OpcionesEjercicioModule {}
