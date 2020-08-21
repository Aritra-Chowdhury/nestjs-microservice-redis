import { Controller, Inject, Logger, UseGuards, UsePipes, Post, Res, Body, Get, Param, Put } from '@nestjs/common';
import { OfferService } from '../service/offer.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from '../../gateway-customer/authgaurd/jwt.gaurd';
import { ValidationPipe } from '../../shared/validation.pipe';
import { joiOfferCreateSchema, joiOfferUpdateSchema } from '../schema/offer.schema';
import { OfferDto } from '../dto/offer.dto';

@Controller('api/v1/offer')
export class OfferController {
    constructor(private offerService : OfferService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}
    
        @UseGuards(JwtAuthGuard)
        @UsePipes(new ValidationPipe([joiOfferCreateSchema]))
        @Post()
        async createOffer(@Res() res: any, @Body() offerDto: OfferDto):Promise<any>{
            this.logger.debug("In Offer Controller ::createOffer::" + offerDto);
            const offer = await this.offerService.createOffer(offerDto);
            return res.status(201).send(offer);
        }
    
        @UseGuards(JwtAuthGuard)
        @UsePipes(new ValidationPipe([joiOfferUpdateSchema]))
        @Put()
        async updateOffer(@Res() res: any, @Body() offerDto: OfferDto):Promise<any>{
            this.logger.debug("In Offer Controller ::updateOffer::" + offerDto);
            const offer = await this.offerService.updateOffer(offerDto);
            return res.status(200).send(offer);
        }
    
        @UseGuards(JwtAuthGuard)
        @Get('/type/:loanType')
        async getOfferByLoanType(@Res() res: any, @Param('loanType') loanType: string):Promise<any>{
            this.logger.debug("In Offer Controller ::getOfferByLoanType::" + loanType);
            const offers = await this.offerService.getAllOfferByLoanType(loanType);
            return res.status(200).send(offers);
        }
    
        @UseGuards(JwtAuthGuard)
        @Get()
        async getAllOffer(@Res() res: any):Promise<any>{
            this.logger.debug("In Offer Controller ::getAllOffer::");
            const offers = await this.offerService.getAllOffer();
            return res.status(200).send(offers);
        }
    
        @UseGuards(JwtAuthGuard)
        @Get('/:offerName')
        async getOfferByofferName(@Res() res: any, @Param('offerName') offerName: string):Promise<any>{
            this.logger.debug("In Offer Controller ::getOfferByofferName::" + offerName);
            const offer = await this.offerService.getOfferByofferName(offerName);
            return res.status(200).send(offer);
        }
    
}
