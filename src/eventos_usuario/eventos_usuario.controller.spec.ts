import { Test, TestingModule } from '@nestjs/testing';
import { EventosUsuarioController } from './eventos_usuario.controller';
import { EventosUsuarioService } from './eventos_usuario.service';

describe('EventosUsuarioController', () => {
  let controller: EventosUsuarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventosUsuarioController],
      providers: [EventosUsuarioService],
    }).compile();

    controller = module.get<EventosUsuarioController>(EventosUsuarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
