import { Test, TestingModule } from '@nestjs/testing';
import { IntentoEjercicioService } from './intento_ejercicio.service';

describe('IntentoEjercicioService', () => {
  let service: IntentoEjercicioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntentoEjercicioService],
    }).compile();

    service = module.get<IntentoEjercicioService>(IntentoEjercicioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
