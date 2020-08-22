import { Test, TestingModule } from '@nestjs/testing';
import { LoanController } from './loan.controller';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoanService } from '../service/loan.service';
import { JwtAuthGuard } from '../../gateway-customer/authgaurd/jwt.gaurd';
import { ValidationPipe } from '../../shared/validation.pipe';
import { JwtModule } from '@nestjs/jwt';
import { GatewayCustomerModule } from '../../gateway-customer/gateway-customer.module';

describe('Loan Controller', () => {
  let controller: LoanController;

  function mockLoanService(){
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GatewayCustomerModule,
        WinstonModule.forRoot({
          handleExceptions : true,
          level : 'error',
          transports: [
            new winston.transports.Console(),
          ]
        }),
        JwtModule.register({
          secret: 'privatekey',
          signOptions: { expiresIn: '10000s' },
        })
      ],
      controllers: [LoanController],
      providers: [
        JwtAuthGuard,
        ValidationPipe,
        {provide: LoanService , useValue:new mockLoanService()}
      ]
    }).compile();

    controller = module.get<LoanController>(LoanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
