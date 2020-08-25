import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { of, throwError } from 'rxjs';
import { LoanDto } from '../dto/loan.dto';
import { HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

describe('LoanService', () => {
  let service: LoanService;
  let offer:any;
  let loanDto: LoanDto;
  let loanRes:any;
  let loanResponse:any;
  let loanClient : ClientProxy;

  function MockClientProxy(res) {
    this.data = res;
    this.send =() => {
      return of(this.data);
    };
  };

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

    loanResponse = {
      status : HttpStatus.OK,
      data : loanRes
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
        LoanService,
        {provide: 'Loan_service', useValue: new MockClientProxy(loanResponse)}],
    }).compile();

    service = module.get<LoanService>(LoanService);
    loanClient = module.get('Loan_service');
  });

  describe('createLoan', ()=>{
    it('Should be able to create a loan', async ()=>{
      loanClient.send = jest.fn().mockReturnValue(of(loanResponse));
      const result = await service.createLoan(loanDto);
      expect(result.loanNumber).toBe('987654321');
    });

    it('Should throw Error while calling Loan service', async ()=>{
      try{
        loanClient.send = jest.fn().mockReturnValue(throwError('error'));
        const result = await service.createLoan(loanDto);
      }catch(error){
        expect(error.message).toBe('Error while calling Loan service');
        expect(error.status).toBe(500);
      } 
    });

    it('Should throw account number does not exist', async ()=>{
      loanResponse = {
        status : HttpStatus.BAD_REQUEST,
        message : 'Account number does not exist!'
      }
      try{
        loanClient.send = jest.fn().mockReturnValue(of(loanResponse));
        const result = await service.createLoan(loanDto);
      }catch(error){
        expect(error.message).toBe('Account number does not exist!');
        expect(error.status).toBe(400);
      } 
    });
  });

  describe('updateLoan', ()=>{
    it('Should be able to updateLoan a loan', async ()=>{
      loanDto.loanAmount = 10000;
      loanRes.loanAmount = 10000;
      loanRes.monthlyEMI = 375;
      loanClient.send = jest.fn().mockReturnValue(of(loanResponse));
      const result = await service.updateLoan(loanDto);
      expect(result.loanNumber).toBe('987654321');
      expect(result.monthlyEMI).toBe(375);
    });
  });

  describe('validateLoan', ()=>{
    it('Should be able to validateLoan a loan', async ()=>{
      loanDto.status = 'Approved';
      loanRes.status = 'Approved';
      loanClient.send = jest.fn().mockReturnValue(of(loanResponse));
      const result = await service.validateLoan(loanDto);
      expect(result.loanNumber).toBe('987654321');
      expect(result.status).toBe('Approved');
    });
  });

  describe('getLoanById', ()=>{
    it('Should be able to get Loan By Id', async ()=>{
      loanClient.send = jest.fn().mockReturnValue(of(loanResponse));
      const result = await service.getLoanById(loanDto.loanNumber);
      expect(result.loanNumber).toBe('987654321');
    });
  });

  describe('getAllLoanByCustomerId', ()=>{

    it('Should be able to get All Loan By CustomerId', async ()=>{

      loanResponse = {
        status : HttpStatus.OK,
        data : [loanRes]
      }
      loanClient.send = jest.fn().mockReturnValue(of(loanResponse));
      const result = await service.getAllLoanByCustomerId(loanDto.customerId);
      expect(result[0].loanNumber).toBe('987654321');
      expect(result[0].customerId).toBe('123456789');
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
