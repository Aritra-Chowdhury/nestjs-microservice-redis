import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CustomerRegisterDto } from '../dto/customer.register.dto';
import { CustomerDto } from '../dto/customer.dto';
import { ClientProxy } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';


@Injectable()
export class CustomerService {

    constructor (private jwtService: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
        @Inject("Customer_service") private readonly clientCustomer: ClientProxy){}

    async onApplicationBootstrap() {
        await this.clientCustomer.connect();
    } 
    async getToken(customer: any) {
        const payload = {customerId : customer.customerId, name : customer.name};
        return {
            'x-auth-token' : this.jwtService.sign(payload),
        };
    }
    async login(customer: CustomerRegisterDto) :Promise<any>{
        this.logger.debug("In CustomerService::Client::login"+JSON.stringify(customer));
        return this.makeServiceCall('login', customer);     
    }


    async register(customerRegisterDto : CustomerRegisterDto):Promise<any>{
        this.logger.debug("In CustomerService::Client::register"+JSON.stringify(customerRegisterDto));
        return this.makeServiceCall('register', customerRegisterDto);     
    }

    async getAllCustomer(): Promise<any>{
        this.logger.debug("In CustomerService::Client::getAllCustomer");
        return this.makeServiceCall('getAllCustomer', "");     
    }

    async getCustomerById(customerId:string): Promise<any>{
        this.logger.debug("In CustomerService::Client::getCustomerById::"+customerId);
        return this.makeServiceCall('getCustomer', customerId);     
    }

    async updateExistingCustomer(customerDto : CustomerDto):Promise<any>{
        this.logger.debug("In CustomerService::Client::updateExistingCustomer"+JSON.stringify(customerDto));
        return this.makeServiceCall('updateCustomer', customerDto);     
    }

    async makeServiceCall(pattern:any , data:any){
        return new Promise((resolve, reject)=>{
            this.clientCustomer.send<any,any>({cmd: pattern},data).subscribe(
                (result) =>{

                    this.logger.debug("In CustomerService::makeServiceCall::"+JSON.stringify(result));
                    resolve(result);
                },
                (error) => {
                    this.logger.error(error);
                    reject("Error while calling customer service");
                }
            );
        });
    }
}
