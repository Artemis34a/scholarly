import { Test, TestingModule } from '@nestjs/testing';
import { TitulaireController } from './titulaire.controller';

describe('TitulaireController', () => {
  let controller: TitulaireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TitulaireController],
    }).compile();

    controller = module.get<TitulaireController>(TitulaireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
