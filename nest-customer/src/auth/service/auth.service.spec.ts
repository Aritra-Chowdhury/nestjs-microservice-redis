import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt  from 'bcrypt';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { CustomerRegisterDto } from '../dto/customer.register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let customerDto: CustomerRegisterDto;
  let customerRes: any;
  let mockMongooseTokens;

  describe('validateCustomer and register',()=>{

    const exec = (customerData)=>{
      return service.validateCustomer(customerData);
   }

   function mockCustomerModel(dto: any) {
    this.data = dto;
    this.save  = () => {
      return this.data;
    };
    this.findById  = (id) => {
      return this.data;
    };
    this.findOne = (sampleData) => {
      return this.data;
    };
  };

   const execRegister = (customerData)=>{
    return service.register(customerData);
 }
   beforeEach(async ()=>{

    customerDto = new CustomerRegisterDto();
    customerRes = new CustomerRegisterDto();

    customerDto.email = 'abc@mail.com';
    customerDto.customerId = '123456789';
    customerDto.password = 'abcd12324';

    customerRes.email = 'abc@mail.com';
    customerRes.customerId = '123456789';
    const salt = await bcrypt.genSalt(10);
    customerRes.password = await bcrypt.hash(customerDto.password,salt);

    mockMongooseTokens = [
      {
        provide: getModelToken('Customer'),
        useValue: new mockCustomerModel(customerRes),
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      imports:[JwtModule.register({
        secret:"privatekey",
        signOptions: { expiresIn: '10000s' },
      })],
      providers: [AuthService,...mockMongooseTokens],
    }).compile();

    service = module.get<AuthService>(AuthService);

    customerRes.transform = jest.fn().mockImplementation(()=> customerRes);
  });


    it('should validatate customer with customerId',async ()=>{
     
      customerDto.email = '';
      const result = await exec(customerDto);
      expect(result).toBeDefined();
    });

    it('should validatate customer with email',async ()=>{
     
      customerDto.customerId = '';
      const result = await exec(customerDto);
      expect(result).toBeDefined();
    });

    it('should throw Invalid email or customer id',async ()=>{

      customerDto.password = '213';
      try{
        const result = await exec(customerDto);
      }catch(error){
        expect(error.message).toBe('Invalid email or customer id');
      }
      
    });

    it('should throw RpcException',async ()=>{
      
      customerDto.email = '';
      customerDto.customerId = '';
      try{
        const result = await exec(customerDto);
      }catch(error){
        expect(error.message).toBe('Invalid email or customer id');
      }
    });

    it('should return token', ()=>{
        const result = service.getToken(customerDto);
      
        expect(result).toBeDefined();
      
    });

    it('should throw customer exists while register',async ()=>{
      try{
        const result = await execRegister(customerDto);
      }catch(error){
        expect(error.message).toBe(`Customer with email:${customerDto.email} already exists!`);
      }
      
    });
  });

  describe('register',()=>{
    //let customerModel:any;
    function mockCustomerModel(dto: any) {
      this.data = dto;
      this.save  = () => {
        return this.data;
      };
      this.findOne = (sampleData) => {
        return '';
      };
      this.customerModel = ()=>{
        this.data;
      }
    };
    const exec = (customerData)=>{
      return service.register(customerData);
    }
   beforeEach(async ()=>{

    customerDto = new CustomerRegisterDto();
    customerRes = new CustomerRegisterDto();

    customerDto.email = 'abc@mail.com';
    customerDto.customerId = '123456789';
    customerDto.password = 'abcd12324';

    customerRes.email = 'abc@mail.com';
    customerRes.customerId = '123456789';
    const salt = await bcrypt.genSalt(10);
    customerRes.password = await bcrypt.hash(customerDto.password,salt);
    
    mockMongooseTokens = [
      {
        provide: getModelToken('Customer'),
        useValue: new mockCustomerModel(customerRes),
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      imports:[JwtModule.register({
        secret:"privatekey",
        signOptions: { expiresIn: '10000s' },
      })],
      providers: [AuthService,...mockMongooseTokens],
    }).compile();

    service = module.get<AuthService>(AuthService);

    customerRes.transform = jest.fn().mockImplementation(()=> customerRes);
    //customerModel = jest.fn().mockImplementation(()=> customerRes);
  });


    // it('should be able to register',async ()=>{

    //   const result = await exec(customerDto);
    //   expect(result).toBeDefined();
    // });

  });

});
