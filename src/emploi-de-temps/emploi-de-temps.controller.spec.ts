import { Test, TestingModule } from '@nestjs/testing';
import { EmploiDeTempsController } from './emploi-de-temps.controller';

describe('EmploiDeTempsController', () => {
  let controller: EmploiDeTempsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmploiDeTempsController],
    }).compile();

    controller = module.get<EmploiDeTempsController>(EmploiDeTempsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
