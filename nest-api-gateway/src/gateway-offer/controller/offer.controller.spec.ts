import { Test, TestingModule } from '@nestjs/testing';
import { OfferController } from './offer.controller';
import { GatewayCustomerModule } from '../../gateway-customer/gateway-customer.module';
import { WinstonModule } from 'nest-winston';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../gateway-customer/authgaurd/jwt.gaurd';
import { ValidationPipe } from '@nestjs/common';
import { OfferService } from '../service/offer.service';
import * as winston from 'winston';

describe('Offer Controller', () => {
  let controller: OfferController;

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
      controllers: [OfferController],
      providers: [
        JwtAuthGuard,
        ValidationPipe,
        {provide: OfferService , useValue:new mockLoanService()}
      ]
     
    }).compile();

    controller = module.get<OfferController>(OfferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
