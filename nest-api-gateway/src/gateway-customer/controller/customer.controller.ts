import { Controller, Logger, Inject, UsePipes, Post, Res, Body, NotFoundException, HttpStatus, Get, UseGuards, Param, Put } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Response } from 'express';

import { CustomerService } from '../service/customer.service';
import { joiLoginSchema, joiRegisterSchema } from '../schema/customer.registraion.schema';
import { CustomerRegisterDto } from '../dto/customer.register.dto';
import { JwtAuthGuard } from '../authgaurd/jwt.gaurd';
import { joiCustomerSchema } from '../schema/customerSchema';
import { CustomerDto } from '../dto/customer.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';



@Controller('api/v1/customer')
export class CustomerController {

    constructor(private customerService : CustomerService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}
  
      @UsePipes(new ValidationPipe([joiLoginSchema]))
      @Post('login')
      async login(@Res() res : Response, @Body() customerRegisterDto: CustomerRegisterDto):Promise<any> {
        this.logger.debug("In AuthController::Client::login");
        const customer = await this.customerService.login(customerRegisterDto);
        if(!customer) throw new NotFoundException('Customer does not exist!');
        const token = await this.customerService.getToken(customer);
        return res.status(HttpStatus.OK).header(token).send(customer);
      }
  
      @UsePipes(new ValidationPipe([joiRegisterSchema]))
      @Post('register')
      async register(@Res() res : Response, @Body() customerRegisterDto: CustomerRegisterDto):Promise<any> {
        this.logger.debug("In AuthController::register");
        const customer = await this.customerService.register(customerRegisterDto);
        return res.status(HttpStatus.CREATED).send(customer)
      }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllCustomer(@Res() res:Response) :Promise<any>{
        const customers = await this.customerService.getAllCustomer();
        return res.status(HttpStatus.OK).send(customers);
    }

    // Fetch a particular customer using ID
    @Get('/:customerId')
    @UseGuards(JwtAuthGuard)
    async getCustomer(@Res() res:Response, @Param('customerId') customerId:string):Promise<any> {
        const customer = await this.customerService.getCustomerById(customerId);
        if (!customer) throw new NotFoundException('Customer does not exist!');
        return res.status(HttpStatus.OK).send(customer);
    }

    @UsePipes(new ValidationPipe([joiCustomerSchema]))
    @Put()
    @UseGuards(JwtAuthGuard)
    async updateCustomer(@Res() res:Response, @Body()customerDto : CustomerDto):Promise<any> {
        const customer = await this.customerService.updateExistingCustomer(customerDto);
        if(!customer) throw new NotFoundException('Customer does not exist!');

        return res.status(HttpStatus.OK).send(customer);
    }
}
