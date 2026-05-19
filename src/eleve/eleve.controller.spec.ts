import { Test, TestingModule } from '@nestjs/testing';
import { EleveController } from './eleve.controller';

describe('EleveController', () => {
  let controller: EleveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EleveController],
    }).compile();

    controller = module.get<EleveController>(EleveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
