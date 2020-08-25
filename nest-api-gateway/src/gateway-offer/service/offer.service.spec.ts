import { Test, TestingModule } from '@nestjs/testing';
import { OfferService } from './offer.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { of, throwError } from 'rxjs';
import { OfferDto } from '../dto/offer.dto';
import { HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoanDto } from 'src/gateway-loan/dto/loan.dto';

describe('OfferService', () => {
  let service: OfferService;
  let offerDto:OfferDto;
  let offerRes : any;
  let offerResponse : any;
  let offerClient : ClientProxy;

  function MockClientProxy(res:any) {
    this.data = res;
    this.send =() => {
      return of(this.data);
    };
  };

  
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
        {provide: 'Offer_service', useValue: new MockClientProxy(offerResponse)}],
    }).compile();

    service = module.get<OfferService>(OfferService);
    offerClient = module.get('Offer_service');
  });

  describe('createOffer', ()=>{
    it('Should be able to create an offer', async ()=>{
      offerClient.send = jest.fn().mockReturnValue(of(offerResponse));
      const result = await service.createOffer(offerDto);
      expect(result.offerId).toBe('123456789');
    });

    it('Should throw Error while calling OfferServiceService', async ()=>{
      try{
        offerClient.send = jest.fn().mockReturnValue(throwError('error'));
        const result = await service.createOffer(offerDto);
      }catch(error){
        expect(error.message).toBe('Error while calling OfferServiceService');
        expect(error.status).toBe(500);
      } 
    });

    it('Should throw Offer with offer name already exists!', async ()=>{
      offerResponse = {
        status : HttpStatus.BAD_REQUEST,
        message : 'Offer with offer name already exists!'
      }
      try{
        offerClient.send = jest.fn().mockReturnValue(of(offerResponse));
        const result = await service.createOffer(offerDto);
      }catch(error){
        expect(error.message).toBe('Offer with offer name already exists!');
        expect(error.status).toBe(400);
      } 
    });
   
  });

  describe('updateOffer', ()=>{
    it('Should be able to update an offer', async ()=>{
      offerDto.offerId='123456789';
      offerResponse.data.offerType='Gold';

      offerDto.offerType='Gold';
      const result = await service.updateOffer(offerDto);
      expect(result.offerId).toBe('123456789');
      expect(result.offerType).toBe('Gold');
    });
   
  });

  describe('getOfferByLoanTypeAndOfferType', ()=>{
    it('Should be able to get Offer By LoanType And OfferType', async ()=>{
      offerResponse = {
        status : HttpStatus.OK,
        data : [offerRes]
      }
      offerClient.send = jest.fn().mockReturnValue(of(offerResponse));
      const result = await service.getOfferByLoanTypeAndOfferType(offerDto.loanType,offerDto.offerType);
      expect(result[0].offerId).toBe('123456789');
      expect(result[0].offerType).toBe('Premium');
      expect(result[0].loanType).toBe('Car');
    });
   
  });

  describe('getAllOffer', ()=>{
    it('Should be able to get All', async ()=>{
      offerResponse = {
        status : HttpStatus.OK,
        data : [offerRes]
      }
      offerClient.send = jest.fn().mockReturnValue(of(offerResponse));
      const result = await service.getAllOffer();
      expect(result[0].offerId).toBe('123456789');
      expect(result[0].offerType).toBe('Premium');
      expect(result[0].loanType).toBe('Car');
    });
   
  });

  describe('getOfferByofferName', ()=>{
    it('Should be able to get Offer By offerName', async ()=>{
      const result = await service.getOfferByofferName(offerDto.offerName);
      expect(result.offerId).toBe('123456789');
      expect(result.offerName).toBe('Offer1');
    });
   
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
