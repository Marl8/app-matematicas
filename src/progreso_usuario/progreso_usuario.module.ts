import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgresoUsuarioService } from './progreso_usuario.service';
import { ProgresoUsuarioController } from './progreso_usuario.controller';
import { ProgresoUsuario } from './entities/progreso_usuario.entity';
import { EjercicioModule } from '../ejercicio/ejercicio.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProgresoUsuario]), EjercicioModule],
  controllers: [ProgresoUsuarioController],
  providers: [ProgresoUsuarioService],
  exports: [ProgresoUsuarioService],
})
export class ProgresoUsuarioModule {}
