import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { MongooseConfigurationService } from './configurationservice/mongoose.service';
import defaultConfiguration from 'config/default.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
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
            filename : './log/account-service.log'
        }),
        new winston.transports.Console(),
      ]
    }),
    AccountModule,
    AuthModule, 
    SharedModule],
  controllers: [AppController],
  providers: [AppService, MongooseConfigurationService],
})
export class AppModule {}
