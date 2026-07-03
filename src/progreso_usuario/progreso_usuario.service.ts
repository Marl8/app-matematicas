import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgresoUsuario } from './entities/progreso_usuario.entity';
import { EjercicioService } from '../ejercicio/ejercicio.service';
import { CreateProgresoUsuarioDto } from './dto/create-progreso_usuario.dto';
import { UpdateProgresoUsuarioDto } from './dto/update-progreso_usuario.dto';

@Injectable()
export class ProgresoUsuarioService {
  constructor(
    @InjectRepository(ProgresoUsuario)
    private readonly progresoRepository: Repository<ProgresoUsuario>,
    private readonly ejercicioService: EjercicioService,
  ) {}

  async create(createDto: CreateProgresoUsuarioDto): Promise<ProgresoUsuario> {
    let progreso = await this.progresoRepository.findOne({
      where: {
        idUsuario: createDto.idUsuario,
        idSubtema: createDto.idSubtema,
      },
    });
    if (!progreso) {
      const numOrden = 1;
      const ejercicio = await this.ejercicioService.findByOrdenYLeccion(
        numOrden,
        createDto.idLeccion,
      );
      const nuevoProgreso = this.progresoRepository.create({
        ...createDto,
        numOrdenEjercicio: ejercicio.num_orden,
        idEjercicio: ejercicio.id_ejercicio,
      });
      progreso = await this.progresoRepository.save(nuevoProgreso);
    }
    return progreso;
  }

  async findAll(): Promise<ProgresoUsuario[]> {
    return await this.progresoRepository.find({
      relations: {
        usuario: true,
        tema: true,
        subtema: true,
      },
    });
  }

  async findById(id: number): Promise<ProgresoUsuario> {
    const progreso = await this.progresoRepository.findOne({
      where: { idProgresoUsuario: id },
      relations: {
        usuario: true,
        tema: true,
        subtema: true,
        leccion: true,
        ejercicio: true,
      },
    });
    if (!progreso) {
      throw new NotFoundException(`Progreso con ID ${id} no encontrado`);
    }
    return progreso;
  }

  async findProgesosByUsuario(idUsuario: number): Promise<ProgresoUsuario[]> {
    return await this.progresoRepository.find({
      where: { idUsuario },
      relations: {
        tema: true,
        subtema: true,
        leccion: true,
        ejercicio: true,
      },
    });
  }

  async findUltimoProgreso(idUsuario: number): Promise<ProgresoUsuario | null> {
    const progreso = await this.progresoRepository.findOne({
      where: { idUsuario },
      order: {
        updatedAt: 'DESC', // Trae el modificado más recientemente primero
      },
      relations: {
        tema: true,
        subtema: true,
        leccion: true,
        ejercicio: true,
      },
    });
    if (!progreso) {
      throw new NotFoundException(
        `No se encontró historial de progreso para el usuario ${idUsuario}`,
      );
    }
    return progreso;
  }

  async update(
    id: number,
    updateDto: UpdateProgresoUsuarioDto,
  ): Promise<ProgresoUsuario> {
    const progreso = await this.findById(id);
    if (!progreso) {
      throw new NotFoundException(`Progreso con ID ${id} no encontrado`);
    }
    let nuevoIdEjercicio: number | null = null;

    // 1. Validar el rango del número de orden
    if (updateDto.numOrdenEjercicio !== undefined) {
      if (updateDto.numOrdenEjercicio < 1 || updateDto.numOrdenEjercicio > 3) {
        throw new BadRequestException(
          `Número de orden incorrecto. Debe estar entre 1 y 3.`,
        );
      }

      // Aseguramos que idLeccionActual sea un number (si no viene en DTO, usamos el actual)
      const idLeccionActual: number = updateDto.idLeccion ?? progreso.idLeccion;

      // 2. Buscamos el ejercicio de forma interna
      const ejercicioEncontrado =
        await this.ejercicioService.findByOrdenYLeccion(
          updateDto.numOrdenEjercicio,
          idLeccionActual,
        );
      if (!ejercicioEncontrado) {
        throw new NotFoundException('El ejercicio no existe');
      }
      nuevoIdEjercicio = ejercicioEncontrado.id_ejercicio;
    }

    if (updateDto.xpTotal !== undefined) {
      const nuevoXpTotal = progreso.xpTotal + updateDto.xpTotal;
      updateDto = { ...updateDto, xpTotal: nuevoXpTotal };
    }

    // 3. Fusionamos los datos que vinieron del DTO externo
    const progresoEditado = this.progresoRepository.merge(progreso, updateDto);

    // 4. Asignamos el ID del ejercicio internamente al objeto final antes de guardar
    if (nuevoIdEjercicio !== null) {
      progresoEditado.idEjercicio = nuevoIdEjercicio;
    }
    return await this.progresoRepository.save(progresoEditado);
  }

  async remove(id: number): Promise<{ message: string }> {
    const progreso = await this.findById(id);
    if (!progreso) {
      throw new NotFoundException(`Progreso con ID ${id} no encontrado`);
    }
    await this.progresoRepository.remove(progreso);
    return { message: `Progreso con ID ${id} eliminado correctamente` };
  }
}
