import { Injectable, Inject, Logger, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AccountDto } from '../dto/account.dto';
import { ClientProxy } from '@nestjs/microservices';
import * as CircuitBreaker  from 'opossum';

@Injectable()
export class AccountService {
    constructor (@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
        @Inject("Account_service") private readonly clientAccount: ClientProxy){}
    
    options:any = {
        timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
        errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
        resetTimeout: 30000 // After 30 seconds, try again.
     };
    
    // async onApplicationBootstrap() {
    //     await this.clientAccount.connect();
    // } 
    async createAccount(accountDto : AccountDto):Promise<any>{  
        this.logger.debug("In AccountService::Client::createAccount"+JSON.stringify(accountDto));
        return this.makeServiceCall('createAccount', accountDto);   
    }

    async updateAccount(accountDto : AccountDto):Promise<any>{
        this.logger.debug("In AccountService::Client::updateAccount"+JSON.stringify(accountDto));
        return this.makeServiceCall('updateAccount', accountDto);
    }

    async getAllAccountByCustomerId(customerId:any,customer:any):Promise<any>{
        var accountDto : AccountDto = new AccountDto();
        accountDto.customerId = customerId;
        accountDto.customer = customer;
        this.logger.debug("In AccountService::Client::getAllAccountByCustomerId"+JSON.stringify(accountDto));
        return this.makeServiceCall('getAllAccount', accountDto);
    }

    async getAccountById(accountId:any,customer:any):Promise<any>{
        var accountDto : AccountDto = new AccountDto();;
        accountDto.accountNumber = accountId;
        accountDto.customer = customer;
        this.logger.debug("In AccountService::Client::getAccountById"+JSON.stringify(accountDto));
        return this.makeServiceCall('getAccountById', accountDto);
    }

    async deleteAccountById(accountId:any,customer:any):Promise<any>{
        var accountDto : AccountDto = new AccountDto();;
        accountDto.accountNumber = accountId;
        accountDto.customer = customer;
        this.logger.debug("In AccountService::Client::deleteAccountById"+JSON.stringify(accountDto));
        return this.makeServiceCall('deleteAccountById', accountDto);

    }

    // async makeServiceCall(pattern:any , data:any){
    //     return new Promise((resolve, reject)=>{
    //         this.clientAccount.send<any,any>({cmd:pattern},data).subscribe(
    //             (result) =>{
    //                 if(result.status != 200 && result.status != 201){
    //                     reject(result);
    //                 }
    //                 this.logger.debug("In AccountService::makeServiceCall::"+JSON.stringify(result));
    //                 resolve(result.data);
    //             },
    //             (error) => {
    //                 this.logger.error(error);
    //                 reject({message:"Error while calling account service",status:HttpStatus.INTERNAL_SERVER_ERROR});
    //             }
    //         );
    //     }).catch(result=>{
    //         this.logger.debug(" Response from account service with status:"+result.status+"message:"+JSON.stringify(result.message));
    //         throw new HttpException(result.message,parseInt(result.status));
    //     });
    // }

    async makeServiceCall(pattern:any , data:any){
        const result = await this.breakerDesign(pattern,data);
        if(result.status != 200 && result.status != 201){
            this.logger.debug(" Response from account service with status:"+result.status+" message:"+JSON.stringify(result.message));
            throw new HttpException(result.message,parseInt(result.status));
        }
        this.logger.debug("In AccountService::makeServiceCall::"+JSON.stringify(result));
        return result.data;

    }

    makeCall(pattern:any , data:any):Promise<any>{
        return new Promise(async (resolve, reject)=>{
            this.clientAccount.send<any,any>({cmd: pattern},data).subscribe(
                (result) =>{
                    resolve(result) ;
                },
                (err) => {
                    console.log(err);
                    reject({message:"Error while calling account service",status:HttpStatus.INTERNAL_SERVER_ERROR});
                });
        });
    }
    
    async breakerDesign(pattern:any , data:any):Promise<any>{
        const circuitBreaker = new CircuitBreaker(this.makeCall.bind(this),this.options);
        //console.log(circuitBreaker.status.stats);
        return circuitBreaker.fire(pattern , data);
    }
}
