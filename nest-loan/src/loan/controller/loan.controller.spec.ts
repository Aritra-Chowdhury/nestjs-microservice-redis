import { Test, TestingModule } from '@nestjs/testing';
import { LoanController } from './loan.controller';
import { LoanService } from '../service/loan.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { getModelToken } from '@nestjs/mongoose';
import { LoanDto } from '../dto/loan.dto';

describe('Loan Controller', () => {
  let controller: LoanController;
  let service : LoanService;
  let offer:any;
  let loanDto: LoanDto;
  let loanRes:any;
  function MockLoanService(){
    this.data = '';
  }

  function MockOfferModel(){
    this.data = '';
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
      controllers: [LoanController],
      providers: [ 
        {provide : getModelToken('Loan'),useValue: new MockOfferModel()},
        {provide: LoanService , useValue: new MockLoanService()}
      ]
    }).compile();

    controller = module.get<LoanController>(LoanController);
    service = module.get<LoanService>(LoanService);
  });

  describe('createLoan',()=>{
    it('should be able to create a loan',async ()=>{
      service.createLoan = jest.fn().mockReturnValue(loanRes);
      const result = await controller.createLoan(loanDto);
      expect(result.status).toBe(201);
      expect(result.data.loanNumber).toBe('987654321');
    });
  });

  describe('updateLoan',()=>{
    it('should be able to update a loan',async ()=>{
      loanDto.loanNumber = '987654321';
      service.updateLoan = jest.fn().mockReturnValue(loanRes);
      const result = await controller.updateLoan(loanDto);
      expect(result.status).toBe(200);
      expect(result.data.loanNumber).toBe('987654321');
      expect(result.data.monthlyEMI).toBe(250);
    });
  });

  describe('validateLoan',()=>{
    it('should be able to validate a loan',async ()=>{
      loanDto.loanNumber = '987654321';
      loanDto.status = 'Approved';
      loanRes.status = 'Approved';
      service.validateLoan = jest.fn().mockReturnValue(loanRes);
      const result = await controller.validateLoan(loanDto);
      expect(result.status).toBe(200);
      expect(result.data.loanNumber).toBe('987654321');
      expect(result.data.status).toBe('Approved')
    });
  });

  describe('getLoanById',()=>{
    it('should be able to get Loan By Id',async ()=>{
      loanDto.loanNumber = '987654321';
      service.getLoanById = jest.fn().mockReturnValue(loanRes);
      const result = await controller.getLoanById(loanDto);
      expect(result.status).toBe(200);
      expect(result.data.loanNumber).toBe('987654321');
    });
  });

  describe('getAllLoanByCutomerId',()=>{
    it('should be able to get All Loan By CutomerId',async ()=>{
      service.getAllLoanByCustomerId = jest.fn().mockReturnValue([loanRes]);
      const result = await controller.getAllLoanByCustomerId(loanDto);
      expect(result.status).toBe(200);
      expect(result.data[0].loanNumber).toBe('987654321');
      expect(result.data[0].customerId).toBe('123456789');
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
