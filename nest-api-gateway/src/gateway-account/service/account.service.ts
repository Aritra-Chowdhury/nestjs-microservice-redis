import { Injectable, Inject, Logger, BadRequestException, HttpException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AccountDto } from '../dto/account.dto';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AccountService {
    constructor (private jwtService: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
        @Inject("Account_service") private readonly clientAccount: ClientProxy){}
    

    async onApplicationBootstrap() {
        await this.clientAccount.connect();
    } 
    async createAccount(accountDto : AccountDto , token:string):Promise<any>{  
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
        accountDto.account_number = accountId;
        accountDto.customer = customer;
        this.logger.debug("In AccountService::Client::getAccountById"+JSON.stringify(accountDto));
        return this.makeServiceCall('getAccountById', accountDto);
    }

    async deleteAccountById(accountId:any,customer:any):Promise<any>{
        var accountDto : AccountDto = new AccountDto();;
        accountDto.account_number = accountId;
        accountDto.customer = customer;
        this.logger.debug("In AccountService::Client::deleteAccountById"+JSON.stringify(accountDto));
        return this.makeServiceCall('deleteAccountById', accountDto);

    }

    async makeServiceCall(pattern:any , data:any){
        return new Promise((resolve, reject)=>{
            this.clientAccount.send<any,any>({cmd:pattern},data).subscribe(
                (result) =>{
                    if(result.status != 200 && result.status != 201){
                        reject(result);
                    }
                    this.logger.debug("In AccountService::makeServiceCall::"+JSON.stringify(result));
                    resolve(result.data);
                },
                (error) => {
                    this.logger.error(error);
                    reject("Error while calling account service");
                }
            );
        }).catch(result=>{
            this.logger.debug(" Response from account service with status:"+result.status+"message:"+JSON.stringify(result.message));
            throw new HttpException(result.message,parseInt(result.status));
        });
    }

    // async updateCustomerData(token:string, data:any):Promise<any>{
    //     return new Promise((resolve, reject)=>{
    //         this.sharedService.updateCustomer(token,data).subscribe(
    //             (result) =>{
    //                 if(result.status != 200){
    //                     this.logger.error("Customer not found in account update with status:"+result.status+" error message:"+JSON.stringify(result.data));
    //                     throw new BadRequestException(result.data);
    //                 }
    //                 this.logger.debug("In AuthService::validateCustomer::"+JSON.stringify(result.data));
    //                 resolve(result.data);
    //             },
    //             (error) => {
    //                 this.logger.error(error);
    //                 reject("Error while calling customer service");
    //             }
    //         );
    //     })
    // }
}
