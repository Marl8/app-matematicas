import {Injectable,NotFoundException,} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IntentoEjercicio } from './entities/intento_ejercicio.entity';
import { User } from '../user/entities/user.entity';
import { Subtema } from '../subtema/entities/subtema.entity';
import { Ejercicio } from '../ejercicio/entities/ejercicio.entity';
import { OpcionesEjercicio } from '../opciones_ejercicio/entities/opciones_ejercicio.entity';
import { EventosUsuarioService } from '../eventos_usuario/eventos_usuario.service';
import { CreateIntentoEjercicioDto } from './dto/create-intento_ejercicio.dto';

@Injectable()
export class IntentoEjercicioService {
  constructor(
    @InjectRepository(IntentoEjercicio)
    private intentoRepository: Repository<IntentoEjercicio>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Subtema)
    private subtemaRepository: Repository<Subtema>,

    @InjectRepository(Ejercicio)
    private ejercicioRepository: Repository<Ejercicio>,

    @InjectRepository(OpcionesEjercicio)
    private opcionesEjercicioRepository: Repository<OpcionesEjercicio>,

    private eventosUsuarioService: EventosUsuarioService,
  ) {}

  async create(createDto: CreateIntentoEjercicioDto) {
    const usuario = await this.userRepository.findOneBy({
      id: createDto.id_usuario,
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const subtema = await this.subtemaRepository.findOneBy({
      idSubtema: createDto.id_subtema
    });
    if (!subtema) {
      throw new NotFoundException('Subtema no encontrado');
    }

    const ejercicio = await this.ejercicioRepository.findOneBy({
      id_ejercicio: createDto.id_ejercicio,
    });
    if (!ejercicio) {
      throw new NotFoundException('Ejercicio no encontrado');
    }

    let id_opciones: OpcionesEjercicio | null = null;

    if (createDto.id_opciones) {
      id_opciones = await this.opcionesEjercicioRepository.findOneBy({
        id_opciones: createDto.id_opciones,
      });

      if (!id_opciones) {
        throw new NotFoundException('Opción no encontrada');
      }
    }

    const ultimoIntento = await this.intentoRepository.count({    // Contar el número de intentos previos del usuario para este ejercicio
      where: {
        usuario: { id: createDto.id_usuario },
        ejercicio: { id_ejercicio: createDto.id_ejercicio },
      },
    });
    const nroIntento = ultimoIntento + 1;

    const intento = await this.intentoRepository.save({   // Guardar el intento de ejercicio
      usuario,
      subtema,
      ejercicio,
      id_opciones,
      nro_intento: nroIntento,
      completado: createDto.completado ?? false,
      response_time: createDto.response_time ?? 0,
    });

    return intento;
  }

  findAll() {
    return this.intentoRepository.find({
      relations: {
        usuario: true,
        subtema: true,
        ejercicio: true,
        id_opciones: true,
      },
    });
  }

  async findOne(id: number) {
    const intento = await this.intentoRepository.findOne({
      where: { id_intento: id },
      relations: {
        usuario: true,
        subtema: true,
        ejercicio: true,
        id_opciones: true,
      },
    });

    if (!intento) {
      throw new NotFoundException('Intento no encontrado');
    }

    return intento;
  }
}