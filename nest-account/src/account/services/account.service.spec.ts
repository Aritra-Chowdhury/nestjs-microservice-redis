import { Test, TestingModule } from '@nestjs/testing';
import * as winston from 'winston';

import { AccountService } from './account.service';
import { WinstonModule } from 'nest-winston';
import { getModelToken } from '@nestjs/mongoose';
import { AccountDto } from '../dto/account.dto';
import { Observable , of } from 'rxjs';
import { HttpStatus } from '@nestjs/common';

describe('AccountService', () => {
  let service: AccountService;
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


  function MockAccountModel(res:any) {
    this.data = res;

    this.save  = () => {
      return this.data;
    };
    this.findById  = (id) => {
      return this.data;
    };
    this.findOne = (sampleData) => {
      return this.data;
    };

    this.find = (sampleData) => {
      if(this.data)
      return [this.data];
      return [];
    };

    this.findByIdAndUpdate = ()=>{
      return this.data;
    }
  };

  function MockClientProxy(res) {
    this.data = res;
    this.send =() => {
      return of(this.data);
    };
  };

  const execModule = async (data,customerData) => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot({
        handleExceptions : true,
        level : 'debug',
        transports: [
          new winston.transports.Console(),
        ]
      }),
      ],
      providers: [
        AccountService,
        {provide: getModelToken('Account'),useValue: new MockAccountModel(data)},
        {provide: 'Customer_service', useValue: new MockClientProxy(customerData)}
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
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
      imports: [
        WinstonModule.forRoot({
        handleExceptions : true,
        level : 'debug',
        transports: [
          new winston.transports.Console(),
        ]
      }),
      ],
      providers: [
        AccountService,
        {provide: getModelToken('Account'),useValue: new MockAccountModel(accountRes)},
        {provide: 'Customer_service', useValue: new MockClientProxy(customerRes)}
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);

    accountRes.transform = jest.fn().mockImplementation(()=> accountRes);
  });

  describe('getAllAccountByCustomerId',()=>{
    const exec = (data)=>{
      return service.getAllAccountByCustomerId(data.customerId,data.customer);
    }

    it('should be able to find all account by customer id',async ()=>{
      const result = await exec(accountDto);
      expect(result[0].account_number).toBe('987654321');
    });

    it('should throw No account found or the customer id!',async ()=>{
      accountRes = null;
      try{
        await execModule(accountRes,customerRes);
        const result = await exec(accountDto);
      }catch(error){
        expect(error.message).toBe(`No account found or the customer id!`);
      }
    });
  });

  describe('getAccountById',()=>{
    const exec = (account_number,data)=>{
      return service.getAccountById(account_number,data.customer);
    }

    it('should be able to find a account',async ()=>{
      const result = await exec('987654321',accountDto);
      expect(result.account_number).toBe('987654321');
    });

    it('should throw No account found or the customer id!',async ()=>{
      accountRes = null;
      try{
        await execModule(accountRes,customerRes);
        const result = await exec('987654321',accountDto);
      }catch(error){
        expect(error.message).toBe(`No account found with the account number for the customer!`);
      }
    });
  });

  describe('deleteAccountById',()=>{
    const exec = (account_number,data)=>{
      return service.deleteAccountById(account_number,data.customer);
    }

    it('should be able to update the account closing date',async ()=>{
      accountRes.closing_date = Date.now().toString();
      await execModule(accountRes,customerRes);
      const result = await exec('987654321',accountDto);
      expect(result.account_number).toBe('987654321');
      expect(result.closing_date).toBeDefined();
    });

    it('should throw No account found with the account number for the customer!',async ()=>{
      accountRes = null;
      try{
        await execModule(accountRes,customerRes);
        const result = await exec('987654321',accountDto);
      }catch(error){
        expect(error.message).toBe(`No account found with the account number for the customer!`);
      }
    });
  });

  describe('updateAccount',()=>{
    const exec = (data)=>{
      return service.updateAccount(data);
    }

    it('should be able to update the account ',async ()=>{
      accountDto.account_type = 'savings';
      accountRes.account_type = 'savings';
      await execModule(accountRes,customerRes);
      const result = await exec(accountDto);
      expect(result.account_number).toBe('987654321');
      expect(result.account_type).toBe('savings');
    });

    it('should throw Account does not exist!',async ()=>{
      accountRes = null;
      try{
        await execModule(accountRes,customerRes);
        const result = await exec(accountDto);
      }catch(error){
        expect(error.message).toBe(`Account does not exist!`);
      }
    });
  });

  describe('updateCustomerData',()=>{
    const exec = (data)=>{
      return service.updateCustomerData(data);
    }

    it('should be able to update the account ',async ()=>{

        const result = await exec(customerRes);
        expect(result.customerId).toBe('123456789');
    });

    it('should throw Customer id required',async ()=>{

      customerRes.status = HttpStatus.BAD_REQUEST;
      customerRes.message = "Customer id required";
      await execModule(accountRes ,customerRes);
      try{
      const result = await exec(customerRes);
      }catch(error){
        expect(error.message).toBe('Customer id required');
      }
      
  });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
