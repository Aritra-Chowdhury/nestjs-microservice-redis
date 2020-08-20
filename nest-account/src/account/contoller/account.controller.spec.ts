import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AccountDto } from '../dto/account.dto';
import { HttpStatus } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { SharedModule } from '../../shared/shared.module';
import {  ConfigModule } from '@nestjs/config';
import defaultConfiguration from '../../../config/default.configuration';

describe('Account Controller', () => {
  let controller: AccountController;
  let accountDto: AccountDto;
  let accountRes: any;
  
  const userDetails =  {
    dob : '01/01/2000',
    martialStatus: 'married',
    panCard : 'demo1234',
    nationality : 'Indian',
    phoneNumber : '123456679',
  };

  const mailingAddress = {
    address1 : 'DemoAddress1',
    address2 : 'DemoAddress2',
    city : 'DemoCity',
    state : 'DemoState',
    country : 'DemoCountry',
    zipCode : '722359',
  };

  let customerRes:any = {
    status : HttpStatus.OK,
    data : {
      customerId: "123456789",
      name : "DemoName",
      email: "abc@mail.com",
      password : "demopassword",
      userDetails: userDetails,
      mailingAddress: mailingAddress,
      isActive : true
    }
  }

  function MockAccountService(dto: any) {
    this.data = dto;
    this.createAccount  = () => {
      return this.data;
    };
    this.getAllAccountByCustomerId  = (id) => {
      return [this.data];
    };

    this.getAccountById  = (id) => {
      return this.data;
    };

    this.updateAccount = (sampleData) => {
      return this.data;
    };

    this.deleteAccountById  = (id) => {
      return this.data;
    };
  };

  const execModule = async (data)=>{
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule,
        ConfigModule.forRoot({
          isGlobal : true,
          load : [defaultConfiguration]
        }),
        WinstonModule.forRoot({
        handleExceptions : true,
        level : 'error',
        transports: [
          new winston.transports.Console(),
        ]
      })],
      controllers: [AccountController],
      providers: [
        {provide: AccountService,useValue: new MockAccountService(data)}
        
      ]
    }).compile();

    controller = module.get<AccountController>(AccountController);
  }

  beforeEach(async () => {

    accountDto = new AccountDto();
    accountRes =  new AccountDto();

    accountDto.accountType='current';
    accountDto.openingDate=Date.now().toString();
    accountDto.customerId = "123456789";
    accountDto.userDetails = userDetails;
    accountDto.mailingAddress = mailingAddress;
    accountDto.isJoint = false;
    accountDto.customer = customerRes;

    accountRes.accountNumber='987654321';
    accountRes.accountType='current';
    accountRes.openingDate=Date.now().toString();
    accountRes.customerId = "123456789";
    accountDto.isJoint = false;

    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule,
        ConfigModule.forRoot({
          isGlobal : true,
          load : [defaultConfiguration]
        }),
        WinstonModule.forRoot({
        handleExceptions : true,
        level : 'error',
        transports: [
          new winston.transports.Console(),
        ]
      })],
      controllers: [AccountController],
      providers: [
        {provide: AccountService,useValue: new MockAccountService(accountRes)}
        
      ]
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  describe('Account controller all functions',()=>{
    it('should be able to create Account', async () => {
      const result = await controller.createAccount(accountDto);
      console.log(JSON.stringify(result));
      expect(result.data.accountNumber).toBe('987654321');
      expect(result.data.accountType).toBe('current');
    });
  
    it('should be able to update an account', async () => {
        accountDto.accountType = 'savings';
        accountRes.accountType = 'savings';
        await execModule(accountRes);
        const result = await controller.updateAccount(accountDto);
        expect(result.data.accountNumber).toBe('987654321');
        expect(result.data.accountType).toBe('savings');
    });
  
    it('should be able to all Account', async () => {
      const result = await controller.getAllAccount(accountDto);
      expect(result.data[0].accountNumber).toBe('987654321');
      expect(result.data[0].accountType).toBe('current');
    });
  
    it('should be able to an Account', async () => {
      const result = await controller.getAccountById(accountDto);
      expect(result.data.accountNumber).toBe('987654321');
      expect(result.data.accountType).toBe('current');
    });
  
    it('should deactivate or remove an account', async () => {
      accountRes.closingDate = Date.now().toString();
      await execModule(accountRes);
      const result = await controller.deleteAccountById(accountDto);
      expect(result.data.accountNumber).toBe('987654321');
      expect(result.data.closingDate).toBeDefined();
    });
  
  });

  
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
