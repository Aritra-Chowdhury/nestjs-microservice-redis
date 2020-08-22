import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    HttpStatus,
    Logger,
    Inject,
  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CustomerService } from '../service/customer.service';
import { Reflector } from '@nestjs/core';

  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(private reflector: Reflector,
      private jwtService: JwtService,private customerService: CustomerService,
      @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
      ){
        super();
      }
    
    async canActivate(context: ExecutionContext): Promise<boolean>{
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      const request = context.switchToHttp().getRequest();
      
      if(roles){
        const valid = await this.validateRequestHeader(request);
        if(valid)
        return this.matchRoles(roles,request.body.userRoles);
      }
      return this.validateRequestHeader(request);
    }

    async validateRequestHeader(request) : Promise<boolean>{
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
              if(customer.name == 'Admin') request.body.userRoles = 'admin';

              return true;
            }
            else 
            throw new UnauthorizedException(HttpStatus.UNAUTHORIZED,'Invalid auth key.Customer Id missing');
            
        }
        catch(err){
            this.logger.error('Invalid Auth key',err);
            if(err.response)throw new UnauthorizedException(HttpStatus.UNAUTHORIZED,err.response.error); 
            throw new UnauthorizedException(HttpStatus.UNAUTHORIZED,err.message); 
        }
      }
    }

    matchRoles(roles:any, userRoles:string):boolean{

      if(roles.includes(userRoles))
      return true;
      else
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED,'User not authorized. Please try with an admin user'); 
    }
  
    // handleRequest(err, user, info) :any{
    //   // You can throw an exception based on either "info" or "err" arguments
    //   if (err || !user) {
    //     throw err || new UnauthorizedException();
    //   }
    //   return user;
    // }
  }
  