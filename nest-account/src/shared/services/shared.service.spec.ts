import { Test, TestingModule } from '@nestjs/testing';
import { SharedService } from './shared.service';
import { HttpModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';
import defaultConfiguration from '../../../config/default.configuration';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[HttpModule.register({
        timeout: 5000,
        maxRedirects: 5,
      }),
      WinstonModule.forRoot({
        handleExceptions : true,
        level : 'debug',
        transports: [
          new winston.transports.Console(),
        ]
      }),
      ConfigModule.forRoot({
        isGlobal : true,
        load : [defaultConfiguration]
      })],
      providers: [SharedService],
    }).compile();

    service = module.get<SharedService>(SharedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
