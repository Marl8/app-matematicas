import { Test, TestingModule } from '@nestjs/testing';
import { EventosUsuarioService } from './eventos_usuario.service';

describe('EventosUsuarioService', () => {
  let service: EventosUsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventosUsuarioService],
    }).compile();

    service = module.get<EventosUsuarioService>(EventosUsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
