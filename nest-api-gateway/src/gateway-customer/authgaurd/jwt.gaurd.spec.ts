import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt.gaurd';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { CustomerService } from '../service/customer.service';
import { of } from 'rxjs';
import { HttpStatus } from '@nestjs/common';
import { CustomerDto } from '../dto/customer.dto';

describe('Customer Controller', () => {
  let jwtAuthGaurd: JwtAuthGuard;
  let jwtService: JwtService;
  let customerDto: CustomerDto;
  let customerService : CustomerService;
  

  function MockClientProxy() {
    this.data;
    this.send =() => {
      return of(this.data);
    };
  };

  let customerRes= {
      customerId: "123456789",
      name : "Demo Name",
      email: "abc@mail.com",
      password : "abcd12324",
      isActive : true
  }
  
  beforeEach(async () => {

    customerDto = new CustomerDto();
    customerDto.customerId = '123456789';
    customerDto.email = 'abc@mail.com';
    customerDto.customerId = '123456789';
    customerDto.password = 'abcd12324';
    customerDto.name = 'Demo Name';


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
      providers: [JwtAuthGuard,CustomerService,
        {provide: 'Customer_service', useValue: new MockClientProxy()}]
    }).compile();

    jwtAuthGaurd = module.get<JwtAuthGuard>(JwtAuthGuard);
    customerService = module.get<CustomerService>(CustomerService);
    jwtService = module.get<JwtService>(JwtService);

    customerService.getCustomerById =jest.fn().mockImplementation(()=>customerRes);
    
  });

  describe('validateRequestHeader',()=>{
    const exec = async (requestData)=>{
      let request = {
          header : jest.fn().mockReturnValue(requestData),
          body : {
            customerId : '',
            customer : ''
          }
      };
      return jwtAuthGaurd.validateRequestHeader(request);
    }

    it('should be able to verify token',async ()=>{
      const payload = {customerId : customerDto.customerId, name : customerDto.name};
      const token = jwtService.sign(payload);

      const result = await exec(token);
      expect(result).toBeTruthy();
    });

    it('should throw Auth key not present',async ()=>{
      try{
        const result = await exec(null);
      }catch(error){
        expect(error.response.error).toBe('Auth key not present');
        expect(error.status).toBe(401);
      }
    });

    it('should throw Invalid auth key.Customer Id missing',async ()=>{
      try{
        const payload = {};
        const token = jwtService.sign(payload);
        const result = await exec(token);
      }catch(error){
        expect(error.response.error).toBe('Invalid auth key.Customer Id missing');
        expect(error.status).toBe(401);
      }
    });

    it('should throw invalid token',async ()=>{
      try{
        const token = '132332435.214124qq35.14144'
        const result = await exec(token);
      }catch(error){
        expect(error.response.error).toBe('invalid token');
        expect(error.status).toBe(401);
      }
    });

    it('should throw Invalid auth key.Customer not found',async ()=>{
      try{
        const payload = {customerId : '432156789', name : customerDto.name};
        const token = jwtService.sign(payload);
        customerService.getCustomerById =jest.fn().mockImplementation(()=>null);
        const result = await exec(token);
      }catch(error){
        expect(error.response.error).toBe('Invalid auth key.Customer not found');
        expect(error.status).toBe(401);
      }
    });

  })


  it('should be defined', () => {
    expect(jwtAuthGaurd).toBeDefined();
  });
});
