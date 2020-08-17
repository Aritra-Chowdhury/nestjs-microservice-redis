import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt  from 'bcrypt';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { CustomerController } from './customer.controller';
import { CustomerService } from '../services/customer.service';
import { CustomerExceptionFilter } from '../../shared/rpc-exception.filter';
import { SharedModule } from '../../shared/shared.module';

import { CustomerDto } from '../dto/customer.dto';


describe('Customer Controller', () => {
  let controller: CustomerController;
  let customerDto: CustomerDto;
  let customerRes: any;

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

  function mockCustomerService(dto: any) {
    this.data = dto;
    this.getAllCustomer  = () => {
      return this.data;
    };
    this.getCustomerById  = (id) => {
      return this.data;
    };
    this.updateExistingCustomer = (sampleData) => {
      return this.data;
    };
  };
  

  beforeEach(async () => {
    customerDto = new CustomerDto();
    customerRes = new CustomerDto();
  
    customerDto.email = 'abc@mail.com';
    customerDto.customerId = '123456789';
    customerDto.password = 'abcd12324';
    customerDto.isActive = true;
    customerDto.userDetails = userDetails;
    customerDto.mailingaddress = mailingaddress;
    
    customerRes.email = 'abc@mail.com';
    customerRes.customerId = '123456789';
    const salt = await bcrypt.genSalt(10);
    customerRes.password = await bcrypt.hash(customerDto.password,salt);
    customerRes.isActive = true;
    customerRes.userDetails = userDetails;
    customerRes.mailingaddress = mailingaddress;
  
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, WinstonModule.forRoot({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.prettyPrint()),
        handleExceptions : true,
        level : 'debug',
        transports: [
          new winston.transports.File({
              filename : './log/customer-service.log'
          }),
          new winston.transports.Console(),
        ]
      })],
      controllers: [CustomerController],
      providers: [CustomerExceptionFilter,{
        provide: CustomerService,  useValue: new mockCustomerService(customerRes)
      }]
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  describe('getAllCustomer',()=>{
    const exec = ()=>{
      return controller.getAllCustomer();
    }
    it('should be able to get all customers',async () => {
      const result = await exec();
      expect(result.data.email).toBe('abc@mail.com');
    });
  });

  describe('getCustomer',()=>{
    const exec = (data)=>{
      return controller.getCustomer(data.customerId);
    }
    it('should be able to get a customer',async () => {
      const result = await exec(customerDto);
      expect(result.data.email).toBe('abc@mail.com');
    });

    it('should throw customer does not exist',async () => {
      customerRes = '';
      try{
        const result = await exec(customerDto);
      }catch(error){
        expect(error.message).toBe('Customer does not exist!');
      }
    });
  });

  describe('updateCustomer',()=>{
    const exec = (customerDto)=>{
      return controller.updateCustomer(customerDto);
    }
    it('should be able to update a customer',async () => {
      const result = await exec(customerDto);
      expect(result.data.email).toBe('abc@mail.com');
    });

    it('should throw Customer does not exist!',async () => {
      customerRes = '';
      try{
        const result = await exec(customerDto);
      }catch(error){
        expect(error.message).toBe('Customer does not exist!');
      }
    });
  });



  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
