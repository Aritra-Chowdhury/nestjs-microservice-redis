import { Test, TestingModule } from '@nestjs/testing';
import { MongooseConfigurationService } from './mongoose.service';

describe('MongooseService', () => {
  let service: MongooseConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongooseConfigurationService],
    }).compile();

    service = module.get<MongooseConfigurationService>(MongooseConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
