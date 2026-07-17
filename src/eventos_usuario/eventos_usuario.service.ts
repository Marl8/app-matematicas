import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventosUsuario } from './entities/eventos_usuario.entity';
import { CreateEventosUsuarioDto } from './dto/create-eventos_usuario.dto';

@Injectable()
export class EventosUsuarioService {
  constructor(
    @InjectRepository(EventosUsuario)
    private eventoRepository: Repository<EventosUsuario>
  ){}

create(createEventosUsuarioDto: CreateEventosUsuarioDto) {

  const evento = this.eventoRepository.create({
      tipo_evento: createEventosUsuarioDto.tipo_evento,
      puntos: createEventosUsuarioDto.puntos,
      
      usuario: {
        id: createEventosUsuarioDto.id_usuario
      },
      
      leccion: createEventosUsuarioDto.id_leccion
        ? { idLeccion: createEventosUsuarioDto.id_leccion }
        : null,
      
        ejercicio: createEventosUsuarioDto.id_ejercicio
        ? { id_ejercicio: createEventosUsuarioDto.id_ejercicio }
        : null,
    } as any);
  return this.eventoRepository.save(evento);
}

  findAll() {
    return this.eventoRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} eventosUsuario`;
  }

  findByUsuario(id_usuario:number){
  return this.eventoRepository.find({
    where:{
      usuario:{
        id:id_usuario
      }
    }
  });
  }

}
