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
import { ProgresoUsuarioService } from './progreso_usuario.service';
import { CreateProgresoUsuarioDto } from './dto/create-progreso_usuario.dto';
import { UpdateProgresoUsuarioDto } from './dto/update-progreso_usuario.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('progreso-usuario')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ProgresoUsuarioController {
  constructor(private readonly progresoService: ProgresoUsuarioService) {}

  @Post()
  create(@Body() createDto: CreateProgresoUsuarioDto) {
    return this.progresoService.create(createDto);
  }

  @Get()
  findAll() {
    return this.progresoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.progresoService.findById(id);
  }

  @Get('usuario/:idUsuario')
  findProgesosByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.progresoService.findProgesosByUsuario(idUsuario);
  }

  @Get('ultimoProgreso/:idUsuario')
  findUltimoProgreso(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.progresoService.findUltimoProgreso(idUsuario);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProgresoUsuarioDto,
  ) {
    return this.progresoService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.progresoService.remove(id);
  }
}
