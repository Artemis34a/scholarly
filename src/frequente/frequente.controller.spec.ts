import { Test, TestingModule } from '@nestjs/testing';
import { FrequenteController } from './frequente.controller';

describe('FrequenteController', () => {
  let controller: FrequenteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrequenteController],
    }).compile();

    controller = module.get<FrequenteController>(FrequenteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
