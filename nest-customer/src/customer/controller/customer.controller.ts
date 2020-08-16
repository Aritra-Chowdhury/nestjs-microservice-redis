import { Controller, Get, Res, HttpStatus, Param, NotFoundException,
     UseGuards, UsePipes, Put, Body, Logger, Inject, UseFilters } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.gaurd';
import { joiCustomerSchema } from '../schema/customerSchema';
import {CustomerDto} from '../dto/customer.dto'
import { ValidationPipe } from 'src/shared/validation.pipe';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CustomerExceptionFilter } from 'src/shared/rpc-exception.filter';
import { Http } from 'winston/lib/winston/transports';

//@Controller('api/v1/customer')
@UseFilters(new CustomerExceptionFilter())
@Controller()
export class CustomerController {

    constructor(private customerService: CustomerService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}

    @MessagePattern({cmd:'getAllCustomer'})
    async getAllCustomer() :Promise<any>{
        const customers = await this.customerService.getAllCustomer();
        return this.getResponse(customers,HttpStatus.OK);
    }

    // Fetch a particular customer using ID
    @MessagePattern({cmd:'getCustomer'})
    async getCustomer(customerId:string):Promise<any> {
        this.logger.debug("In CustomerController::getCustomer::"+customerId);
        const customer = await this.customerService.getCustomerById(customerId);
        if (!customer) throw new RpcException({message:'Customer does not exist!',status:HttpStatus.NOT_FOUND});
        return this.getResponse(customer,HttpStatus.OK);
    }

    @MessagePattern({cmd:'updateCustomer'})
    async updateCustomer(customerDto : CustomerDto):Promise<any> {
        this.logger.debug("In CustomerController::getCustomer::"+JSON.stringify(customerDto));
        const customer = await this.customerService.updateExistingCustomer(customerDto);
        if(!customer) throw new RpcException({message:'Customer does not exist!',status:HttpStatus.NOT_FOUND});

        return this.getResponse(customer,HttpStatus.OK);
    }

    getResponse(data ,statusCode){
        return {data:data,status:statusCode}
    }

    // @Get()
    // @UseGuards(JwtAuthGuard)
    // async getAllCustomer(@Res() res:Response) :Promise<any>{
    //     const customers = await this.customerService.getAllCustomer();
    //     return res.status(HttpStatus.OK).send(customers);
    // }

    // // Fetch a particular customer using ID
    // @Get('/:customerId')
    // @UseGuards(JwtAuthGuard)
    // async getCustomer(@Res() res:Response, @Param('customerId') customerId:string):Promise<any> {
    //     const customer = await this.customerService.getCustomerById(customerId);
    //     if (!customer) throw new NotFoundException('Customer does not exist!');
    //     return res.status(HttpStatus.OK).send(customer);
    // }

    // @UsePipes(new ValidationPipe([joiCustomerSchema]))
    // @Put()
    // @UseGuards(JwtAuthGuard)
    // async updateCustomer(@Res() res:Response, @Body()customerDto : CustomerDto):Promise<any> {
    //     const customer = await this.customerService.updateExistingCustomer(customerDto);
    //     if(!customer) throw new NotFoundException('Customer does not exist!');

    //     return res.status(HttpStatus.OK).send(customer);
    // }
}
