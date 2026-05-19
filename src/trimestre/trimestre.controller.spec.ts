import { Test, TestingModule } from '@nestjs/testing';
import { TrimestreController } from './trimestre.controller';

describe('TrimestreController', () => {
  let controller: TrimestreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrimestreController],
    }).compile();

    controller = module.get<TrimestreController>(TrimestreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
