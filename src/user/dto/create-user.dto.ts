import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email!: string; // Usamos ! porque class-validator se encarga de que no sea undefined

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'La username es obligatoria' })
  @MinLength(6, { message: 'La username debe tener al menos 6 caracteres' })
  username!: string;

  @IsString()
  avatar!: string;
}
