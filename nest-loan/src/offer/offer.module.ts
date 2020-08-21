import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OfferController } from './contoller/offer.controller';
import { OfferService } from './service/offer.service';
import { offerSchema } from './schema/offer.schema';
@Module({
    imports: [
        SharedModule,
        MongooseModule.forFeature([{ name: 'Offer', schema: offerSchema}])],
    controllers: [OfferController],
    providers: [OfferService],
    exports: [OfferService]
})
export class OfferModule {}
