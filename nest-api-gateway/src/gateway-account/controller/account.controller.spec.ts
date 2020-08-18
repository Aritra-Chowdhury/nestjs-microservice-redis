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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
