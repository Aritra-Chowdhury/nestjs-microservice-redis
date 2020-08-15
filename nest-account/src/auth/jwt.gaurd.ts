import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext, UnauthorizedException, HttpStatus, Inject, Logger, BadRequestException} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './service/auth.service';

@Injectable()
export class JwtAuthGaurd extends AuthGuard('jwt'){

    constructor(private jwtService: JwtService , private authService: AuthService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){
        super();
    }

    canActivate(context: ExecutionContext):any{
        const request = context.switchToHttp().getRequest();
        return this.validateRequestHeader(request);
    }

    async validateRequestHeader(request:Request) : Promise<boolean>{
        if(!request.header('x-auth-token')) throw new UnauthorizedException(HttpStatus.UNAUTHORIZED,'Auth key not present');
        else{
          try{
              const decodeCode = await this.jwtService.verify(request.header('x-auth-token'))
              if(decodeCode.customerId){
                  this.logger.debug("In JwtAuthGaurd:"+decodeCode.customerId+":token:"+request.header('x-auth-token'));
                  const customer = await this.authService.validateCustomer(decodeCode.customerId,request.header('x-auth-token'));

                  if(!customer) throw new UnauthorizedException(HttpStatus.UNAUTHORIZED,'Invalid auth key.Customer not found');

                  request.body.customerId = customer.customerId;
                  request.body.customer = customer;
                  return true;
              }
              else 
              throw new UnauthorizedException(HttpStatus.UNAUTHORIZED,'Invalid auth key.Customer Id missing');
              
          }
          catch(err){
              console.error('Invalid Auth key',err);
              throw new UnauthorizedException(HttpStatus.UNAUTHORIZED,'Invalid auth Token'); 
          }
        }
        return false;
      }
    
      // handleRequest(err, user, info) :any{
      //   // You can throw an exception based on either "info" or "err" arguments
      //   if (err || !user) {
      //     throw err || new UnauthorizedException();
      //   }
      //   return user;
      // }
}