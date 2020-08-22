import { Test, TestingModule } from '@nestjs/testing';
import { OfferService } from './offer.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { of } from 'rxjs';

describe('OfferService', () => {
  let service: OfferService;
  function MockClientProxy() {
    this.data = 'res';
    this.send =() => {
      return of(this.data);
    };
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot({
          handleExceptions : true,
          level : 'error',
          transports: [
            new winston.transports.Console(),
          ]
        })
      ],
      providers: [
        OfferService,
        {provide: 'Offer_service', useValue: new MockClientProxy()}],
    }).compile();

    service = module.get<OfferService>(OfferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
