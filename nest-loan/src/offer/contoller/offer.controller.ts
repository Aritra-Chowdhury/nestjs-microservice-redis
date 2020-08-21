import { Controller, Inject, Logger, UseFilters, HttpStatus } from '@nestjs/common';
import { OfferService } from '../service/offer.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoanExceptionFilter } from '../../shared/rpc.exception.filter';
import { MessagePattern } from '@nestjs/microservices';
import { OfferDto } from '../dto/offer.dto';

@UseFilters(new LoanExceptionFilter())
@Controller()
export class OfferController {

    constructor(private offerService : OfferService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}

    @MessagePattern({cmd:'createOffer'})
        async createOffer(offerDto: OfferDto):Promise<any>{
        this.logger.debug("In Offer Controller ::createOffer::" + offerDto);
        const offer = await this.offerService.createOffer(offerDto);
        return this.getResponse(offer,HttpStatus.CREATED);
    }

    @MessagePattern({cmd:'updateOffer'})
    async updateOffer(offerDto: OfferDto):Promise<any>{
    this.logger.debug("In Offer Controller ::updateOffer::" + offerDto);
    const offer = await this.offerService.updateOffer(offerDto);
    return this.getResponse(offer,HttpStatus.OK);
    }

    @MessagePattern({cmd:'getOfferByLoanType'})
        async getOfferByLoanType(loanType: string):Promise<any>{
        this.logger.debug("In Offer Controller ::getOfferByLoanType::" + loanType);
        const offers = await this.offerService.getAllOfferByLoanType(loanType);
        return this.getResponse(offers,HttpStatus.OK);
    }

    @MessagePattern({cmd:'getAllOffer'})
        async getAllOffer():Promise<any>{
        this.logger.debug("In Offer Controller ::getAllOffer::");
        const offers = await this.offerService.getAllOffer();
        return this.getResponse(offers,HttpStatus.OK);
    }

    @MessagePattern({cmd:'getOfferByofferName'})
    async getOfferByofferName(offerName: string):Promise<any>{
    this.logger.debug("In Offer Controller ::getOfferByofferName::" + offerName);
    const offer = await this.offerService.getOfferByofferName(offerName);
    return this.getResponse(offer,HttpStatus.OK);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    getResponse(data:any ,statusCode:HttpStatus):any{
        return {data:data,status:statusCode};
      }
}
