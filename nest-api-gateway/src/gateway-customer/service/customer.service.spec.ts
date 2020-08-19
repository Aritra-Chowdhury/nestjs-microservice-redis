import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { JwtModule } from '@nestjs/jwt';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { of, throwError } from 'rxjs';
import { CustomerDto } from '../dto/customer.dto';
import { CustomerRegisterDto } from '../dto/customer.register.dto';
import { HttpStatus } from '@nestjs/common';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerDto: CustomerDto;
  let customerRegisterDto: CustomerRegisterDto;
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
        JwtModule.register({
          secret: 'privatekey',
          signOptions: { expiresIn: '10000s' },
        }),
        WinstonModule.forRoot({
          handleExceptions : true,
          level : 'error',
          transports: [
            new winston.transports.Console(),
          ]
        })
      ],
      providers: [CustomerService,
        {provide: 'Customer_service', useValue: new MockClientProxy(data)}],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  }

  const execErrorModule = async ()=>{
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'privatekey',
          signOptions: { expiresIn: '10000s' },
        }),
        WinstonModule.forRoot({
          handleExceptions : true,
          level : 'error',
          transports: [
            new winston.transports.Console(),
          ]
        })
      ],
      providers: [CustomerService,
        {provide: 'Customer_service', useValue: new MockClientErrorProxy()}],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  }

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
        JwtModule.register({
          secret: 'privatekey',
          signOptions: { expiresIn: '10000s' },
        }),
        WinstonModule.forRoot({
          handleExceptions : true,
          level : 'error',
          transports: [
            new winston.transports.Console(),
          ]
        })
      ],
      providers: [CustomerService,
        {provide: 'Customer_service', useValue: new MockClientProxy(customerRes)}],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  describe('login',()=>{
    it('should be able to login',async ()=>{
      const result = await service.login(customerRegisterDto);
      expect(result.customerId).toBe('123456789');
    });
  });

  describe('register',()=>{
    it('should be able to register',async ()=>{
      const result = await service.register(customerRegisterDto);
      expect(result.customerId).toBe('123456789');
      expect(result.email).toBe('abc@mail.com');
    });
  });

  describe('getAllCustomer',()=>{
    it('should be able to getAllCustomer',async ()=>{
      const result = await service.getAllCustomer();
      expect(result.customerId).toBe('123456789');
      expect(result.email).toBe('abc@mail.com');
    });
  });

  describe('getCustomerById',()=>{
    it('should be able to getCustomerById',async ()=>{
      const result = await service.getCustomerById(customerDto.customerId);
      expect(result.customerId).toBe('123456789');
      expect(result.email).toBe('abc@mail.com');
    });
  });

  describe('updateExistingCustomer',()=>{
    it('should be able to updateExistingCustomer',async ()=>{
      customerDto.userDetails.martial_status = 'Unmarried';
      customerRes.data.userDetails.martial_status = 'Unmarried';
      await execModule(customerRes);
      const result = await service.updateExistingCustomer(customerDto);
      expect(result.customerId).toBe('123456789');
      expect(result.email).toBe('abc@mail.com');
      expect(result.userDetails.martial_status).toBe('Unmarried');
    });
  });

  describe('getToken',  ()=>{
    it('should be able to getToken', async()=>{
      const result = await service.getToken(customerDto);
      expect(result['x-auth-token']).toBeDefined();
    });
  });

  describe('makeServiceCall',()=>{
    const exec = (patteren,data)=>{
      return service.makeServiceCall(patteren,data);
    }
    it('should be able to makeServiceCall',async ()=>{
      const result:any = await exec('updateCustomer',customerDto);
      expect(result.customerId).toBe('123456789');
      expect(result.email).toBe('abc@mail.com');
    });

    it('should throw Customer id required',async ()=>{
      customerRes.status = HttpStatus.BAD_REQUEST;
      customerRes.message = "Customer id required";
      await execModule(customerRes);
      try{
        const result:any = await exec('updateCustomer',customerDto);
      }catch(error){
        expect(error.message).toBe('Customer id required');
      }
    });

    it('should be throw internal server error',async ()=>{
      try{
        await execErrorModule();
        const result:any = await exec('updateCustomer',customerDto);
      }catch(error){
        expect(error.message).toBe('Error while calling customer service');
        expect(error.status).toBe(500);
      }
    });
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
