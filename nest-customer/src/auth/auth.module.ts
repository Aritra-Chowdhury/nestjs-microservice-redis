import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './contoller/auth.controller';
import { AuthService } from './service/auth.service';
import { CustomerModule } from '../customer/customer.module';
import { JwtAuthGuard } from './jwt.gaurd';
import { SharedModule } from 'src/shared/shared.module';


@Module({
  imports:[forwardRef(() => CustomerModule),
    JwtModule.register({
      secret:"privatekey",
      signOptions: { expiresIn: '10000s' },
    }),
    MongooseModule,
    SharedModule
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtAuthGuard],
  exports: [JwtAuthGuard]
})
export class AuthModule {}
