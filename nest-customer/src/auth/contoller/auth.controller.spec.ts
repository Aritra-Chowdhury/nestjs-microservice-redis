import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { SharedModule } from '../../shared/shared.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as bcrypt  from 'bcrypt';
import { AuthService } from '../service/auth.service';
import { CustomerRegisterDto } from '../dto/customer.register.dto';
import { CustomerExceptionFilter } from '../../shared/rpc-exception.filter';

describe('Auth Controller', () => {
  let controller: AuthController;
  let customerDto: CustomerRegisterDto;
  let customerRes: any;

  function mockAuthService(dto: any) {
    this.data = dto;
    this.validateCustomer  = () => {
      return this.data;
    };
    this.register  = () => {
      return this.data;
    };
    this.getToken = (sampleData) => {
      return {
            'x-auth-token' : 'sample-token:'+sampleData.email,
        };
    };
  }

  const execModule = async ()=>{
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, WinstonModule.forRoot({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.prettyPrint()),
        handleExceptions : true,
        level : 'error',
        transports: [
          new winston.transports.File({
              filename : './log/customer-service.log'
          }),
          new winston.transports.Console(),
        ]
      })],
      controllers: [AuthController],
      providers: [CustomerExceptionFilter,
        {provide: AuthService,useValue: new mockAuthService(customerRes)}]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  }

  beforeEach(async () => {
    customerDto = new CustomerRegisterDto();
    customerRes = new CustomerRegisterDto();

    customerDto.email = 'abc@mail.com';
    customerDto.customerId = '123456789';
    customerDto.password = 'abcd12324';

    customerRes.email = 'abc@mail.com';
    customerRes.customerId = '123456789';
    const salt = await bcrypt.genSalt(10);
    customerRes.password = await bcrypt.hash(customerDto.password,salt);

    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, WinstonModule.forRoot({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.prettyPrint()),
        handleExceptions : true,
        level : 'error',
        transports: [
          new winston.transports.File({
              filename : './log/customer-service.log'
          }),
          new winston.transports.Console(),
        ]
      })],
      controllers: [AuthController],
      providers: [CustomerExceptionFilter,
        {provide: AuthService,useValue: new mockAuthService(customerRes)}]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login',()=>{
    const exec = (data)=>{
      return controller.login(data);
    }
    it('should be able to login with email', async() => {
      customerDto.email ='';
      const result = await exec(customerDto);
      expect(result.data.email).toBe('abc@mail.com');
    });

    it('should be able to login with customerId', async() => {
      customerDto.customerId ='';
      const result = await exec(customerDto);
      expect(result.data.email).toBe('abc@mail.com');
    });

    it('should throw Customer does not exist!', async() => {
      customerRes = null;
      try{
        await execModule();
        const result = await exec(customerDto);
      }catch(error){
        expect(error.message).toBe('Customer does not exist!');
      }
    });
  });

  describe('register',()=>{
    const exec = (data)=>{
      return controller.register(data);
    }
    it('should be able to register a customer', async() => {
      customerDto.email ='';
      const result = await exec(customerDto);
      expect(result.data.email).toBe('abc@mail.com');
    });

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
