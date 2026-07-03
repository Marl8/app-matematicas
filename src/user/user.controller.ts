import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users -> Obtener todos los usuarios
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // GET /users/:id -> Obtener un usuario específico por su ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // El ParseIntPipe valida que el formato enviado sea un number
    return this.userService.findOne(id);
  }

  // PATCH /users/:id -> Actualizar un usuario específico por su ID
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // DELETE /users/:id -> Eliminar un usuario del sistema
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
