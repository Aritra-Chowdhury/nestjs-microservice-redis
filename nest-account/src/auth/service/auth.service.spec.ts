import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import defaultConfiguration from '../../../config/default.configuration';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WinstonModule.forRoot({
        handleExceptions : true,
        level : 'debug',
        transports: [
          new winston.transports.Console(),
        ]
      }),
    SharedModule,
    ConfigModule.forRoot({
      isGlobal : true,
      load : [defaultConfiguration]
    })],
      providers: [AuthService,ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
