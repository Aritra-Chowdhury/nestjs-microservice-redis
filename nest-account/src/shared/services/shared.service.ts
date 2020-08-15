import { Injectable, HttpService ,Inject, Logger, } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SharedService {

    customerBaseUrl:string;
    conf:any;
    constructor(private httpService: HttpService, private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){
        const customerPort = this.configService.get<string>('customer.port');
        this.customerBaseUrl = `http://localhost:${customerPort}/api/v1`;
    }

    getCustomerById(customerId:string, token: string): Observable<any>{
        this.setRequestConfig(token);
        return this.httpService.get(`/customer/${customerId}`,this.conf);
    }

    updateCustomer(token: string, data: any): Observable<any>{
        this.setRequestConfig(token);
        return this.httpService.put('/customer',data,this.conf);
    }

    setRequestConfig(token){
        this.conf = {
            baseURL : this.customerBaseUrl,
            headers : {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            },
            timeout: 3000,
            validateStatus: function (status) {
                return status < 500; // Reject only if the status code is greater than or equal to 500
            } 
        };
    }
}
