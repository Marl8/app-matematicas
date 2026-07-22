import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Registro de un nuevo usuario (SAVE)
  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, username } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException(
        'El correo electrónico ya está registrado.',
      );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });
    return await this.userRepository.save(newUser);
  }

  // Obtener todos los usuarios (GET ALL)
  async findAll(): Promise<User[]> {
    // Ya viene limpio automáticamente ✨
    return await this.userRepository.find();
  }

  // Obtener un usuario por ID (GET BY ID)
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no fue encontrado`);
    }
    // Ya viene limpio automáticamente ✨
    return user;
  }

  // Método usado EXCLUSIVAMENTE para el Login
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  // Update user
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('No existe el usuario');
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    const updated = await this.userRepository.save(updatedUser);
    return { message: 'Usuario actualizado!', user: updated };
  }

  // Eliminar un usuario (DELETE)
  async remove(id: number): Promise<{ deleted: boolean; message: string }> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('No existe el usuario');
    await this.userRepository.remove(user);
    return {
      deleted: true,
      message: `El usuario con ID ${id} fue eliminado exitosamente.`,
    };
  }

    // Actualizar el último login del usuario
  async updateLastLogin(userId: number): Promise<void> {
    const user = await this.findOne(userId);
    user.last_login = new Date();
    await this.userRepository.save(user);
  }
  
  // Actualizar la racha de inicio de sesión del usuario
  async updateLoginStreak(user: User): Promise<void> {
    const lastLogin = user.last_login;
    const now = new Date();
    if (lastLogin) {
      const lastLoginDate = new Date(lastLogin);
      const diffInDays = Math.floor(
        (now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffInDays === 1) {
        // Si el último login fue ayer, incrementa la racha
        user.login_streak += 1;
      } else if (diffInDays > 1) {
        // Si el último login fue hace más de un día, reinicia la racha
        user.login_streak = 1;
      }
    } else {
      // Si es el primer login, inicia la racha
      user.login_streak = 1;
    }
    await this.userRepository.save(user);
  }
}
