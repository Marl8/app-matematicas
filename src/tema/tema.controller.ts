import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { TemaService } from './tema.service';
import { CreateTemaDto } from './dto/create-tema.dto';
import { UpdateTemaDto } from './dto/update-tema.dto';
import { Tema } from './entities/tema.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('temas')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class TemaController {
  constructor(private readonly temaService: TemaService) {}

  @Get('/')
  findAll(): Promise<Tema[]> {
    return this.temaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Tema> {
    return await this.temaService.findOne(id);
  }

  @Post('/')
  async create(
    @Body() createTemaDto: CreateTemaDto,
  ): Promise<{ message: string; tema: Tema }> {
    return await this.temaService.create(createTemaDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTemaDto: UpdateTemaDto,
  ) {
    return await this.temaService.update(id, updateTemaDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ deleted: boolean }> {
    return await this.temaService.remove(id);
  }
}
