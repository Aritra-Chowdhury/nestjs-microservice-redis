import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    HttpStatus,
  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(private jwtService: JwtService){
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
                request.body.customerId = decodeCode.customerId;
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
  