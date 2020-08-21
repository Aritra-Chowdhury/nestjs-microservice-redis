import { Controller, Inject, Logger, HttpStatus } from '@nestjs/common';
import { LoanService } from '../service/loan.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MessagePattern } from '@nestjs/microservices';
import { LoanDto } from '../dto/loan.dto';

@Controller('loan')
export class LoanController {
    constructor(private loanService : LoanService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}
        
    @MessagePattern({cmd:'createLoan'})
    async createLoan(loanDto : LoanDto):Promise<any>{
        this.logger.debug("In Loan Controller ::createLoan::" + loanDto);
        const offer = await this.loanService.createLoan(loanDto);
        return this.getResponse(offer,HttpStatus.CREATED);
    }

    @MessagePattern({cmd:'updateLoan'})
    async updateLoan(loanDto : LoanDto):Promise<any>{
        this.logger.debug("In Loan Controller ::updateLoan::" + loanDto);
        const offer = await this.loanService.updateLoan(loanDto);
        return this.getResponse(offer,HttpStatus.OK);
    }


    @MessagePattern({cmd:'validateLoan'})
    async validateLoan(loanDto : LoanDto):Promise<any>{
        this.logger.debug("In Loan Controller ::validateLoan::" + loanDto);
        const offer = await this.loanService.validateLoan(loanDto);
        return this.getResponse(offer,HttpStatus.OK);
    }

    @MessagePattern({cmd:'getLoanById'})
    async getLoanById(loanDto : LoanDto):Promise<any>{
        this.logger.debug("In Loan Controller ::getLoanById::" + loanDto);
        const offer = await this.loanService.getLoanById(loanDto);
        return this.getResponse(offer,HttpStatus.OK);
    }

     // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
     getResponse(data:any ,statusCode:HttpStatus):any{
        return {data:data,status:statusCode};
    }
}
