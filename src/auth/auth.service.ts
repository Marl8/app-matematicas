import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EventosUsuarioService } from '../eventos_usuario/eventos_usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly eventosUsuarioService: EventosUsuarioService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.register(createUserDto);

    await this.eventosUsuarioService.create({   // Crear un evento de registro para el usuario
      id_usuario: user.id,
      tipo_evento: 'user_register'
    });

    await this.userService.updateLastLogin(user.id);  // Actualizar el último login del usuario

    await this.eventosUsuarioService.create({       // Crear un evento de login para el usuario
      id_usuario: user.id,
      tipo_evento: 'user_login'
    });

    return user;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.userService.updateLoginStreak(user);    // Actualizar la racha de inicio de sesión del usuario

    await this.userService.updateLastLogin(user.id);  // Actualizar el último login del usuario

    await this.eventosUsuarioService.create({       // Crear un evento de login para el usuario
      id_usuario: user.id,
      tipo_evento: 'user_login'
    });

    const payload = { id: user.id, email: user.email };
    return {
      user: { id: user.id, email: user.email, avatar: user.avatar },
      token: this.jwtService.sign(payload),
    };
  }
}
