import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ejercicio } from './entities/ejercicio.entity';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto';

@Injectable()
export class EjercicioService {
  constructor(
    @InjectRepository(Ejercicio)
    private readonly ejercicioRepository: Repository<Ejercicio>,
  ) {}

  async create(createEjercicioDto: CreateEjercicioDto): Promise<Ejercicio> {
    const nuevoEjercicio = this.ejercicioRepository.create(createEjercicioDto);
    return await this.ejercicioRepository.save(nuevoEjercicio);
  }

  async findAll(): Promise<Ejercicio[]> {
    return await this.ejercicioRepository.find();
  }

  async findOne(id_ejercicio: number): Promise<Ejercicio> {
    const ejercicio = await this.ejercicioRepository.findOne({
      where: { id_ejercicio },
    });
    if (!ejercicio) {
      throw new NotFoundException(
        `El ejercicio con ID ${id_ejercicio} no fue encontrado`,
      );
    }
    return ejercicio;
  }

  async findByNumOrden(numOrden: number): Promise<Ejercicio> {
    const ejercicio = await this.ejercicioRepository.findOne({
      where: { num_orden: numOrden },
    });
    if (!ejercicio) {
      throw new NotFoundException(
        `El ejercicio con el número de orden ${numOrden} no fue encontrado`,
      );
    }
    return ejercicio;
  }

  async findByOrdenYLeccion(
    numOrden: number,
    idLeccion: number,
  ): Promise<Ejercicio> {
    const ejercicio = await this.ejercicioRepository.findOne({
      where: {
        num_orden: numOrden,
        id_leccion: idLeccion,
      },
    });
    if (!ejercicio) {
      throw new NotFoundException(
        `No se encontró un ejercicio con el orden ${numOrden} para la lección con ID ${idLeccion}`,
      );
    }
    return ejercicio;
  }

  async findByOrdenYSubtema(
    numOrden: number,
    idSubtema: number,
  ): Promise<Ejercicio> {
    const ejercicio = await this.ejercicioRepository.findOne({
      where: {
        num_orden: numOrden,
        leccion: {
          idSubtema: idSubtema,
        },
      },
      relations: {
        leccion: true,
      },
    });
    if (!ejercicio) {
      throw new NotFoundException(
        `No se encontró un ejercicio con el orden ${numOrden} para el subtema con ID ${idSubtema}`,
      );
    }
    return ejercicio;
  }

  async update(
    id_ejercicio: number,
    updateEjercicioDto: UpdateEjercicioDto,
  ): Promise<Ejercicio> {
    const ejercicio = await this.ejercicioRepository.preload({
      id_ejercicio: id_ejercicio,
      ...updateEjercicioDto,
    });
    if (!ejercicio) {
      throw new NotFoundException(
        `El ejercicio con ID ${id_ejercicio} no existe`,
      );
    }
    return await this.ejercicioRepository.save(ejercicio);
  }

  async remove(id_ejercicio: number): Promise<{ message: string }> {
    const ejercicio = await this.findOne(id_ejercicio);
    if (!ejercicio) {
      throw new NotFoundException(
        `El ejercicio con ID ${id_ejercicio} no existe`,
      );
    }
    await this.ejercicioRepository.remove(ejercicio);
    return {
      message: `Ejercicio con ID ${id_ejercicio} eliminado correctamente.`,
    };
  }
}
