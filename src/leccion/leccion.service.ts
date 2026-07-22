import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leccion } from './entities/leccion.entity';
import { CreateLeccionDto } from './dto/create-leccion.dto';
import { UpdateLeccionDto } from './dto/update-leccion.dto';
import { LeccionResponseDto } from './dto/response-leccion.dto';

@Injectable()
export class LeccionService {
  constructor(
    @InjectRepository(Leccion)
    private readonly leccionRepository: Repository<Leccion>,
  ) {}

  async findAll(): Promise<Leccion[]> {
    return await this.leccionRepository.find();
  }

  async findLeccionesBySubtemaId(idSubtema: number): Promise<Leccion[]> {
    return await this.leccionRepository.find({
      where: {
        subtema: {
          idSubtema: idSubtema,
        },
      },
    });
  }

  async findLeccionBySubtemaYOrden(
    idSubtema: number,
    numOrden: number,
  ): Promise<Leccion> {
    const leccion = await this.leccionRepository.findOne({
      where: {
        idSubtema: idSubtema,
        numOrden: numOrden,
      },
    });
    if (!leccion) {
      throw new NotFoundException(
        `No se encontró la lección con orden ${numOrden} para el subtema con ID ${idSubtema}`,
      );
    }
    return leccion;
  }

  async findOne(id: number): Promise<LeccionResponseDto> {
    const leccion = await this.leccionRepository.findOneBy({ idLeccion: id });

    if (!leccion) {
      throw new NotFoundException(`Lección con ID ${id} no encontrada`);
    }

    return LeccionResponseDto.fromEntity(leccion);
  }

  private async findById(id: number): Promise<Leccion> {
    const leccion = await this.leccionRepository.findOne({
      where: { idLeccion: id },
    });
    if (!leccion) {
      throw new NotFoundException(`Lección con ID ${id} no encontrada`);
    }
    return leccion;
  }

  async create(
    data: CreateLeccionDto,
  ): Promise<{ message: string; leccion: Leccion }> {
    const nuevaLeccion = this.leccionRepository.create(data);
    const saved = await this.leccionRepository.save(nuevaLeccion);
    return { message: 'Guardado exitoso', leccion: saved };
  }

  async update(id: number, leccionDto: UpdateLeccionDto) {
    const leccion = await this.findById(id);
    if (!leccion) throw new NotFoundException('Usuario no encontrado');
    const leccionActualizada = this.leccionRepository.merge(
      leccion,
      leccionDto,
    );
    const updated = await this.leccionRepository.save(leccionActualizada);
    return { message: 'Lección modificada', leccion: updated };
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const leccion = await this.findById(id);
    await this.leccionRepository.remove(leccion);
    return { deleted: true };
  }
}
