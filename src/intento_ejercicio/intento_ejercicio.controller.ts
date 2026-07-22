import {Controller,Get,Post,Body,Patch,Param,Delete,} from '@nestjs/common';

import { IntentoEjercicioService } from './intento_ejercicio.service';
import { CreateIntentoEjercicioDto } from './dto/create-intento_ejercicio.dto';

@Controller('intento-ejercicio')
export class IntentoEjercicioController {
  constructor(
    private readonly intentoEjercicioService: IntentoEjercicioService,
  ) {}

  @Post()
  create(@Body() createDto: CreateIntentoEjercicioDto) {
    return this.intentoEjercicioService.create(createDto);
  }

  @Get()
  findAll() {
    return this.intentoEjercicioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.intentoEjercicioService.findOne(+id);
  }
}