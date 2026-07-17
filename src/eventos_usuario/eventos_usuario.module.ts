import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventosUsuarioService } from './eventos_usuario.service';
import { EventosUsuarioController } from './eventos_usuario.controller';
import { EventosUsuario } from './entities/eventos_usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventosUsuario]),
  ],
  controllers: [EventosUsuarioController],
  providers: [EventosUsuarioService],
})
export class EventosUsuarioModule {}