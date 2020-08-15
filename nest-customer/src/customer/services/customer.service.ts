import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import {Customer} from '../schema/customerSchema';
import { CustomerDto } from '../dto/customer.dto';

@Injectable()
export class CustomerService {

    constructor(@InjectModel("Customer") private readonly customerModel: Model<Customer>){}

    async getAllCustomer(): Promise<Customer[]>{
        const customers = await this.customerModel.find();
        return customers;
    }

    async getCustomerById(customerId:string): Promise<Customer>{
        const customer = await this.customerModel.findById(customerId);
        return customer.transform();
    }

    async updateExistingCustomer(customerDto : CustomerDto):Promise<Customer>{
        
        const newcustomerObj = await this.customerModel.findByIdAndUpdate(customerDto.customerId,
          {$set : {
            "userDetails": customerDto.userDetails,
            "mailingaddress": customerDto.mailingaddress
          }},{new : true});
      
        return newcustomerObj.transform();
    }
}
