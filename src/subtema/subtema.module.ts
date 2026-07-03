import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubtemaService } from './subtema.service';
import { SubtemaController } from './subtema.controller';
import { Subtema } from './entities/subtema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subtema])],
  controllers: [SubtemaController],
  providers: [SubtemaService],
  exports: [SubtemaService],
})
export class SubtemaModule {}
