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
import { LeccionService } from './leccion.service';
import { Leccion } from './entities/leccion.entity';
import { CreateLeccionDto } from './dto/create-leccion.dto';
import { UpdateLeccionDto } from './dto/update-leccion.dto';
import { LeccionResponseDto } from './dto/response-leccion.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('lecciones')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class LeccionController {
  constructor(private readonly leccionService: LeccionService) {}

  @Get()
  async getAll(): Promise<Leccion[]> {
    return await this.leccionService.findAll();
  }

  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LeccionResponseDto> {
    return await this.leccionService.findOne(id);
  }

  @Get('/bySubtema/:id/')
  async getLeccionsByTema(
    @Param('id', ParseIntPipe) idSubtema: number,
  ): Promise<Leccion[]> {
    return await this.leccionService.findLeccionesBySubtemaId(idSubtema);
  }

  @Post()
  async create(
    @Body() createLeccionDto: CreateLeccionDto,
  ): Promise<{ message: string; leccion: Leccion }> {
    return await this.leccionService.create(createLeccionDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeccionDto: UpdateLeccionDto,
  ) {
    return await this.leccionService.update(id, updateLeccionDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.leccionService.remove(id);
  }
}
