import { Controller, Get, Res, HttpStatus, Param, NotFoundException,
     UseGuards, UsePipes, Put, Body, Logger, Inject } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.gaurd';
import { joiCustomerSchema } from '../schema/customerSchema';
import {CustomerDto} from '../dto/customer.dto'
import { ValidationPipe } from 'src/shared/validation.pipe';
import { MessagePattern } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('api/v1/customer')
export class CustomerController {

    constructor(private customerService: CustomerService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}

    @MessagePattern({cmd:'getAllCustomer'})
    async getAllCustomer() :Promise<any>{
        const customers = await this.customerService.getAllCustomer();
        return customers;
    }

    // Fetch a particular customer using ID
    @MessagePattern({cmd:'getCustomer'})
    async getCustomer(customerId:string):Promise<any> {
        this.logger.debug("In CustomerController::getCustomer::"+customerId);
        const customer = await this.customerService.getCustomerById(customerId);
        if (!customer) throw new NotFoundException('Customer does not exist!');
        return customer;
    }

    @MessagePattern({cmd:'updateCustomer'})
    async updateCustomer(customerDto : CustomerDto):Promise<any> {
        this.logger.debug("In CustomerController::getCustomer::"+JSON.stringify(customerDto));
        const customer = await this.customerService.updateExistingCustomer(customerDto);
        if(!customer) throw new NotFoundException('Customer does not exist!');

        return customer;
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
