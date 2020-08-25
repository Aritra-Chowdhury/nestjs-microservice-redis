import { Test, TestingModule } from '@nestjs/testing';
import { LoanController } from './loan.controller';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoanService } from '../service/loan.service';
import { JwtAuthGuard } from '../../gateway-customer/authgaurd/jwt.gaurd';
import { ValidationPipe } from '../../shared/validation.pipe';
import { JwtModule } from '@nestjs/jwt';
import { GatewayCustomerModule } from '../../gateway-customer/gateway-customer.module';
import { LoanDto } from '../dto/loan.dto';
import { HttpStatus } from '@nestjs/common';

describe('Loan Controller', () => {
  let controller: LoanController;
  let service : LoanService;
  let offer:any;
  let loanDto: LoanDto;
  let loanRes:any;
  let loanResponse:any;

  function mockLoanService(){
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

    loanResponse = {
      status : HttpStatus.OK,
      data : loanRes
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
      controllers: [LoanController],
      providers: [
        JwtAuthGuard,
        ValidationPipe,
        {provide: LoanService , useValue:new mockLoanService()}
      ]
    }).compile();

    controller = module.get<LoanController>(LoanController);
    service = module.get<LoanService>(LoanService);
  });

  describe('createLoan',()=>{
    it('should be able to create loan',async()=>{
      loanResponse = {
        status : HttpStatus.CREATED,
        data : loanRes
      }
      const mockResponse= {
        status : jest.fn().mockReturnThis(),
        send : jest.fn().mockReturnValue(loanResponse)
      };
      service.createLoan = jest.fn().mockReturnValue(loanRes);
      const result = await controller.createLoan(mockResponse , loanDto);
      expect(result.status).toBe(201);
      expect(result.data.loanNumber).toBe('987654321');

    });
  });

  describe('updateLoan',()=>{
    it('should be able to update loan',async()=>{
      const mockResponse= {
        status : jest.fn().mockReturnThis(),
        send : jest.fn().mockReturnValue(loanResponse)
      };
      service.updateLoan = jest.fn().mockReturnValue(loanRes);
      const result = await controller.updateLoan(mockResponse , loanDto);
      expect(result.status).toBe(200);
      expect(result.data.loanNumber).toBe('987654321');

    });
  });

  describe('validateLoan',()=>{
    it('should be able to validate loan',async()=>{
      const mockResponse= {
        status : jest.fn().mockReturnThis(),
        send : jest.fn().mockReturnValue(loanResponse)
      };
      service.validateLoan = jest.fn().mockReturnValue(loanRes);
      const result = await controller.validateLoan(mockResponse , loanDto);
      expect(result.status).toBe(200);
      expect(result.data.loanNumber).toBe('987654321');

    });
  });

  describe('getLoanById',()=>{
    it('should be able to get Loan By Id',async()=>{
      const mockResponse= {
        status : jest.fn().mockReturnThis(),
        send : jest.fn().mockReturnValue(loanResponse)
      };
      service.getLoanById = jest.fn().mockReturnValue(loanRes);
      const result = await controller.getLoanById(mockResponse , loanDto.loanNumber);
      expect(result.status).toBe(200);
      expect(result.data.loanNumber).toBe('987654321');

    });
  });

  describe('getAllLoanByCustomerId',()=>{
    it('should be able to get All Loan By CustomerId',async()=>{
      loanResponse = {
        status : HttpStatus.OK,
        data : [loanRes]
      }
      const mockRequest= {
        body : jest.fn().mockReturnValue({
          customerId : '123456789', 
        })
      }
      const mockResponse= {
        status : jest.fn().mockReturnThis(),
        send : jest.fn().mockReturnValue(loanResponse)
      };
      service.getAllLoanByCustomerId = jest.fn().mockReturnValue([loanRes]);
      const result = await controller.getAllLoanByCustomerId(mockRequest, mockResponse );
      expect(result.status).toBe(200);
      expect(result.data[0].loanNumber).toBe('987654321');
      expect(result.data[0].customerId).toBe('123456789');
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
