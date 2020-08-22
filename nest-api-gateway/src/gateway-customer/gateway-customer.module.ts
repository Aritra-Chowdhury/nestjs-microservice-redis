import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from "@nestjs/microservices";

import { CustomerController } from './controller/customer.controller';
import { CustomerService } from './service/customer.service';
import { SharedModule } from '../shared/shared.module';
import { JwtAuthGuard } from './authgaurd/jwt.gaurd';

@Module({
    imports:[
        SharedModule,
        JwtModule.register({
            secret: 'privatekey',
            signOptions: { expiresIn: '10000s' },
          }),
        ClientsModule.register([
        {
            name: "Customer_service",
            transport: Transport.REDIS,
            options: {
                url: 'redis://localhost:6379'
            }
            // transport: Transport.TCP,
            // options: {
            //     host: "localhost",
            //     port: parseInt(process.env.CUSTOMER_PORT) || 3001
            // }
        }
        ])
    ],
    controllers: [CustomerController],
    providers: [CustomerService,JwtAuthGuard],
    exports: [JwtAuthGuard,CustomerService]
})
export class GatewayCustomerModule {}
