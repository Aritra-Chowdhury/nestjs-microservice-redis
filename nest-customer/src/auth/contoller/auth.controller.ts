import { Controller, Post, Body, Res, HttpStatus, NotFoundException, UsePipes, Logger, Inject, UseFilters } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import {CustomerRegisterDto} from '../dto/customer.register.dto'
import { Response } from 'express';

import {joiRegisterSchema , joiLoginSchema} from '../schema/customer.registraion.schema';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MessagePattern, EventPattern, RpcException } from '@nestjs/microservices';
import { CustomerExceptionFilter } from '../../shared/rpc-exception.filter';

//@Controller('api/v1/customer')
@UseFilters(new CustomerExceptionFilter())
@Controller()
export class AuthController {
    constructor(private authService : AuthService,
      @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}


   
    @MessagePattern({cmd:'login'})
    async login(customerRegisterDto: CustomerRegisterDto):Promise<any> {
      this.logger.debug("In AuthController::login");
      const customer = await this.authService.validateCustomer(customerRegisterDto);
      if(!customer) throw new RpcException({message:'Customer does not exist!',status:HttpStatus.NOT_FOUND});
      return this.getResponse(customer,HttpStatus.OK);
    }

    @MessagePattern({cmd:'register'})
    async register(customerRegisterDto: CustomerRegisterDto):Promise<any> {
      this.logger.debug("In AuthController::register");
      const customer = await this.authService.register(customerRegisterDto);
      return this.getResponse(customer,HttpStatus.CREATED);
    }

    getResponse(data ,statusCode){
      return {data:data,status:statusCode}
    }
    // @UsePipes(new ValidationPipe([joiLoginSchema]))
    // @Post('login')
    // async login(@Res() res : Response, @Body() customerRegisterDto: CustomerRegisterDto):Promise<any> {
    //   this.logger.debug("In AuthController::login");
    //   const customer = await this.authService.validateCustomer(customerRegisterDto);
    //   if(!customer) throw new NotFoundException('Customer does not exist!');
    //   const token = await this.authService.getToken(customer);
    //   return res.status(HttpStatus.OK).header(token).send(customer);
    // }

    // @UsePipes(new ValidationPipe([joiRegisterSchema]))
    // @Post('register')
    // async register(@Res() res : Response, @Body() customerRegisterDto: CustomerRegisterDto):Promise<any> {
    //   this.logger.debug("In AuthController::register");
    //   const customer = await this.authService.register(customerRegisterDto);
    //   return res.status(HttpStatus.CREATED).send(customer)
    // }
}
