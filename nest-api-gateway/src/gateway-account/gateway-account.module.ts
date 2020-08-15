import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from "@nestjs/microservices";

import { AccountController } from './controller/account.controller';
import { AccountService } from './service/account.service';
import { SharedModule } from 'src/shared/shared.module';
import { GatewayCustomerModule } from 'src/gateway-customer/gateway-customer.module';

@Module({
    imports:[
        SharedModule , 
        GatewayCustomerModule,
        JwtModule.register({
            secret:"privatekey",
            signOptions: { expiresIn: '10000s' },
          }),
          ClientsModule.register([
            {
                name: "Account_service",
                transport: Transport.REDIS,
                options: {
                    url: 'redis://localhost:6379',
                    connect_timeout :5000
                },

                // transport: Transport.TCP,
                // options: {
                //     host: "localhost",
                //     port: parseInt(process.env.ACCOUNT_PORT) || 3002
                // }
            }
            ])],
    controllers: [AccountController],
    providers: [AccountService],
})
export class GatewayAccountModule {}
