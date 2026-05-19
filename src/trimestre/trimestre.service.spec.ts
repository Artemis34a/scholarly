import { Test, TestingModule } from '@nestjs/testing';
import { TrimestreService } from './trimestre.service';

describe('TrimestreService', () => {
  let service: TrimestreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrimestreService],
    }).compile();

    service = module.get<TrimestreService>(TrimestreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
