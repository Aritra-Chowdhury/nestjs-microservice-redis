import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { AccountDto } from '../dto/account.dto';
import { of, throwError } from 'rxjs';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { HttpStatus } from '@nestjs/common';

describe('AccountService', () => {
  let service: AccountService;
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
      customerId: "123456789",
      name : "DemoName",
      email: "abc@mail.com",
      password : "demopassword",
      userDetails: userDetails,
      mailingAddress: mailingAddress,
      isActive : true
  }
  function MockClientProxy(res) {
    this.data = res;
    this.send =() => {
      return of(this.data);
    };
  };

  function MockClientErrorProxy() {
    this.send =() => {
      return throwError('error');
    };
  };

  const execModule = async (data)=>{
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
      providers: [AccountService,
        {provide: 'Account_service', useValue: new MockClientProxy(data)}],
    }).compile();

    service = module.get<AccountService>(AccountService);
  }

  const execErrorModule = async ()=>{
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
      providers: [AccountService,
        {provide: 'Account_service', useValue: new MockClientErrorProxy()}],
    }).compile();

    service = module.get<AccountService>(AccountService);
  }

  beforeEach(async () => {
    accountDto = new AccountDto();

    accountDto.accountType='current';
    accountDto.openingDate=Date.now().toString();
    accountDto.customerId = "123456789";
    accountDto.userDetails = userDetails;
    accountDto.mailingAddress = mailingAddress;
    accountDto.isJoint = false;
    accountDto.customer = customerRes;

    accountRes= {
      status : HttpStatus.OK,
      data : {
        customerId: '123456789',
        accountNumber : '987654321',
        accountType: 'current',
        openingDate : Date.now().toString(),
        isJoint: false,
        userDetails,
        mailingAddress
      }  
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
      providers: [AccountService,
        {provide: 'Account_service', useValue: new MockClientProxy(accountRes)}],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  describe('createAccount',()=>{
    it('should be able to createAccount',async ()=>{
      const result = await service.createAccount(accountDto);
      expect(result.customerId).toBe('123456789');
      expect(result.accountNumber).toBe('987654321');
    });
  });

  describe('updateAccount',()=>{
    it('should be able to updateAccount',async ()=>{
      accountDto.accountType = 'Savings'
      accountRes.data.accountType = 'Savings'
      await execModule(accountRes);
      const result = await service.updateAccount(accountDto);
      expect(result.accountType).toBe('Savings');
      expect(result.customerId).toBe('123456789');
      expect(result.accountNumber).toBe('987654321');
    });
  });

  describe('getAllAccountByCustomerId',()=>{
    it('should be able to getAllAccountByCustomerId',async ()=>{
      const result = await service.getAllAccountByCustomerId(accountDto.customerId,customerRes);
      expect(result.customerId).toBe('123456789');
      expect(result.accountNumber).toBe('987654321');
      expect(result).toHaveProperty(['userDetails']);
    });
  });

  describe('getAccountById',()=>{
    it('should be able to getAccountById',async ()=>{
      const result = await service.getAccountById(accountDto.accountNumber,customerRes);
      expect(result.customerId).toBe('123456789');
      expect(result.accountNumber).toBe('987654321');
      expect(result).toHaveProperty(['userDetails']);
    });
  });

  describe('deleteAccountById',()=>{
    it('should be able to deleteAccountById',async ()=>{
      accountRes.data.closingDate = Date.now().toString();
      await execModule(accountRes);
      const result = await service.deleteAccountById(accountDto.accountNumber,customerRes);
      expect(result.customerId).toBe('123456789');
      expect(result.accountNumber).toBe('987654321');
      expect(result).toHaveProperty(['closingDate']);
    });
  });

  describe('makeServiceCall',()=>{
    const exec = (patteren,data)=>{
      return service.makeServiceCall(patteren,data);
    }
    it('should be able to makeServiceCall',async ()=>{
      const result:any = await exec('updateAccount',accountDto);
      expect(result.customerId).toBe('123456789');
      expect(result.accountNumber).toBe('987654321');
    });

    it('should throw Account id required',async ()=>{
      customerRes.status = HttpStatus.BAD_REQUEST;
      customerRes.message = "Account id required";
      await execModule(customerRes);
      try{
        const result:any = await exec('updateAccount',accountDto);
      }catch(error){
        expect(error.message).toBe('Account id required');
      }
    });

    it('should be throw internal server error',async ()=>{
      try{
        await execErrorModule();
        const result:any = await exec('updateAccount',accountDto);
      }catch(error){
        expect(error.message).toBe('Error while calling account service');
        expect(error.status).toBe(500);
      }
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
