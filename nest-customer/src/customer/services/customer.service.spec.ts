import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt  from 'bcrypt';

import { CustomerService } from './customer.service';
import { CustomerDto } from '../dto/customer.dto';
import { getModelToken } from '@nestjs/mongoose';


describe('CustomerService', () => {
  let service: CustomerService;
  let customerDto: CustomerDto;
  let customerRes: any;
  let mockMongooseTokens;

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

  function mockCustomerModel(dto: any) {
    this.data = dto;
    this.find  = () => {
      return this.data;
    };
    this.findById = ()=>{
      return this.data;
    }
    this.findByIdAndUpdate = ()=>{
      return this.data;
    }
  };
  
   beforeEach(async ()=>{
  
    customerDto = new CustomerDto();
    customerRes = new CustomerDto();
  
    customerDto.email = 'abc@mail.com';
    customerDto.customerId = '123456789';
    customerDto.password = 'abcd12324';
    customerDto.isActive = true;
    customerDto.userDetails = userDetails;
    customerDto.mailingAddress = mailingAddress;
    
    customerRes.email = 'abc@mail.com';
    customerRes.customerId = '123456789';
    const salt = await bcrypt.genSalt(10);
    customerRes.password = await bcrypt.hash(customerDto.password,salt);
    customerRes.isActive = true;
    customerRes.userDetails = userDetails;
    customerRes.mailingAddress = mailingAddress;
  
    mockMongooseTokens = [
      {
        provide: getModelToken('Customer'),
        useValue: new mockCustomerModel(customerRes),
      },
    ];
  
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService,...mockMongooseTokens],
    }).compile();
  
    service = module.get<CustomerService>(CustomerService);
  
    customerRes.transform = jest.fn().mockImplementation(()=> customerRes);
  });
  
  it('should return the all customers',async ()=>{
    const result:any = await service.getAllCustomer();
    expect(result).toBeDefined();
    expect(result.email).toBe('abc@mail.com');
  });

  it('should return the customerById',async ()=>{
    const result:any = await service.getCustomerById(customerDto.customerId);
    expect(result).toBeDefined();
    expect(result.email).toBe('abc@mail.com');
  });

  it('should return the updateCustomer',async ()=>{
    customerDto.email = 'abc1@mail.com';
    customerRes.email = 'abc1@mail.com';
    const result:any = await service.updateExistingCustomer(customerDto);
    expect(result).toBeDefined();
    expect(result.email).toBe('abc1@mail.com');
  });

 
});
