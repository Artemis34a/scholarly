import { Test, TestingModule } from '@nestjs/testing';
import { VilleNaissanceController } from './ville-naissance.controller';

describe('VilleNaissanceController', () => {
  let controller: VilleNaissanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VilleNaissanceController],
    }).compile();

    controller = module.get<VilleNaissanceController>(VilleNaissanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
