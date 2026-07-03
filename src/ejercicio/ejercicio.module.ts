import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ejercicio } from './entities/ejercicio.entity';
import { OpcionesEjercicio } from '../opciones_ejercicio/entities/opciones_ejercicio.entity';
import { EjercicioService } from './ejercicio.service';
import { EjercicioController } from './ejercicio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ejercicio, OpcionesEjercicio])],
  controllers: [EjercicioController],
  providers: [EjercicioService],
  exports: [EjercicioService],
})
export class EjercicioModule {}
