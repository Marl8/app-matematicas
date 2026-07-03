import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { TemaModule } from './tema/tema.module';
import { SubtemaModule } from './subtema/subtema.module';
import { LeccionModule } from './leccion/leccion.module';
import { EjercicioModule } from './ejercicio/ejercicio.module';
import { OpcionesEjercicioModule } from './opciones_ejercicio/opciones_ejercicio.module';
import { ProgresoUsuarioModule } from './progreso_usuario/progreso_usuario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TemaModule,
    SubtemaModule,
    LeccionModule,
    EjercicioModule,
    OpcionesEjercicioModule,
    ProgresoUsuarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
