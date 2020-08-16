import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    HttpStatus,
    Logger,
    Inject,
  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CustomerService } from '../service/customer.service';

  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(
      private jwtService: JwtService,private customerService: CustomerService,
      @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
      ){
        super();
      }
    
    canActivate(context: ExecutionContext):any{
      // Add your custom authentication logic here
      // for example, call super.logIn(request) to establish a session.
      const request = context.switchToHttp().getRequest();
      return this.validateRequestHeader(request);
    }

    async validateRequestHeader(request:Request) : Promise<boolean>{
      if(!request.header('x-auth-token')) throw new UnauthorizedException(HttpStatus.UNAUTHORIZED,'Auth key not present');
      else{
        try{
            const decodeCode = await this.jwtService.verify(request.header('x-auth-token'))
            if(decodeCode.customerId){
              this.logger.debug("In JwtAuthGaurd:"+decodeCode.customerId);
              const customer = await this.customerService.getCustomerById(decodeCode.customerId);
              this.logger.debug("In JwtAuthGaurd:"+customer);
              if(!customer) throw new UnauthorizedException(HttpStatus.UNAUTHORIZED,'Invalid auth key.Customer not found');

              request.body.customerId = customer.customerId;
              request.body.customer = customer;
              return true;
            }
            else 
            throw new UnauthorizedException(HttpStatus.UNAUTHORIZED,'Invalid auth key.Customer Id missing');
            
        }
        catch(err){
            this.logger.error('Invalid Auth key',err);
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
  