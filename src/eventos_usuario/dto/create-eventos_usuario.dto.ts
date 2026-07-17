import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateEventosUsuarioDto {
    @IsNumber()
    @IsNotEmpty({ message: 'El id del usuario es obligatorio' })
    id_usuario!: number;

    @IsString()
    @IsNotEmpty({ message: 'El texto de tipo_evento no puede estar vacío.' })
    tipo_evento!: string;
    
    @IsOptional()
    @IsNumber()
    id_leccion?: number;

    @IsOptional()
    @IsNumber()
    id_ejercicio?: number;

    @IsOptional()
    @IsNumber()
    puntos?: number;
}
