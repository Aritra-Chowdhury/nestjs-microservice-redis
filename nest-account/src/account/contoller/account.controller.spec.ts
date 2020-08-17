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
    status : HttpStatus.OK,
    data : {
      customerId: "123456789",
      name : "DemoName",
      email: "abc@mail.com",
      password : "demopassword",
      userDetails: userDetails,
      mailingaddress: mailingaddress,
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
        level : 'debug',
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

    accountDto.account_type='current';
    accountDto.opening_date=Date.now().toString();
    accountDto.customerId = "123456789";
    accountDto.userDetails = userDetails;
    accountDto.mailingaddress = mailingaddress;
    accountDto.isJoint = false;
    accountDto.customer = customerRes;

    accountRes.account_number='987654321';
    accountRes.account_type='current';
    accountRes.opening_date=Date.now().toString();
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
        level : 'debug',
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
      expect(result.data.account_number).toBe('987654321');
      expect(result.data.account_type).toBe('current');
    });
  
    it('should be able to update an account', async () => {
      accountDto.account_type = 'savings';
        accountRes.account_type = 'savings';
        await execModule(accountRes);
        const result = await controller.updateAccount(accountDto);
        expect(result.data.account_number).toBe('987654321');
        expect(result.data.account_type).toBe('savings');
    });
  
    it('should be able to all Account', async () => {
      const result = await controller.getAllAccount(accountDto);
      expect(result.data[0].account_number).toBe('987654321');
      expect(result.data[0].account_type).toBe('current');
    });
  
    it('should be able to an Account', async () => {
      const result = await controller.getAccountById(accountDto);
      expect(result.data.account_number).toBe('987654321');
      expect(result.data.account_type).toBe('current');
    });
  
    it('should deactivate or remove an account', async () => {
      accountRes.closing_date = Date.now().toString();
      await execModule(accountRes);
      const result = await controller.deleteAccountById(accountDto);
      expect(result.data.account_number).toBe('987654321');
      expect(result.data.closing_date).toBeDefined();
    });
  
  });

  
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
