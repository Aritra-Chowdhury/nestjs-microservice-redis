import { Injectable, Inject, Logger, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as CircuitBreaker  from 'opossum';

import { CustomerRegisterDto } from '../dto/customer.register.dto';
import { CustomerDto } from '../dto/customer.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CustomerService {

    constructor (private jwtService: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
        @Inject("Customer_service") private readonly clientCustomer: ClientProxy){}

    // async onApplicationBootstrap() {
    //     await this.clientCustomer.connect();
    // } 

    options:any = {
        timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
        errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
        resetTimeout: 30000 // After 30 seconds, try again.
    };

    async getToken(customer: any) {
        const payload = {customerId : customer.customerId, name : customer.name};
        return {
            'x-auth-token' : this.jwtService.sign(payload)
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

    // async makeServiceCall(pattern:any , data:any){
    //     return new Promise((resolve, reject)=>{
    //         console.log(this.clientCustomer);
    //         this.clientCustomer.send<any,any>({cmd: pattern},data).subscribe(
    //             (result) =>{
    //                 if(result.status != 200 && result.status != 201){
    //                     reject(result);
    //                 }
    //                 this.logger.debug("In CustomerService::makeServiceCall::"+JSON.stringify(result));
    //                 resolve(result.data);
    //             },
    //             (error) => {
    //                 this.logger.error(error);
    //                 reject({message:"Error while calling customer service",status:HttpStatus.INTERNAL_SERVER_ERROR});
    //             }
    //         );
    //     }).catch(result=>{
    //         this.logger.debug(" Response from account service with status:"+result.status+" message:"+JSON.stringify(result.message));
    //         throw new HttpException(result.message,parseInt(result.status));
    //     });
    // }

    async makeServiceCall(pattern:any , data:any){
        const result = await this.breakerDesign(pattern,data);
        if(result.status != 200 && result.status != 201){
            this.logger.debug(" Response from customer service with status:"+result.status+" message:"+JSON.stringify(result.message));
            throw new HttpException(result.message,parseInt(result.status));
        }
        this.logger.debug("In CustomerService::makeServiceCall::"+JSON.stringify(result));
        return result.data;

    }

    makeCall(pattern:any , data:any):Promise<any>{
        return new Promise(async (resolve, reject)=>{
            this.clientCustomer.send<any,any>({cmd: pattern},data).subscribe(
                (result) =>{
                    resolve(result) ;
                },
                (err) => {
                    console.log(err);
                    reject({message:"Error while calling customer service",status:HttpStatus.INTERNAL_SERVER_ERROR});
                });
        });
    }
    
    async breakerDesign(pattern:any , data:any):Promise<any>{
        const circuitBreaker = new CircuitBreaker(this.makeCall.bind(this),this.options);
        //console.log(circuitBreaker.status.stats);
        const result = await circuitBreaker.fire(pattern , data);
        // circuitBreaker.on('open',()=>{
        //     return {message:"Unable to reach customer service.Please try later",status:HttpStatus.INTERNAL_SERVER_ERROR}
        //  });
        //  circuitBreaker.on('timeout',(error)=>{
        //      return {message:"Unable to reach customer service.Please try later",status:HttpStatus.INTERNAL_SERVER_ERROR}
        //   });
        return result;
    }
}
