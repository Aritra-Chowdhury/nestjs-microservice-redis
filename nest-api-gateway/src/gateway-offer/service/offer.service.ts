import { Injectable, Inject, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { OfferDto } from '../dto/offer.dto';

@Injectable()
export class OfferService {
    constructor (@Inject("Offer_service") private readonly clientAccount: ClientProxy,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}

    async createOffer(offerDto: OfferDto ):Promise<any>{
        this.logger.debug("In OfferService::createOffer");
        return this.makeServiceCall('createOffer', offerDto);
    }

    async updateOffer(offerDto: OfferDto ):Promise<any>{
        this.logger.debug("In OfferService::updateOffer");
        return this.makeServiceCall('updateOffer', offerDto);
    }

    async getAllOfferByLoanType(loanType: string ):Promise<any>{
        this.logger.debug("In OfferService::getAllOfferByLoanType");
        return this.makeServiceCall('getOfferByLoanType', loanType);   
    }

    async getAllOffer():Promise<any>{
        this.logger.debug("In OfferService::getAllOffer");
        return this.makeServiceCall('getAllOffer', '');
    }

    async getOfferByofferName(offerName: string ):Promise<any>{
        this.logger.debug("In OfferService::getOfferByofferName");
        return this.makeServiceCall('getOfferByofferName', offerName);
    }

    async makeServiceCall(pattern:any , data:any){
        return new Promise((resolve, reject)=>{
            this.clientAccount.send<any,any>({cmd:pattern},data).subscribe(
                (result) =>{
                    if(result.status != 200 && result.status != 201){
                        reject(result);
                    }
                    this.logger.debug("In OfferServiceService::makeServiceCall::"+JSON.stringify(result));
                    resolve(result.data);
                },
                (error) => {
                    this.logger.error(error);
                    reject({message:"Error while calling offer service",status:HttpStatus.INTERNAL_SERVER_ERROR});
                }
            );
        }).catch(result=>{
            this.logger.debug(" Response from offer service with status:"+result.status+"message:"+JSON.stringify(result.message));
            throw new HttpException(result.message,parseInt(result.status));
        });
    }
}
