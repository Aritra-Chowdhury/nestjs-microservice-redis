import { Injectable, Inject, Logger, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Loan } from '../schema/loan.schema';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LoanDto } from '../dto/loan.dto';
import * as _ from 'lodash';
import { OfferService } from './../../offer/service/offer.service';

@Injectable()
export class LoanService {
    
    constructor (@InjectModel('Loan') private readonly loanModel : Model<Loan>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private offerService : OfferService,
    @Inject("Account_service") private readonly clientAccount: ClientProxy){}

    async onApplicationBootstrap():Promise<void> {
        await this.clientAccount.connect();
    }
    
    async createLoan(loanDto : LoanDto):Promise<any>{
        this.logger.debug("In LoanService ::createLoan::" + loanDto);

        const account = await this.makeServiceCall('getAccountById',_.pick(loanDto,['accountNumber','customer']));
        if(!account) 
        throw new RpcException({message:'No account found for account number!',status:HttpStatus.NOT_FOUND});

        let offer:any;
        try{
            offer = await this.offerService.getOfferByofferName(loanDto.offer.offerName);
        }catch(error){
            console.log(error);
            throw new RpcException({message:error.message,status:HttpStatus.BAD_REQUEST});
        }

        loanDto.offer.offerPercentage = offer.offerPercentage;
        loanDto.offer.offerType = offer.offerType;
        loanDto.status = "Pending";
        loanDto.lastUpdatedDate = Date.now().toString();

        loanDto.monthlyEMI = this.calculateMonthlyEMI(loanDto.loanAmount,loanDto.offer.offerPercentage,parseInt(loanDto.loanDuration));

        const loan = await this.loanModel(_.pick(loanDto,['accountNumber','customerId','loanType','loanAmount',
                                'loanDuration','status','offer','loanCreationDate','lastUpdatedDate','monthlyEMI']));
        await loan.save();

        return loan.transform();
    }

    async updateLoan(loanDto : LoanDto):Promise<any>{
        this.logger.debug("In LoanService ::updateLoan::" + loanDto);

        let offer:any;
        try{
            offer = await this.offerService.getOfferByofferName(loanDto.offer.offerName);
        }catch(error){
            throw new RpcException({message:error.message,status:parseInt(error.status)});
        }
        loanDto.offer.offerPercentage = offer.offerPercentage;
        loanDto.lastUpdatedDate = Date.now().toString();

        loanDto.monthlyEMI = this.calculateMonthlyEMI(loanDto.loanAmount,loanDto.offer.offerPercentage,parseInt(loanDto.loanDuration));

        const loan = await this.loanModel.findByIdAndUpdate(loanDto.loanNumber,{
            $set : _.pick(loanDto,['loanAmount','loanDuration','lastUpdatedDate','monthlyEMI'])
            },{new : true});

        if(!loan) throw new RpcException({message:'Loan number does not exist!',status:HttpStatus.NOT_FOUND});

        return loan.transform();

    }

    async validateLoan(loanDto : LoanDto):Promise<any>{
        this.logger.debug("In LoanService ::validateLoan::" + loanDto);
        const loan = await this.loanModel.findByIdAndUpdate(loanDto.loanNumber,{
            $set : _.pick(loanDto,['status'])
            },{new : true});

        if(!loan) throw new RpcException({message:'Loan number does not exist!',status:HttpStatus.NOT_FOUND});

        return loan.transform();
    }

    async getLoanById(loanDto : LoanDto):Promise<any>{
        this.logger.debug("In LoanService ::getLoanById::" + loanDto);
        const loan = await this.loanModel.findById(loanDto.loanNumber);

        if(!loan)
        throw new RpcException({message:'No loan found with the loan number!',status:HttpStatus.NOT_FOUND});

        return loan.transform();
    }

    async getAllLoanByCutomerId(loanDto : LoanDto):Promise<any>{
        this.logger.debug("In LoanService ::getLoanById::" + loanDto);
        const loans = await this.loanModel.find({customerId : loanDto.customerId});

        if(loans && loans.length == 0)
        throw new RpcException({message:'No loan found for the customer id!',status:HttpStatus.NOT_FOUND});

        const loanList = [];
        loans.forEach((loan)=>{
            loanList.push(loan.transform())
        });
        return loanList;
    }



    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async makeServiceCall(pattern:string, data:any):Promise<any>{
        return new Promise((resolve, reject)=>{
            this.clientAccount.send<any,any>({cmd:pattern},data).subscribe(
                (result) =>{
                    if(result.status != 200){
                        reject(result);
                    }
                    this.logger.debug("In loan service::makeServiceCall::"+JSON.stringify(result));
                    resolve(result.data);
                },
                (error) => {
                    this.logger.error(error);
                    reject({message:"Error while calling Account service",status:HttpStatus.INTERNAL_SERVER_ERROR});
                }
            );
        }).catch(result=>{
            this.logger.debug(" Response from Account service with status:"+result.status+"message:"+JSON.stringify(result.message));
            throw new RpcException({message:result.message,status:parseInt(result.status)});
        });;
    }

    calculateMonthlyEMI(loanAmount:number,rate:number,duration:number):number{

        let monthlyEMI = 0;
        if(loanAmount > 0 && rate >0 && duration>0){
            monthlyEMI = (loanAmount*(1+(rate*duration)/100))/(duration * 12);
        }else {
            throw new RpcException({message:'Error in calulating EMI!',status:HttpStatus.BAD_REQUEST});
        }

        return monthlyEMI;
    }

}
