import { Injectable, Inject, Logger, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Offer } from '../schema/offer.schema';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Model } from "mongoose";
import { OfferDto } from '../dto/offer.dto';
import { RpcException } from '@nestjs/microservices';
import * as _ from 'lodash';

@Injectable()
export class OfferService {
    constructor (@InjectModel('Offer') private readonly offerModel : Model<Offer>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}

    async createOffer(offerDto: OfferDto ):Promise<any>{
        this.logger.debug("In OfferService::createOffer");

        const offerCheck = await this.offerModel.findOne({offerName : offerDto.offerName});
        if(offerCheck) throw new RpcException({status:HttpStatus.BAD_REQUEST , message:'Offer with offer name already exist!'});
        
        const offerValidate = await this.offerModel.find({offerType : offerDto.offerType, loanType : offerDto.loanType});
        if(offerValidate && offerValidate.length != 0) throw new RpcException({message:`Offer with offerType:${offerDto.offerType} already exist for loanType:${offerDto.loanType} !`,status:HttpStatus.BAD_REQUEST});

        const offer = await this.offerModel(offerDto);
        await offer.save();
        return offer.transform();
    }

    async updateOffer(offerDto: OfferDto ):Promise<any>{

        const offer = await this.offerModel.findOne({offerName : offerDto.offerName});
        if(offer && offer._id !=offerDto.offerId ) throw new RpcException({message:'Offer with offer name already exist!',status:HttpStatus.BAD_REQUEST});
        
        const offerCheck = await this.offerModel.find({offerType : offerDto.offerType, loanType : offerDto.loanType});
        console.log(offerCheck);
        console.log(offerCheck[0]._id);
        console.log(offerCheck[0]._id != offerDto.offerId);

        if(offerCheck && offerCheck[0]._id != offerDto.offerId ) throw new RpcException({message:`Offer with offerType:${offerDto.offerType} already exist for loanType:${offerDto.loanType} !`,status:HttpStatus.BAD_REQUEST});
 
        offerDto.lastUpdateDate = Date.now().toString();
        const updateOffer = await this.offerModel.findByIdAndUpdate(offerDto.offerId,{
            $set : _.pick(offerDto,['offerName','offerType','loanType','offerPercentage','lastUpdateDate'])},{new : true});
        
        if(!updateOffer) throw new RpcException({message:'No offer found!',status:HttpStatus.NOT_FOUND});

        return updateOffer.transform();
    }

    async getOfferByLoanTypeAndOfferType(loanType: string ,offerType: string ):Promise<any>{

        const offers = await this.offerModel.find({offerType : offerType, loanType : loanType});
        if(offers && offers.length == 0) 
        throw new RpcException({message:'No offer available for the loan type and offer Type!',status:HttpStatus.NOT_FOUND});

        const offerList = [];
        offers.forEach((offer)=>{
            offerList.push(offer.transform())
            });
                                                    
        return offerList;
        
    }

    async getAllOffer():Promise<any>{
        const offers = await this.offerModel.find({});
        if(offers && offers.length == 0) 
        throw new RpcException({message:'No offer available!',status:HttpStatus.NOT_FOUND});

        const offerList = [];
        offers.forEach((offer)=>{
            offerList.push(offer.transform())
            });
                                                    
        return offerList;
    }

    async getOfferByofferName(offerName: string ):Promise<any>{
        this.logger.debug("In OfferService::getOfferByofferName::"+offerName);
        const offer = await this.offerModel.findOne({offerName : offerName});
        if(!offer) 
        throw new RpcException({message:'No offer found with the offer name!',status:HttpStatus.NOT_FOUND});
        return offer.transform();
    }
}
