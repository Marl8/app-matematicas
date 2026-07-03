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
import { SubtemaService } from './subtema.service';
import { Subtema } from '../subtema/entities/subtema.entity';
import { CreateSubtemaDto } from './dto/create-subtema.dto';
import { UpdateSubtemaDto } from './dto/update-subtema.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('subtemas')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class SubtemaController {
  constructor(private readonly subtemaService: SubtemaService) {}

  @Post()
  create(@Body() createSubtemaDto: CreateSubtemaDto) {
    return this.subtemaService.create(createSubtemaDto);
  }

  @Get()
  findAll() {
    return this.subtemaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subtemaService.findOne(id);
  }

  @Get('/byTema/:id')
  async getSubtemasByTema(
    @Param('id', ParseIntPipe) idTema: number,
  ): Promise<Subtema[]> {
    return await this.subtemaService.findSubtemasByTemaId(idTema);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubtemaDto: UpdateSubtemaDto,
  ) {
    return this.subtemaService.update(id, updateSubtemaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subtemaService.remove(id);
  }
}
