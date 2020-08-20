import { Injectable, NotFoundException, Inject, Logger, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import * as _ from 'lodash';

import { Account } from '../schema/account.schema';
import { AccountDto } from '../dto/account.dto';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Injectable()
export class AccountService {
    constructor(@InjectModel('Account') private readonly accountModel : Model<Account>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @Inject("Customer_service") private readonly clientCustomer: ClientProxy){}
    

    async onApplicationBootstrap() {
        await this.clientCustomer.connect();
    } 

    async createAccount(accountDto : AccountDto ):Promise<any>{  

        this.logger.debug("In AccountService controller::createAccount::"+accountDto);
        var customer = await this.updateCustomerData(_.pick(accountDto,['customerId','userDetails','mailingAddress']));
        if(!customer) throw new RpcException({message:'Customer does not exist!',status:HttpStatus.NOT_FOUND});

        const account = await this.accountModel(_.pick(accountDto,['accountType','customerId','isJoint']));
        await account.save();
        return this.populateAccountData(account,customer);
    }

    async updateAccount(accountDto : AccountDto):Promise<any>{
        const updatedAccount = await this.accountModel.findByIdAndUpdate(accountDto.accountNumber,{
            $set : _.pick(accountDto,['accountType','isJoint'])},{new : true});
        
        if(!updatedAccount) throw new RpcException({message:'Account does not exist!',status:HttpStatus.NOT_FOUND});

        return this.populateAccountData(updatedAccount,accountDto.customer);
    }

    async getAllAccountByCustomerId(customerId:any,customer:any):Promise<any>{
        const accounts = await this.accountModel.find({customerId});
        if(accounts && accounts.length == 0) 
        throw new RpcException({message:'No account found or the customer id!',status:HttpStatus.NOT_FOUND});

        var accountsList = [];
            accounts.forEach((account)=>{
                accountsList.push(this.populateAccountData(account,customer))
            });
                                                    
        return accountsList;
            
    }

    async getAccountById(accountId:any,customer:any):Promise<any>{
        const account = await this.accountModel.findOne({_id : accountId , customerId : customer.customerId});
        if(!account) 
        throw new RpcException({message:'No account found with the account number for the customer!',status:HttpStatus.NOT_FOUND});

        return this.populateAccountData(account,customer);
    }

    async deleteAccountById(accountId:any,customer:any):Promise<any>{

        const account = await this.accountModel.findByIdAndUpdate(accountId,{
            $set : {closingDate : new Date()}},{new : true});
        if(!account) 
        throw new RpcException({message:'No account found with the account number for the customer!',status:HttpStatus.NOT_FOUND});
                                       
        return this.populateAccountData(account,customer);
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
  async updateCustomerData(data:any):Promise<any>{
    return new Promise((resolve, reject)=>{
        this.clientCustomer.send<any,any>({cmd:'updateCustomer'},data).subscribe(
            (result) =>{
                if(result.status != 200){
                    reject(result);
                }
                this.logger.debug("In CustomerService::makeServiceCall::"+JSON.stringify(result));
                resolve(result.data);
            },
            (error) => {
                this.logger.error(error);
                reject({message:"Error while calling customer service",status:HttpStatus.INTERNAL_SERVER_ERROR});
            }
        );
    }).catch(result=>{
            this.logger.debug(" Response from account service with status:"+result.status+"message:"+JSON.stringify(result.message));
            throw new RpcException({message:result.message,status:parseInt(result.status)});
        });;
    }
    populateAccountData(account,customer){
        var accountObj = account.transform();
        accountObj.userDetails = customer.userDetails;
        accountObj.mailingAddress = customer.mailingAddress;
      
        return accountObj;
    }
}   
