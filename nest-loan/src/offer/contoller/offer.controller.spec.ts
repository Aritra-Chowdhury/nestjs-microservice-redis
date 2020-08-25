import { Test, TestingModule } from '@nestjs/testing';
import { OfferController } from './offer.controller';
import { OfferService } from '../service/offer.service';
import { OfferDto } from '../dto/offer.dto';
import { getModelToken } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

describe('Offer Controller', () => {
  let controller: OfferController;
  let offerDto:OfferDto;
  let offerRes : any;

  function MockOfferModel(dto:any){
    this.data = dto;
  }

  function MockOfferService(dto:any){
    this.data = dto;
    this.createOffer = ()=>{
      return this.data;
    }
    this.updateOffer = ()=>{
      return this.data;
    }
    this.getOfferByLoanTypeAndOfferType = ()=>{
      return [this.data];
    }
    this.getAllOffer = ()=>{
      return [this.data];
    }
    this.getOfferByofferName = ()=>{
      return this.data;
    }
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

    const module: TestingModule = await Test.createTestingModule({
      imports:[
        WinstonModule.forRoot({
        handleExceptions : true,
        level : 'error',
        transports: [
          new winston.transports.Console()
        ]
      })
    ],
      controllers: [OfferController],
      providers: [
        {provide : getModelToken('Offer'),useValue: new MockOfferModel(offerRes)},
        {provide: OfferService , useValue: new MockOfferService(offerRes)}
      ]
    }).compile();

    controller = module.get<OfferController>(OfferController);
  });

  describe('createOffer',()=>{
    it('it should be able to create an offer',async ()=>{
      const result = await controller.createOffer(offerDto);
      expect(result.status).toBe(201);
      expect(result.data.offerId).toBe('123456789');
    });
  });

  describe('updateOffer',()=>{
    it('it should be able to update an offer',async ()=>{
      offerDto.loanType = 'Home';
      offerRes.loanType = 'Home';
      const result = await controller.updateOffer(offerDto);
      expect(result.status).toBe(200);
      expect(result.data.offerId).toBe('123456789');
      expect(result.data.loanType).toBe(offerDto.loanType);
    });
  });

  describe('getOfferByLoanTypeAndOfferType',()=>{
    it('it should be able to get Offer By LoanType And OfferType',async ()=>{
      const result = await controller.getOfferByLoanTypeAndOfferType(offerDto);
      expect(result.status).toBe(200);
      expect(result.data[0].offerId).toBe('123456789');
      expect(result.data[0].offerType).toBe(offerDto.offerType);
      expect(result.data[0].loanType).toBe(offerDto.loanType);
    });
  });

  describe('getAllOffer',()=>{
    it('it should be able to get All Offer',async ()=>{
      const result = await controller.getAllOffer();
      expect(result.status).toBe(200);
      expect(result.data[0].offerId).toBe('123456789');
    });
  });

  describe('getOfferByofferName',()=>{
    it('it should be able to get Offer By offerName',async ()=>{
      const result = await controller.getOfferByofferName(offerDto.offerName);
      expect(result.status).toBe(200);
      expect(result.data.offerId).toBe('123456789');
      expect(result.data.offerName).toBe(offerDto.offerName);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
