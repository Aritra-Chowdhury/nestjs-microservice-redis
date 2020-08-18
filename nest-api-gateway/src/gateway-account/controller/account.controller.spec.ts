import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from '../service/account.service';
import { AccountDto } from '../dto/account.dto';
import { HttpStatus } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { JwtAuthGuard } from '../../gateway-customer/authgaurd/jwt.gaurd';
import { ValidationPipe } from '../../shared/validation.pipe';
import { SharedModule } from '../../shared/shared.module';
import { CustomerService } from '../../gateway-customer/service/customer.service';
import { Response } from 'express';

describe('Account Controller', () => {
  let controller: AccountController;
  let accountDto: AccountDto;
  let accountRes: any; 
  
  const userDetails =  {
    dob : '01/01/2000',
    martial_status: 'married',
    pan_card : 'demo1234',
    nationality : 'Indian',
    phone_number : '123456679',
  };

  const mailingaddress = {
    address1 : 'DemoAddress1',
    address2 : 'DemoAddress2',
    city : 'DemoCity',
    state : 'DemoState',
    country : 'DemoCountry',
    zip_code : '722359',
  };

  let customerRes:any = {
      customerId: "123456789",
      name : "DemoName",
      email: "abc@mail.com",
      password : "demopassword",
      userDetails: userDetails,
      mailingaddress: mailingaddress,
      isActive : true
  }
  function mockAccountService(dto:any){
    this.data = dto;

    this.createAccount = ()=>{
      return this.data;
    }
    this.updateAccount = ()=>{
      return this.data;
    }
    this.getAllAccountByCustomerId = ()=>{
      return [this.data];
    }
    this.getAccountById = ()=>{
      return this.data;
    }
    this.deleteAccountById = ()=>{
      return this.data;
    }
  }

  function mockCustomerService(){
  }
  beforeEach(async () => {

    accountDto = new AccountDto();

    accountDto.account_type='current';
    accountDto.opening_date=Date.now().toString();
    accountDto.customerId = "123456789";
    accountDto.userDetails = userDetails;
    accountDto.mailingaddress = mailingaddress;
    accountDto.isJoint = false;
    accountDto.customer = customerRes;

    accountRes= {
      status : HttpStatus.OK,
      data : {
        customerId: '123456789',
        account_number : '987654321',
        account_type: 'current',
        opening_date : Date.now().toString(),
        isJoint: false,
        userDetails,
        mailingaddress
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedModule,
        WinstonModule.forRoot({
          handleExceptions : true,
          level : 'error',
          transports: [
            new winston.transports.Console(),
          ]
        })
      ],
      controllers: [AccountController],
      providers: [
        JwtAuthGuard,
        {provide: CustomerService, useValue: new mockCustomerService()},
        ValidationPipe,
        {provide: AccountService , useValue:new mockAccountService(accountRes)}
      ]
    }).compile();

    controller = module.get<AccountController>(AccountController);

  });

  describe('createAccount',()=>{
    it('should be able to create an account',async ()=>{
        const mockResponse= {
          status : jest.fn().mockReturnThis(),
          send : jest.fn().mockReturnValue(accountRes)
        }
      const result = await controller.createAccount(mockResponse,accountDto);
      expect(result.status).toBe(200);
      expect(result.data.account_number).toBe('987654321');
    });
  });

  describe('updateAccount',()=>{
    it('should be able to upadte an account',async ()=>{

      accountRes.data.account_type = "savings";
        const mockResponse= {
          status : jest.fn().mockReturnThis(),
          send : jest.fn().mockReturnValue(accountRes)
        }
      const result = await controller.updateAccount(mockResponse,accountDto);
      expect(result.status).toBe(200);
      expect(result.data.account_number).toBe('987654321');
      expect(result.data.account_type).toBe('savings');
    });
  });

  describe('getAllAccount',()=>{
    it('should be able to get all account',async ()=>{
      accountRes.data = [accountRes.data];
        const mockResponse= {
          status : jest.fn().mockReturnThis(),
          send : jest.fn().mockReturnValue(accountRes)
        }

        const mockRequest= {
          body : jest.fn().mockReturnValue({
            customerId : customerRes.customerId, 
            customer : customerRes,
          })
        }

      const result = await controller.getAllAccount(mockRequest,mockResponse);
      expect(result.status).toBe(200);
      expect(result.data[0].account_number).toBe('987654321');
    });
  });

  describe('getAccountById',()=>{
    it('should be able to get an account',async ()=>{
        const mockResponse= {
          status : jest.fn().mockReturnThis(),
          send : jest.fn().mockReturnValue(accountRes)
        }

        const mockRequest= {
          body : jest.fn().mockReturnValue({
            customerId : customerRes.customerId, 
            customer : customerRes,
          })
        }

      const result = await controller.getAccountById(mockRequest,mockResponse,accountDto.account_number);
      expect(result.status).toBe(200);
      expect(result.data.account_number).toBe('987654321');
    });
  });


  describe('deleteAccountById',()=>{
    it('should be able to deactivate an account',async ()=>{
      accountRes.data.closing_date = Date.now().toString();
        const mockResponse= {
          status : jest.fn().mockReturnThis(),
          send : jest.fn().mockReturnValue(accountRes)
        }

        const mockRequest= {
          body : jest.fn().mockReturnValue({
            customerId : customerRes.customerId, 
            customer : customerRes,
          })
        }

      const result = await controller.deleteAccountById(mockRequest,mockResponse,accountDto.account_number);
      expect(result.status).toBe(200);
      expect(result.data.account_number).toBe('987654321');
      expect(result.data.closing_date).toBeDefined();
    });
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
