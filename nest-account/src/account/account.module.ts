import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AccountController } from './contoller/account.controller';
import { AccountService } from './services/account.service';
import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from 'src/auth/auth.module';
import { accountSchema } from './schema/account.schema';


@Module({
  imports: [
    SharedModule,
    AuthModule,
    MongooseModule.forFeature([{ name: 'Account', schema: accountSchema}]),
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
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}
