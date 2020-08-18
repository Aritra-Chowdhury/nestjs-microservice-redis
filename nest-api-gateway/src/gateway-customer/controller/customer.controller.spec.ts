import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerDto } from '../dto/customer.dto';
import { CustomerRegisterDto } from '../dto/customer.register.dto';
import { SharedModule } from '../../shared/shared.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../authgaurd/jwt.gaurd';
import { CustomerService } from '../service/customer.service';

describe('Customer Controller', () => {
  let controller: CustomerController;
  let customerDto: CustomerDto;
  let customerRegisterDto: CustomerRegisterDto;
  let customerRes: any;

  function mockCustomerService(dto:any){
    this.data = dto;
  }

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

  beforeEach(async () => {

    customerDto = new CustomerDto();

    customerRegisterDto = new CustomerRegisterDto();

    customerRegisterDto.email = 'abc@mail.com';
    customerRegisterDto.customerId = '123456789';
    customerRegisterDto.password = 'abcd12324';
    customerRegisterDto.name = 'Demo Name';
  
    customerDto.name = 'Demo Name';
    customerDto.email = 'abc@mail.com';
    customerDto.customerId = '123456789';
    customerDto.password = 'abcd12324';
    customerDto.isActive = true;
    customerDto.userDetails = userDetails;
    customerDto.mailingaddress = mailingaddress;

    customerRes= {
      status : HttpStatus.OK,
      data : {
        customerId: "123456789",
        name : "Demo Name",
        email: "abc@mail.com",
        password : "abcd12324",
        userDetails: userDetails,
        mailingaddress: mailingaddress,
        isActive : true
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
        }),
        JwtModule.register({
          secret:"privatekey",
          signOptions: { expiresIn: '10000s' },
        })
      ],
      controllers: [CustomerController],
      providers: [
        JwtAuthGuard,
        {provide: CustomerService, useValue: new mockCustomerService(customerRes)},
        ValidationPipe,
      
      ]
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
