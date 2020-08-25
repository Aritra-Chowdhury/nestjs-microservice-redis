import { Test, TestingModule } from '@nestjs/testing';
import { OfferService } from './offer.service';
import { getModelToken } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { OfferDto } from '../dto/offer.dto';

describe('OfferService', () => {
  let service: OfferService;
  let offerDto:OfferDto;
  let offerRes : any;
  function MockOfferModel(dto:any){
    this.data = dto;
    this.findOne = ()=>{
      return this.data;
    }
    this.find = ()=>{
      return this.data;
    }
    this.save = ()=>{
      return this.data;
    }
    this.findByIdAndUpdate = ()=>{
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
      providers: [OfferService,
      {provide : getModelToken('Offer'),useValue: new MockOfferModel(offerRes)}],
    }).compile();

    service = module.get<OfferService>(OfferService);

    offerRes.transform = jest.fn().mockImplementation(()=> offerRes);
  });

  
  function MockOfferCreateUpdateModel(dto:any , findOneData:any ,findData:any ){
    this.data = dto;
    this.findOneData = findOneData
    this.findData = findData
    this.findOne = ()=>{
      return this.findOneData;
    }
    this.find = ()=>{
      return this.findData;
    }
    this.save = ()=>{
      return this.data;
    }
    this.findByIdAndUpdate = (id,dto)=>{
      if(id == this.data.offerId)
      return this.data;
      else return null;
    }
  }

  const execModule = async (data:any , findOneData:any ,findData:any) => {
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
      providers: [OfferService,
      {provide : getModelToken('Offer'),useValue: new MockOfferCreateUpdateModel(data , findOneData ,findData )}],
    }).compile();

    service = module.get<OfferService>(OfferService);
    offerRes.transform = jest.fn().mockImplementation(()=> offerRes);
  };

  describe('createOffer',()=>{

    const exec = ()=>{
      return service.createOffer(offerDto);
    }
    it('should throw Offer with offer name already exist!',async ()=>{

      try{
        await exec();
      }catch(error){
        expect(error.message).toBe('Offer with offer name already exist!');
        expect(error.error.status).toBe(400);
      } 
    });

    it('should throw Offer with offerType:Premium already exist for loanType:Car !',async ()=>{

      try{
        await execModule(offerRes, null , offerRes);
        await exec();
      }catch(error){
        expect(error.message).toBe('Offer with offerType:Premium already exist for loanType:Car !');
        expect(error.error.status).toBe(400);
      } 
    });

    // it('should be able to create an offer',async ()=>{

    //   await execModule(offerRes, null , null);
    //   const result = await exec();
    //   expect(result.offerId).toBe('123456789');
    // }); 
  });

  describe('updateOffer',()=>{

    const exec = ()=>{
      return service.updateOffer(offerDto);
    }
    it('should throw Offer with offer name already exist!',async ()=>{

      try{
        offerDto.offerId = '987456321';
        await exec();
      }catch(error){
        expect(error.message).toBe('Offer with offer name already exist!');
        expect(error.error.status).toBe(400);
      } 
    });

    it('should throw Offer with offerType:Premium already exist for loanType:Car !',async ()=>{

      try{
        offerDto.offerId = '987456321';
        await execModule(offerRes, null , offerRes);
        await exec();
      }catch(error){
        expect(error.message).toBe('Offer with offerType:Premium already exist for loanType:Car !');
        expect(error.error.status).toBe(400);
      } 
    });

    it('should throw No offer found!',async ()=>{

      try{
        offerDto.offerId = '987456321';
        await execModule(offerRes, null , null);
        await exec();
      }catch(error){
        expect(error.message).toBe('No offer found!');
        expect(error.error.status).toBe(404);
      } 
    });

    it('should be able to update an offer',async ()=>{

      offerDto.offerId = '123456789';
      offerRes.offerType = 'Gold';
      await execModule(offerRes, null , null);
      const result = await exec();
      expect(result.offerId).toBe('123456789');
      expect(result.offerType).toBe('Gold');
    }); 
  });

  describe('getOfferByLoanTypeAndOfferType',()=>{

    const exec = ()=>{
      return service.getOfferByLoanTypeAndOfferType(offerDto.loanType,offerDto.offerType);
    }
    it('should throw No offer available for the loan type and offer Type!',async ()=>{

      try{
        await execModule(offerRes, null , []);
        await exec();
      }catch(error){
        expect(error.message).toBe('No offer available for the loan type and offer Type!');
        expect(error.error.status).toBe(404);
      } 
    });

    it('should be able to get Offer By LoanType And OfferType',async ()=>{
      await execModule(offerRes, null , [offerRes]);
      const result = await exec();
      expect(result[0].offerId).toBe('123456789');

    }); 
  });

  describe('getAllOffer',()=>{

    const exec = ()=>{
      return service.getAllOffer();
    }
    it('should throw No offer available!',async ()=>{

      try{
        await execModule(offerRes, null , []);
        await exec();
      }catch(error){
        expect(error.message).toBe('No offer available!');
        expect(error.error.status).toBe(404);
      } 
    });

    it('should be able to get All Offer',async ()=>{
      await execModule(offerRes, null , [offerRes]);
      const result = await exec();
      expect(result[0].offerId).toBe('123456789');

    }); 
  });

  describe('getOfferByofferName',()=>{

    const exec = ()=>{
      return service.getOfferByofferName(offerDto.offerName);
    }
    it('should throw No offer found with the offer name!',async ()=>{

      try{
        await execModule(offerRes, null , null);
        await exec();
      }catch(error){
        expect(error.message).toBe('No offer found with the offer name!');
        expect(error.error.status).toBe(404);
      } 
    });

    it('should be able to get All Offer',async ()=>{
      await execModule(offerRes, offerRes , null);
      const result = await exec();
      expect(result.offerId).toBe('123456789');

    }); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
