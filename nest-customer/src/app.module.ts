import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import defaultConfiguration  from '../config/default.configuration'
import {MongooseConfigurationService} from './configurationservices/mongoose.service'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal :true,
      load : [defaultConfiguration]
    }),
    MongooseModule.forRootAsync({
      useClass : MongooseConfigurationService
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint()),
      handleExceptions : true,
      level : 'debug',
      transports: [
        new winston.transports.File({
            filename : './log/customer-service.log'
        }),
        new winston.transports.Console(),
      ]
    }),
    CustomerModule , 
    AuthModule,
    SharedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
