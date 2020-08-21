import { Module } from '@nestjs/common';
import { OfferService } from './service/offer.service';
import { OfferController } from './controller/offer.controller';
import { SharedModule } from '../shared/shared.module';
import { GatewayCustomerModule } from '../gateway-customer/gateway-customer.module';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports:[
    SharedModule , 
    GatewayCustomerModule,
    JwtModule.register({
        secret: 'privatekey',
        signOptions: { expiresIn: '10000s' },
      }),
      ClientsModule.register([
        {
            name: "Offer_service",
            transport: Transport.REDIS,
            options: {
              url: 'redis://localhost:6379',
              connect_timeout :5000
            },
        }
        ])],
  providers: [OfferService],
  controllers: [OfferController]
})
export class GatewayOfferModule {}
