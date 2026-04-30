import { Test, TestingModule } from '@nestjs/testing';
import { PersonneController } from './personne.controller';

describe('PersonneController', () => {
  let controller: PersonneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonneController],
    }).compile();

    controller = module.get<PersonneController>(PersonneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
