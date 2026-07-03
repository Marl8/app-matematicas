import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tema } from './entities/tema.entity';
import { CreateTemaDto } from './dto/create-tema.dto';
import { UpdateTemaDto } from './dto/update-tema.dto';

@Injectable()
export class TemaService {
  constructor(
    @InjectRepository(Tema)
    private readonly temaRepository: Repository<Tema>,
  ) {}

  async findAll(): Promise<Tema[]> {
    return await this.temaRepository.find();
  }

  async findOne(id: number): Promise<Tema> {
    const tema = await this.temaRepository.findOneBy({ idTema: id });
    if (!tema) {
      throw new NotFoundException(
        `Tema con ID ${id} no encontrado en la base de datos`,
      );
    }
    return tema;
  }

  async create(
    createTemaDto: CreateTemaDto,
  ): Promise<{ message: string; tema: Tema }> {
    const { nombreTema, descripcionTema } = createTemaDto;
    const nuevoTema = this.temaRepository.create({
      nombreTema,
      descripcionTema,
    });
    const saved = await this.temaRepository.save(nuevoTema);
    return { message: 'Tema guardado', tema: saved };
  }

  async update(id: number, updateTemaDto: UpdateTemaDto) {
    const tema = await this.temaRepository.preload({
      idTema: id,
      ...updateTemaDto,
    });
    if (!tema) throw new NotFoundException('No existe el tema');
    const updated = await this.temaRepository.save(tema);
    return { message: 'Tema modificado!', tema: updated };
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const tema = await this.findOne(id);
    await this.temaRepository.remove(tema);
    return { deleted: true };
  }
}
