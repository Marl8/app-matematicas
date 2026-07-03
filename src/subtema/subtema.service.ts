import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subtema } from './entities/subtema.entity';
import { CreateSubtemaDto } from './dto/create-subtema.dto';
import { UpdateSubtemaDto } from './dto/update-subtema.dto';
import { DificultadSubtema } from './entities/enums/dificultad.enum';

@Injectable()
export class SubtemaService {
  constructor(
    @InjectRepository(Subtema)
    private readonly subtemaRepository: Repository<Subtema>,
  ) {}

  async create(
    createSubtemaDto: CreateSubtemaDto,
  ): Promise<{ message: string; subtema: Subtema }> {
    const dificultad = createSubtemaDto.dificultadSubtema.toUpperCase();

    if (!(dificultad in DificultadSubtema)) {
      throw new BadRequestException('Dificultad inválida');
    }
    const subtema = {
      ...createSubtemaDto,
      dificultadSubtema: dificultad as DificultadSubtema,
    };
    const nuevoSubtema = this.subtemaRepository.create(subtema);
    const saved: Subtema = await this.subtemaRepository.save(nuevoSubtema);
    return { message: 'Guardado exitoso', subtema: saved };
  }

  async findAll(): Promise<Subtema[]> {
    return await this.subtemaRepository.find();
  }

  async findSubtemasByTemaId(idTema: number): Promise<Subtema[]> {
    return await this.subtemaRepository.find({
      where: {
        tema: {
          idTema: idTema,
        },
      },
    });
  }

  async findOne(id: number): Promise<Subtema> {
    const subtema = await this.subtemaRepository.findOne({
      where: { idSubtema: id },
      relations: { tema: true },
    });
    if (!subtema) {
      throw new NotFoundException(`Subtema con ID ${id} no encontrado`);
    }
    return subtema;
  }

  async update(id: number, updateSubtemaDto: UpdateSubtemaDto) {
    const subtema = await this.findOne(id);

    if (updateSubtemaDto.dificultadSubtema) {
      const dificultad = updateSubtemaDto.dificultadSubtema.toUpperCase();

      if (!(dificultad in DificultadSubtema)) {
        throw new BadRequestException('La dificultad ingresada no es válida');
      }
      updateSubtemaDto.dificultadSubtema = dificultad as DificultadSubtema;
    }
    const subtemaEditado = this.subtemaRepository.merge(
      subtema,
      updateSubtemaDto,
    );
    const updated = await this.subtemaRepository.save(subtemaEditado);
    return {
      message: 'Modificado con éxito',
      subtema: updated,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const subtema = await this.findOne(id);
    await this.subtemaRepository.remove(subtema);
    return { message: `Subtema con ID ${id} eliminado correctamente` };
  }
}
