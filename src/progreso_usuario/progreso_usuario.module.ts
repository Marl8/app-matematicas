import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgresoUsuarioService } from './progreso_usuario.service';
import { ProgresoUsuarioController } from './progreso_usuario.controller';
import { ProgresoUsuario } from './entities/progreso_usuario.entity';
import { EjercicioModule } from '../ejercicio/ejercicio.module';
import { SubtemaModule } from '../subtema/subtema.module';
import { LeccionModule } from '../leccion/leccion.module';
import { Subtema } from '../subtema/entities/subtema.entity';
import { Ejercicio } from '../ejercicio/entities/ejercicio.entity';
import { Leccion } from '../leccion/entities/leccion.entity';
import { EventosUsuarioModule } from '../eventos_usuario/eventos_usuario.module';
import { IntentoEjercicioModule } from '../intento_ejercicio/intento_ejercicio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProgresoUsuario, Subtema, Ejercicio, Leccion]),
    EjercicioModule,
    SubtemaModule,
    LeccionModule,
    EventosUsuarioModule,
    IntentoEjercicioModule,
  ],
  controllers: [ProgresoUsuarioController],
  providers: [ProgresoUsuarioService],
  exports: [ProgresoUsuarioService],
})
export class ProgresoUsuarioModule {}
