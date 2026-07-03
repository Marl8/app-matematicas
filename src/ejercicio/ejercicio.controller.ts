import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Ejercicio } from './entities/ejercicio.entity';
import { EjercicioService } from './ejercicio.service';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('ejercicios')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class EjercicioController {
  constructor(private readonly ejercicioService: EjercicioService) {}

  @Post()
  async create(@Body() createEjercicioDto: CreateEjercicioDto) {
    return await this.ejercicioService.create(createEjercicioDto);
  }

  @Get()
  async findAll() {
    return await this.ejercicioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.ejercicioService.findOne(id);
  }

  @Get('leccion/:idLeccion/orden/:numOrden')
  async findByNumOrdenYLeccion(
    @Param('idLeccion', ParseIntPipe) idLeccion: number,
    @Param('numOrden', ParseIntPipe) numOrden: number,
  ): Promise<Ejercicio> {
    return await this.ejercicioService.findByOrdenYLeccion(numOrden, idLeccion);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEjercicioDto: UpdateEjercicioDto,
  ) {
    return this.ejercicioService.update(id, updateEjercicioDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.ejercicioService.remove(id);
  }
}
