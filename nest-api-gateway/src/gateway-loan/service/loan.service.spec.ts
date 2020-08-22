import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { of } from 'rxjs';

describe('LoanService', () => {
  let service: LoanService;

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
        LoanService,
        {provide: 'Loan_service', useValue: new MockClientProxy()}],
    }).compile();

    service = module.get<LoanService>(LoanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
