import { Injectable, Inject, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { OfferDto } from '../dto/offer.dto';
import * as CircuitBreaker  from 'opossum';

@Injectable()
export class OfferService {
    constructor (@Inject("Offer_service") private readonly clientOffer: ClientProxy,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}

    options:any = {
        timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
        errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
        resetTimeout: 30000 // After 30 seconds, try again.
     };

    async createOffer(offerDto: OfferDto ):Promise<any>{
        this.logger.debug("In OfferService::createOffer");
        return this.makeServiceCall('createOffer', offerDto);
    }

    async updateOffer(offerDto: OfferDto ):Promise<any>{
        this.logger.debug("In OfferService::updateOffer");
        return this.makeServiceCall('updateOffer', offerDto);
    }

    async getOfferByLoanTypeAndOfferType(loanType: string ,offerType: string):Promise<any>{
        this.logger.debug("In OfferService::getOfferByLoanTypeAndOfferType");
        var offerData:OfferDto = new OfferDto();
        offerData.loanType = loanType;
        offerData.offerType = offerType;
        return this.makeServiceCall('getOfferByLoanTypeAndOfferType', offerData);   
    }

    async getAllOffer():Promise<any>{
        this.logger.debug("In OfferService::getAllOffer");
        return this.makeServiceCall('getAllOffer', '');
    }

    async getOfferByofferName(offerName: string ):Promise<any>{
        this.logger.debug("In OfferService::getOfferByofferName");
        return this.makeServiceCall('getOfferByofferName', offerName);
    }

    // async makeServiceCall(pattern:any , data:any){
    //     return new Promise((resolve, reject)=>{
    //         this.clientOffer.send<any,any>({cmd:pattern},data).subscribe(
    //             (result) =>{
    //                 if(result.status != 200 && result.status != 201){
    //                     reject(result);
    //                 }
    //                 this.logger.debug("In OfferServiceService::makeServiceCall::"+JSON.stringify(result));
    //                 resolve(result.data);
    //             },
    //             (error) => {
    //                 this.logger.error(error);
    //                 reject({message:"Error while calling offer service",status:HttpStatus.INTERNAL_SERVER_ERROR});
    //             }
    //         );
    //     }).catch(result=>{
    //         this.logger.debug(" Response from offer service with status:"+result.status+"message:"+JSON.stringify(result.message));
    //         throw new HttpException(result.message,parseInt(result.status));
    //     });
    // }

    async makeServiceCall(pattern:any , data:any){
        const result = await this.breakerDesign(pattern,data);
        if(result.status != 200 && result.status != 201){
            this.logger.debug(" Response from OfferServiceService with status:"+result.status+" message:"+JSON.stringify(result.message));
            throw new HttpException(result.message,parseInt(result.status));
        }
        this.logger.debug("In OfferServiceService::makeServiceCall::"+JSON.stringify(result));
        return result.data;

    }

    makeCall(pattern:any , data:any):Promise<any>{
        return new Promise(async (resolve, reject)=>{
            this.clientOffer.send<any,any>({cmd: pattern},data).subscribe(
                (result) =>{
                    resolve(result) ;
                },
                (err) => {
                    console.log(err);
                    reject({message:"Error while calling OfferServiceService",status:HttpStatus.INTERNAL_SERVER_ERROR});
                });
        });
    }
    
    async breakerDesign(pattern:any , data:any):Promise<any>{
        const circuitBreaker = new CircuitBreaker(this.makeCall.bind(this),this.options);
        //console.log(circuitBreaker.status.stats);
        return circuitBreaker.fire(pattern , data);
    }
}
