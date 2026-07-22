import { Test, TestingModule } from '@nestjs/testing';
import { IntentoEjercicioController } from './intento_ejercicio.controller';
import { IntentoEjercicioService } from './intento_ejercicio.service';

describe('IntentoEjercicioController', () => {
  let controller: IntentoEjercicioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntentoEjercicioController],
      providers: [IntentoEjercicioService],
    }).compile();

    controller = module.get<IntentoEjercicioController>(IntentoEjercicioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
