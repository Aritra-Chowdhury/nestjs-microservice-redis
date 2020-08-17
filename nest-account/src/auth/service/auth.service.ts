import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { SharedService } from '../../shared/services/shared.service';
import { resolve } from 'dns';
import { rejects } from 'assert';

@Injectable()
export class AuthService {

    constructor(private sharedService: SharedService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}


     async validateCustomer(customerId:string, token:string):Promise<any>{
        return new Promise((resolve, reject)=>{
            this.sharedService.getCustomerById(customerId,token).subscribe(
                (result) =>{
                    if(result.status != 200){
                        this.logger.error("Customer not found in account update with status:"+result.status+" error message:"+JSON.stringify(result.data));
                        throw new BadRequestException(result.data);
                    }
                    this.logger.debug("In AuthService::validateCustomer::"+JSON.stringify(result.data));
                    resolve(result.data);
                },
                (error) => {
                    this.logger.error(error);
                    reject("Error while calling customer service");
                }
            );
        })
    }

}
