import { Module } from '@nestjs/common';
import { LoanController } from './controller/loan.controller';
import { LoanService } from './service/loan.service';
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
        name: "Loan_service",
        transport: Transport.REDIS,
        options: {
          url: 'redis://localhost:6379',
          connect_timeout :5000
        },
      }
    ])
  ],
  controllers: [LoanController],
  providers: [LoanService]
})
export class GatewayLoanModule {}
