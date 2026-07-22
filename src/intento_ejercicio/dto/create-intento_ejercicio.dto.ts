import {IsBoolean,IsInt,IsOptional,Min,} from 'class-validator';

export class CreateIntentoEjercicioDto {
    @IsInt()
    id_usuario!: number;

    @IsInt()
    id_subtema!: number;

    @IsInt()
    id_ejercicio!: number;

    @IsOptional()
    @IsInt()
    id_opciones?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    nro_intento?: number;

    @IsOptional()
    @IsBoolean()
    completado?: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    response_time?: number;
}