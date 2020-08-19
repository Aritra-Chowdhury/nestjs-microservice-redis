import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerDto } from '../dto/customer.dto';
import { CustomerRegisterDto } from '../dto/customer.register.dto';
import { SharedModule } from '../../shared/shared.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../authgaurd/jwt.gaurd';
import { CustomerService } from '../service/customer.service';

describe('Customer Controller', () => {
  let controller: CustomerController;
  let customerDto: CustomerDto;
  let customerRegisterDto: CustomerRegisterDto;
  let customerRes: any;

  function mockCustomerService(dto:any){
    this.data = dto;
    this.login = ()=>{
      return this.data;
    }
    this.register = ()=>{
      return this.data;
    }
    this.getAllCustomer = ()=>{
      return [this.data];
    }
    this.getCustomerById = ()=>{
      return this.data;
    }
    this.updateExistingCustomer = ()=>{
      return this.data;
    }
    this.getToken = ()=>{
      return {'x-auth-token' : '132332435.214124qq35.14144'}
    }
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

  const execModule = async ()=>{
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
          secret: 'privatekey',
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
        SharedModule,
        WinstonModule.forRoot({
          handleExceptions : true,
          level : 'error',
          transports: [
            new winston.transports.Console(),
          ]
        }),
        JwtModule.register({
          secret: 'privatekey',
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
   // jwtService = module.get<JwtService>(JwtService);
  });

  describe('login',()=>{
    it('should be able to login',async ()=>{
        const mockResponse= {
          status : jest.fn().mockReturnThis(),
          header : jest.fn().mockReturnThis(),
          send : jest.fn().mockReturnValue(customerRes)
        }
      const result = await controller.login(mockResponse,customerRegisterDto);
      expect(result.status).toBe(200);
      expect(result.data.customerId).toBe('123456789');
    });

    it('should throw Customer does not exist!',async ()=>{
      const mockResponse= {
        status : jest.fn().mockReturnThis(),
        header : jest.fn().mockReturnThis(),
        send : jest.fn().mockReturnValue(customerRes)
      }
      customerRes = null;
      try{
        await execModule();
        const result = await controller.login(mockResponse,customerRegisterDto);
      }catch(error){
        expect(error.status).toBe(404);
        expect(error.message).toBe('Customer does not exist!');
      }
   
    });
  });

  describe('register',()=>{
    it('should be able to register',async ()=>{
        const mockResponse= {
          status : jest.fn().mockReturnThis(),
          send : jest.fn().mockReturnValue(customerRes)
        }
      const result = await controller.register(mockResponse,customerRegisterDto);
      expect(result.status).toBe(200);
      expect(result.data.customerId).toBe('123456789');
    });
  });

  describe('getAllCustomer',()=>{
    it('should be able getAllCustomer',async ()=>{
      customerRes.data = [customerRes.data];
        const mockResponse= {
          status : jest.fn().mockReturnThis(),
          send : jest.fn().mockReturnValue(customerRes)
        }
      const result = await controller.getAllCustomer(mockResponse);
      expect(result.status).toBe(200);
      expect(result.data[0].customerId).toBe('123456789');
    });
  });


  describe('getCustomer',()=>{
    it('should be able get a Customer',async ()=>{
        const mockResponse= {
          status : jest.fn().mockReturnThis(),
          send : jest.fn().mockReturnValue(customerRes)
        }
      const result = await controller.getCustomer(mockResponse,customerDto.customerId);
      expect(result.status).toBe(200);
      expect(result.data.customerId).toBe('123456789');
    });

    it('should throw Customer does not exist!',async ()=>{
      customerRes = null;
      const mockResponse= {
        status : jest.fn().mockReturnThis(),
        send : jest.fn().mockReturnValue(customerRes)
      }
    try{
      await execModule();
      const result = await controller.getCustomer(mockResponse,customerDto.customerId);
    }catch(error){
      expect(error.status).toBe(404);
      expect(error.message).toBe('Customer does not exist!');
    }
  });
  });

  describe('updateCustomer',()=>{
    it('should be able update a Customer',async ()=>{
      customerRes.data.userDetails.martial_status = 'unmarried';
        const mockResponse= {
          status : jest.fn().mockReturnThis(),
          send : jest.fn().mockReturnValue(customerRes)
        }
      await execModule();
      const result = await controller.updateCustomer(mockResponse, customerDto);
      expect(result.status).toBe(200);
      expect(result.data.customerId).toBe('123456789');
      expect(result.data.userDetails.martial_status).toBe('unmarried');
    });

    it('should throw Customer does not exist!',async ()=>{
      customerRes = null;
        const mockResponse= {
          status : jest.fn().mockReturnThis(),
          send : jest.fn().mockReturnValue(customerRes)
        }

        try{
          await execModule();
      const result = await controller.updateCustomer(mockResponse, customerDto);
        }catch(error){
          expect(error.status).toBe(404);
          expect(error.message).toBe('Customer does not exist!');
        }
    });
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
