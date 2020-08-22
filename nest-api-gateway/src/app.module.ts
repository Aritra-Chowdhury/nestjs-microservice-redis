import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayCustomerModule } from './gateway-customer/gateway-customer.module';
import { GatewayAccountModule } from './gateway-account/gateway-account.module';
import { SharedModule } from './shared/shared.module';
import { GatewayOfferModule } from './gateway-offer/gateway-offer.module';
import { GatewayLoanModule } from './gateway-loan/gateway-loan.module';
import defaultConfiguration from 'config/default.configuration';

@Module({
  imports: [
    GatewayCustomerModule, 
    GatewayAccountModule, 
    SharedModule,
    ConfigModule.forRoot({
      isGlobal :true,
      load : [defaultConfiguration]
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint()),
      handleExceptions : true,
      level : 'debug',
      transports: [
        new winston.transports.File({
            filename : './log/api-gateway.log'
        }),
        new winston.transports.Console(),
      ]
    }),
    GatewayOfferModule,
    GatewayLoanModule
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
