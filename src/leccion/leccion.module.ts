import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leccion } from './entities/leccion.entity';
import { LeccionService } from './leccion.service';
import { LeccionController } from './leccion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Leccion])],
  controllers: [LeccionController],
  providers: [LeccionService],
  exports: [LeccionService],
})
export class LeccionModule {}
