import { Module } from '@nestjs/common';
import { CustomerController } from './controller/customer.controller';
import { CustomerService } from './services/customer.service';
import { MongooseModule } from '@nestjs/mongoose';

import {customerSchema} from './schema/customerSchema';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Customer', schema: customerSchema }]),
    JwtModule.register({
      secret: 'privatekey',
      signOptions: { expiresIn: '10000s' },
    }),
    AuthModule,
    SharedModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService ,MongooseModule]
})
export class CustomerModule {}
