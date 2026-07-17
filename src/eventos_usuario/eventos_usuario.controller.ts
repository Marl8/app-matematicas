import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventosUsuarioService } from './eventos_usuario.service';
import { CreateEventosUsuarioDto } from './dto/create-eventos_usuario.dto';
import { UpdateEventosUsuarioDto } from './dto/update-eventos_usuario.dto';

@Controller('eventos-usuario')
export class EventosUsuarioController {
  constructor(private readonly eventosUsuarioService: EventosUsuarioService) {}

  @Post()
  create(@Body() createEventosUsuarioDto: CreateEventosUsuarioDto) {
    return this.eventosUsuarioService.create(createEventosUsuarioDto);
  }

  @Get()
  findAll() {
    return this.eventosUsuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventosUsuarioService.findOne(+id);
  }

  @Get('usuario/:id_usuario')
  findByUsuario(@Param('id_usuario') id_usuario: string) {
    return this.eventosUsuarioService.findByUsuario(+id_usuario);
  }
}
