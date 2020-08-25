import { Test, TestingModule } from '@nestjs/testing';
import { OfferController } from './offer.controller';
import { GatewayCustomerModule } from '../../gateway-customer/gateway-customer.module';
import { WinstonModule } from 'nest-winston';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../gateway-customer/authgaurd/jwt.gaurd';
import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { OfferService } from '../service/offer.service';
import * as winston from 'winston';
import { OfferDto } from '../dto/offer.dto';

describe('Offer Controller', () => {
  let controller: OfferController;
  let service: OfferService;
  let offerDto:OfferDto;
  let offerRes : any;
  let offerResponse : any;

  function mockLoanService(){
  }
  beforeEach(async () => {
    offerDto = new OfferDto();
    offerDto.offerName = 'Offer1';
    offerDto.loanType = 'Car';
    offerDto.offerType = 'Premium',
    offerDto.offerPercentage = 12.5;

    offerRes = new OfferDto();
    offerRes.offerName = 'Offer1';
    offerRes.loanType = 'Car';
    offerRes.offerType = 'Premium',
    offerRes.offerPercentage = 12.5;
    offerRes.offerId = '123456789';
    offerRes.lastUpdateDate = Date.now().toString();

    offerResponse = {
      status : HttpStatus.OK,
      data : offerRes
    }

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
    service = module.get<OfferService>(OfferService);
  });
  
  describe('createOffer',()=>{
    it('should be able to create an offer',async()=>{
      offerResponse = {
        status : HttpStatus.CREATED,
        data : offerRes
      }
      const mockResponse= {
        status : jest.fn().mockReturnThis(),
        send : jest.fn().mockReturnValue(offerResponse)
      }
      service.createOffer = jest.fn().mockReturnValue(offerRes);
      const result = await controller.createOffer(mockResponse,offerDto);
      expect(result.status).toBe(201);
      expect(result.data.offerId).toBe('123456789');

    });
  });

  describe('updateOffer',()=>{
    it('should be able to update an offer',async()=>{
      offerDto.loanType = 'Home';
      offerRes.loanType = 'Home';
      const mockResponse= {
        status : jest.fn().mockReturnThis(),
        send : jest.fn().mockReturnValue(offerResponse)
      }
      service.updateOffer = jest.fn().mockReturnValue(offerRes);
      const result = await controller.updateOffer(mockResponse,offerDto);
      expect(result.status).toBe(200);
      expect(result.data.offerId).toBe('123456789');
      expect(result.data.loanType).toBe(offerDto.loanType);

    });
  });

  describe('getOfferByLoanTypeAndOfferType',()=>{
    it('should be able to get Offer By LoanType And OfferType',async()=>{
      offerResponse = {
        status : HttpStatus.OK,
        data : [offerRes]
      }
      const mockResponse= {
        status : jest.fn().mockReturnThis(),
        send : jest.fn().mockReturnValue(offerResponse)
      }
      service.getOfferByLoanTypeAndOfferType = jest.fn().mockReturnValue([offerRes]);
      const result = await controller.getOfferByLoanTypeAndOfferType(mockResponse,offerDto.loanType,offerDto.offerType);
      expect(result.status).toBe(200);
      expect(result.data[0].offerId).toBe('123456789');
      expect(result.data[0].loanType).toBe(offerDto.loanType);
      expect(result.data[0].offerType).toBe(offerDto.offerType);

    });
  });

  describe('getAllOffer',()=>{
    it('should be able to get All Offer',async()=>{
      offerResponse = {
        status : HttpStatus.OK,
        data : [offerRes]
      }
      const mockResponse= {
        status : jest.fn().mockReturnThis(),
        send : jest.fn().mockReturnValue(offerResponse)
      }
      service.getAllOffer = jest.fn().mockReturnValue([offerRes]);
      const result = await controller.getAllOffer(mockResponse);
      expect(result.status).toBe(200);
      expect(result.data[0].offerId).toBe('123456789');
      expect(result.data[0].loanType).toBe(offerDto.loanType);
      expect(result.data[0].offerType).toBe(offerDto.offerType);

    });
  });

  describe('getOfferByofferName',()=>{
    it('should be able to get Offer By offerName',async()=>{
      const mockResponse= {
        status : jest.fn().mockReturnThis(),
        send : jest.fn().mockReturnValue(offerResponse)
      }
      service.getOfferByofferName = jest.fn().mockReturnValue(offerRes);
      const result = await controller.getOfferByofferName(mockResponse,offerDto.offerName);
      expect(result.status).toBe(200);
      expect(result.data.offerName).toBe('Offer1');

    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
