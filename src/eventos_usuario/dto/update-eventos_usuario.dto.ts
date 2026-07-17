import { PartialType } from '@nestjs/swagger';
import { CreateEventosUsuarioDto } from './create-eventos_usuario.dto';

export class UpdateEventosUsuarioDto extends PartialType(CreateEventosUsuarioDto) {}
