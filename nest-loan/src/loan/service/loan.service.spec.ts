import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { getModelToken } from '@nestjs/mongoose';
import { OfferService } from '../../offer/service/offer.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { of } from 'rxjs';
import { HttpStatus } from '@nestjs/common';
import { LoanDto } from '../dto/loan.dto';
import { RpcException } from '@nestjs/microservices';

describe('LoanService', () => {
  let service: LoanService;
  let offerService: OfferService;
  let offer:any;
  let loanDto: LoanDto;
  let loanRes:any;
  function MockLoanModel(dto:any){
    this.data = dto;
    this.findById = (id)=>{
      if(id === '987654321')
      return this.data;
      else return null;
    }
    this.find = (data:any)=>{
      if(data.customerId === '123456789')
      return [this.data];
      else return [];
    }
    this.save = ()=>{
      return this.data;
    }
    this.findByIdAndUpdate = (id:string)=>{
      if(id === '987654321')
      return this.data;
      else return null;
    }
  }
  function MockOfferModel(){
    this.data = '';
  }
  function MockOfferService(){
    this.data = '';
  }

  function MockClientProxy(res) {
    this.data = res;
    this.send =() => {
      return of(this.data);
    };
  };

  const accountRes:any = {
    status : HttpStatus.OK,
    data : {
      accountNumber:'987654321',
      accountType:'current',
      opening_date:Date.now().toString(),
      customerId : "123456789",
      isJoint : false,
    }
  }
  beforeEach(async () => {
    offer = {
      offerName : 'Offer1',
      offerType : 'Gold',
      offerPercentage : 10
    }
    loanDto = new LoanDto();
    loanDto.customerId = '123456789';
    loanDto.loanAmount = 10000;
    loanDto.loanDuration = '5';
    loanDto.loanType = 'Car';
    loanDto.offer = offer;

    loanRes = new LoanDto();
    loanRes.loanNumber = '987654321';
    loanRes.customerId = '123456789';
    loanRes.loanAmount = 10000;
    loanRes.monthlyEMI = 250;
    loanRes.loanDuration = '5';
    loanRes.loanType = 'Car';
    loanRes.status = 'Pending';
    loanRes.loanCreationDate = Date.now().toString();
    loanRes.lastUpdatedDate = Date.now().toString();

    loanRes.offer = offer;

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
      providers: [
        LoanService,
        {provide : getModelToken('Offer'),useValue: new MockOfferModel()},
        {provide : getModelToken('Loan'),useValue: new MockLoanModel(loanRes)},
        {provide: OfferService , useValue: new MockOfferService()},
        {provide: 'Account_service', useValue: new MockClientProxy(accountRes)}
      ],
    }).compile();

    service = module.get<LoanService>(LoanService);
    offerService = module.get<OfferService>(OfferService);
    loanRes.transform = jest.fn().mockImplementation(()=> loanRes);
  });

  describe('createLoan',()=>{
    const exec =()=>{
      return service.createLoan(loanDto);
    }

    // it('should be able to create a loan',async ()=>{
    //   offerService.getOfferByofferName = jest.fn().mockReturnValue(offer);
    //   const result = await exec();
    //   expect(result.loanNumber).toBe('987654321');
    // });

    it('should be throw No account found for account number!',async ()=>{
      service.makeServiceCall = jest.fn().mockReturnValue(null);
      try{
        await exec();
      }catch(error){
        expect(error.message).toBe('No account found for account number!');
        expect(error.error.status).toBe(404);
      } 
    });

    it('should be throwNo offer found for the offer name!',async ()=>{
      offerService.getOfferByofferName = jest.fn().mockImplementation(()=>{
        throw new RpcException({message:'No offer found for the offer name!',status:HttpStatus.NOT_FOUND});});
      try{
        await exec();
      }catch(error){
        expect(error.message).toBe('No offer found for the offer name!');
        expect(error.error.status).toBe(400);
      } 
    });
  });

  describe('updateLoan',()=>{
    const exec =()=>{
      return service.updateLoan(loanDto);
    }

    it('should be able to update a loan',async ()=>{
      loanDto.loanNumber = '987654321';
      offerService.getOfferByofferName = jest.fn().mockReturnValue(offer);
      const result = await exec();
      expect(result.loanNumber).toBe('987654321');
      expect(result.monthlyEMI).toBe(250);
    });

    it('should be throw No offer found for the offer name!',async ()=>{
      loanDto.loanNumber = '654123789';
      offerService.getOfferByofferName = jest.fn().mockImplementation(()=>{
        throw new RpcException({message:'No offer found for the offer name!',status:HttpStatus.NOT_FOUND});});
      try{
        await exec();
      }catch(error){
        expect(error.message).toBe('No offer found for the offer name!');
        expect(error.error.status).toBe(400);
      } 
    });

    it('should be throw Loan number does not exist!',async ()=>{
      loanDto.loanNumber = '654123789';
      offerService.getOfferByofferName = jest.fn().mockReturnValue(offer);
      try{
        await exec();
      }catch(error){
        expect(error.message).toBe('Loan number does not exist!');
        expect(error.error.status).toBe(404);
      } 
    });
  });

  describe('validateLoan',()=>{
    const exec =()=>{
      return service.validateLoan(loanDto);
    }

    it('should be able to validate a loan',async ()=>{
      loanDto.loanNumber = '987654321';
      loanDto.status = 'Approved';
      loanRes.status = 'Approved';
      const result = await exec();
      expect(result.loanNumber).toBe('987654321');
      expect(result.status).toBe('Approved');
    });


    it('should be throw Loan number does not exist!',async ()=>{
      loanDto.loanNumber = '654123789';
      try{
        await exec();
      }catch(error){
        expect(error.message).toBe('Loan number does not exist!');
        expect(error.error.status).toBe(404);
      } 
    });
  });

  describe('getLoanById',()=>{
    const exec =()=>{
      return service.getLoanById(loanDto);
    }

    it('should be able to get Loan By Id',async ()=>{
      loanDto.loanNumber = '987654321';
      const result = await exec();
      expect(result.loanNumber).toBe('987654321');
      expect(result.status).toBe('Pending');
    });


    it('should be throw No loan found with the loan number!',async ()=>{
      loanDto.loanNumber = '654123789';
      try{
        await exec();
      }catch(error){
        expect(error.message).toBe('No loan found with the loan number!');
        expect(error.error.status).toBe(404);
      } 
    });
  });

  describe('getAllLoanByCustomerId',()=>{
    const exec =()=>{
      return service.getAllLoanByCustomerId(loanDto);
    }

    it('should be able to get Loan By CutomerId',async ()=>{
      const result = await exec();
      expect(result[0].loanNumber).toBe('987654321');
      expect(result[0].customerId).toBe('123456789');
    });


    it('should be throw No loan found for the customer id!',async ()=>{
      loanDto.customerId = '654789123';
      try{
        await exec();
      }catch(error){
        expect(error.message).toBe('No loan found for the customer id!');
        expect(error.error.status).toBe(404);
      } 
    });
  });

  describe('calculateMonthlyEMI',()=>{
    const exec =()=>{
      return service.calculateMonthlyEMI(loanDto.loanAmount,loanDto.offer.offerPercentage,parseInt(loanDto.loanDuration));
    }

    it('should be able to calculate monthly EMI', ()=>{
      const result = exec();
      expect(result).toBe(250);
    });


    it('should be throw Error in calulating EMI!',async ()=>{
      loanDto.loanAmount = 0;
      try{
        await exec();
      }catch(error){
        expect(error.message).toBe('Error in calulating EMI!');
        expect(error.error.status).toBe(400);
      } 
    });

    it('should be throw Error in calulating EMI!',async ()=>{
      loanDto.offer.offerPercentage = 0;
      try{
        await exec();
      }catch(error){
        expect(error.message).toBe('Error in calulating EMI!');
        expect(error.error.status).toBe(400);
      } 
    });

    it('should be throw Error in calulating EMI!',async ()=>{
      loanDto.loanDuration = '0';
      try{
        await exec();
      }catch(error){
        expect(error.message).toBe('Error in calulating EMI!');
        expect(error.error.status).toBe(400);
      } 
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
