import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from './validation.pipe';
import { joiRegisterSchema , joiLoginSchema } from './test-config/test.customerr.schema'

describe('AppController', () => {
  let validationPipe: ValidationPipe;
  let customerDto:any = {};
  beforeEach(async () => {
    customerDto.email = 'abc@mail.com';
    customerDto.customerId = '123456789';
    customerDto.password = 'abcd12324';
    customerDto.name = 'Demo Name';

    const app: TestingModule = await Test.createTestingModule({
      providers: [ValidationPipe],
    }).compile();

  });

  describe('transform',()=>{
      const exec = (schema)=>{
        validationPipe = new ValidationPipe([schema]);
      }
    it('should validate the dto', () => {
        exec(joiRegisterSchema);
        const result = validationPipe.transform(customerDto , null);
        expect(result).toBeDefined();
    });

    it('should throw "email" is not allowed to be empty;', () => {
        customerDto.email = '';
        try{
            exec(joiRegisterSchema);
            const result = validationPipe.transform(customerDto , null);
        }catch(error){
            expect(error.status).toBe(400);
            expect(error.message).toBe('"email" is not allowed to be empty;');
        }
    });

    it('should throw "email" must be a valid email;', () => {
        customerDto.email = 'abc';
        try{
            exec(joiRegisterSchema);
            const result = validationPipe.transform(customerDto , null);
        }catch(error){
            expect(error.status).toBe(400);
            expect(error.message).toBe('"email" must be a valid email;');
        }
    });

    it('should throw "password" length must be at least 8 characters long;', () => {
        customerDto.password = 'abc';
        try{
            exec(joiRegisterSchema);
            const result = validationPipe.transform(customerDto , null);
        }catch(error){
            expect(error.status).toBe(400);
            expect(error.message).toBe('"password" length must be at least 8 characters long;');
        }
    });

    it('should throw "password" length must be at least 8 characters long;', () => {
        customerDto.password = 'abc';
        try{
            exec(joiLoginSchema);
            const result = validationPipe.transform(customerDto , null);
        }catch(error){
            expect(error.status).toBe(400);
            expect(error.message).toBe('"password" length must be at least 8 characters long;');
        }
    });

    it('should throw \"value\" must contain at least one of [customerId, email];', () => {
        customerDto = {
            password : 'abcd12324'
        }
        try{
            exec(joiLoginSchema);
            const result = validationPipe.transform(customerDto , null);
        }catch(error){
            expect(error.status).toBe(400);
            expect(error.message).toBe('"value" must contain at least one of [customerId, email];');
        }
    });

    it('should throw Missing validation schema', () => {
        try{
            validationPipe = new ValidationPipe();
            const result = validationPipe.transform(customerDto , null);
        }catch(error){
            expect(error.status).toBe(501);
            expect(error.message).toBe('Missing validation schema');
        }
    });
    

  })

  it('should be defined', () => {
    expect(validationPipe).toBeDefined();
  });
});