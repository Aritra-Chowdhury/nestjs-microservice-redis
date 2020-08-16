import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt  from 'bcrypt';

import { Customer } from 'src/customer/schema/customerSchema';
import { CustomerRegisterDto } from '../dto/customer.register.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,
        @InjectModel("Customer") private readonly customerModel: Model<Customer>){}

    async validateCustomer(customer: CustomerRegisterDto) :Promise<Customer>{
        let customerRes:any;
        if(customer.customerId){
            customerRes = await this.customerModel.findById({_id:customer.customerId});
        }else if( customer.email){
            customerRes = await this.customerModel.findOne({email:customer.email});
        }
        if(!customerRes)
            throw new RpcException({message:'Invalid email or customer id',status:HttpStatus.BAD_REQUEST});
        else{
            const result = await bcrypt.compare(customer.password , customerRes.password);
            if(!result) 
            throw new RpcException({message:'Invalid email or customer id',status:HttpStatus.UNAUTHORIZED});
            
            return customerRes.transform();
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async getToken(customer: any) {
        const payload = {customerId : customer.customerId, name : customer.name};
        return {
            'x-auth-token' : this.jwtService.sign(payload),
        };
    }

    async register(customerRegisterDto : CustomerRegisterDto):Promise<any>{
        if( customerRegisterDto.email){
           const existingCustomer = await this.customerModel.findOne({email:customerRegisterDto.email});
           if(existingCustomer) throw new RpcException({message:`Customer with email:${existingCustomer.email} already exists!`,status:HttpStatus.BAD_REQUEST});
        }
        const salt = await bcrypt.genSalt(10);
        customerRegisterDto.password = await bcrypt.hash(customerRegisterDto.password,salt);

        const customer = await this.customerModel(customerRegisterDto);
        const customerRes = await customer.save();
        return customerRes.transform();
    }
}
