import { Injectable } from '@nestjs/common';
import { CreateOpcionesEjercicioDto } from './dto/create-opciones_ejercicio.dto';
import { UpdateOpcionesEjercicioDto } from './dto/update-opciones_ejercicio.dto';

@Injectable()
export class OpcionesEjercicioService {
  create(createOpcionesEjercicioDto: CreateOpcionesEjercicioDto) {
    return 'This action adds a new opcionesEjercicio';
  }

  findAll() {
    return `This action returns all opcionesEjercicio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} opcionesEjercicio`;
  }

  update(id: number, updateOpcionesEjercicioDto: UpdateOpcionesEjercicioDto) {
    return `This action updates a #${id} opcionesEjercicio`;
  }

  remove(id: number) {
    return `This action removes a #${id} opcionesEjercicio`;
  }
}
