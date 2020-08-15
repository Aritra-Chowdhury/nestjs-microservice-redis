import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from 'src/shared/shared.module';
import { JwtAuthGaurd } from './jwt.gaurd';
import { AuthService } from './service/auth.service';

@Module({
    imports: [
        JwtModule.register({
            secret:"privatekey",
            signOptions: { expiresIn: '10000s' },
         }),
        SharedModule
    ],
    providers: [JwtAuthGaurd, AuthService],
    exports: [JwtAuthGaurd,AuthService]
})
export class AuthModule {}
