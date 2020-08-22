import { Injectable, Inject, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ClientProxy } from '@nestjs/microservices';
import { LoanDto } from '../dto/loan.dto';
import * as CircuitBreaker  from 'opossum';

@Injectable()
export class LoanService {
    constructor (@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @Inject("Loan_service") private readonly clientLoan: ClientProxy){}

    async onApplicationBootstrap():Promise<void> {
        await this.clientLoan.connect();
    }
    options:any = {
        timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
        errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
        resetTimeout: 30000 // After 30 seconds, try again.
     };
    
    async createLoan(loanDto : LoanDto):Promise<any>{
        this.logger.debug("In LoanService ::createLoan::" + loanDto);
        return this.makeServiceCall('createLoan', loanDto);
    }

    async updateLoan(loanDto : LoanDto):Promise<any>{
        this.logger.debug("In LoanService ::updateLoan::" + loanDto);
        return this.makeServiceCall('updateLoan', loanDto);

    }

    async validateLoan(loanDto : LoanDto):Promise<any>{
        this.logger.debug("In LoanService ::validateLoan::" + loanDto);
        return this.makeServiceCall('validateLoan', loanDto);
    }

    async getLoanById(loanNumber : string):Promise<any>{
        this.logger.debug("In LoanService ::getLoanById::" + loanNumber);
        let loanDto : LoanDto =new LoanDto();
        loanDto.loanNumber = loanNumber;
        return this.makeServiceCall('getLoanById', loanDto);
    }

    async getAllLoanByCutomerId(customerId : string):Promise<any>{
        this.logger.debug("In LoanService ::getAllLoanByCutomerId::" + customerId);
        let loanDto : LoanDto =new LoanDto();
        loanDto.customerId = customerId;
        return this.makeServiceCall('getAllLoanByCutomerId', loanDto);
    }

    
    // // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    // async makeServiceCall(pattern:string, data:any):Promise<any>{
    //     return new Promise((resolve, reject)=>{
    //         this.clientLoan.send<any,any>({cmd:pattern},data).subscribe(
    //             (result) =>{
    //                 if(result.status != 200 && result.status != 201){
    //                     reject(result);
    //                 }
    //                 this.logger.debug("In Loan service::makeServiceCall::"+JSON.stringify(result));
    //                 resolve(result.data);
    //             },
    //             (error) => {
    //                 this.logger.error(error);
    //                 reject({message:"Error while calling Loan service",status:HttpStatus.INTERNAL_SERVER_ERROR});
    //             }
    //         );
    //     }).catch(result=>{
    //         this.logger.debug(" Response from Account service with status:"+result.status+"message:"+JSON.stringify(result.message));
    //         throw new HttpException(result.message,parseInt(result.status));
    //     });;
    // }

    async makeServiceCall(pattern:any , data:any){
        const result = await this.breakerDesign(pattern,data);
        if(result.status != 200 && result.status != 201){
            this.logger.debug(" Response from loan service with status:"+result.status+" message:"+JSON.stringify(result.message));
            throw new HttpException(result.message,parseInt(result.status));
        }
        this.logger.debug("In LoanService::makeServiceCall::"+JSON.stringify(result));
        return result.data;

    }

    makeCall(pattern:any , data:any):Promise<any>{
        return new Promise(async (resolve, reject)=>{
            this.clientLoan.send<any,any>({cmd: pattern},data).subscribe(
                (result) =>{
                    resolve(result) ;
                },
                (err) => {
                    console.log(err);
                    reject({message:"Error while calling Loan service",status:HttpStatus.INTERNAL_SERVER_ERROR});
                });
        });
    }
    
    async breakerDesign(pattern:any , data:any):Promise<any>{
        const circuitBreaker = new CircuitBreaker(this.makeCall.bind(this),this.options);
        //console.log(circuitBreaker.status.stats);
        return circuitBreaker.fire(pattern , data);
    }
}
