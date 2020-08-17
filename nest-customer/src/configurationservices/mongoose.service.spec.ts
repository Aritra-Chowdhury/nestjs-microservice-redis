import { Test, TestingModule } from '@nestjs/testing';
import { MongooseConfigurationService } from './mongoose.service';
import { ConfigService } from '@nestjs/config';

describe('MongooseService', () => {
  let service: MongooseConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongooseConfigurationService,ConfigService],
    }).compile();

    service = module.get<MongooseConfigurationService>(MongooseConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
