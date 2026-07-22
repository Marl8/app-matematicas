import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IntentoEjercicioService } from './intento_ejercicio.service';
import { IntentoEjercicioController } from './intento_ejercicio.controller';
import { IntentoEjercicio } from './entities/intento_ejercicio.entity';

import { User } from '../user/entities/user.entity';
import { Subtema } from '../subtema/entities/subtema.entity';
import { Ejercicio } from '../ejercicio/entities/ejercicio.entity';
import { OpcionesEjercicio } from '../opciones_ejercicio/entities/opciones_ejercicio.entity';
import { EventosUsuarioModule } from '../eventos_usuario/eventos_usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IntentoEjercicio,
      User,
      Subtema,
      Ejercicio,
      OpcionesEjercicio,
    ]),
    EventosUsuarioModule,
  ],
  controllers: [IntentoEjercicioController],
  providers: [IntentoEjercicioService],
  exports: [IntentoEjercicioService],
})
export class IntentoEjercicioModule {}