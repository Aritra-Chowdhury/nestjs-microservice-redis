import { Module } from '@nestjs/common';
import { LoanController } from './controller/loan.controller';
import { LoanService } from './service/loan.service';
import { SharedModule } from 'src/shared/shared.module';
import { OfferModule } from 'src/offer/offer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { loanSchema } from './schema/loan.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    SharedModule,
    OfferModule,
    MongooseModule.forFeature([{ name: 'Loan', schema: loanSchema}]),
    ClientsModule.register([
      {
          name: "Account_service",
          transport: Transport.REDIS,
          options: {
            url: 'redis://localhost:6379'
          }
      }
    ])
  ],
  controllers: [LoanController],
  providers: [LoanService]
})
export class LoanModule {}
