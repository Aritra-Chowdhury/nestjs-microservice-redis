import { Controller, Logger, UseGuards, UsePipes, Post, Inject, Res, Body, Put, Get, Param, Req } from '@nestjs/common';
import { LoanService } from '../service/loan.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from '../../gateway-customer/authgaurd/jwt.gaurd';
import { ValidationPipe } from '../../shared/validation.pipe';
import { joiLoanCreateSchema , joiLoanUpdateSchema ,joiLoanValidateSchema } from '../schema/loan.schema';
import { LoanDto } from '../dto/loan.dto';

@Controller('api/v1/loan')
export class LoanController {
    constructor(private loanService : LoanService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}
        
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe([joiLoanCreateSchema]))
    @Post()
    async createLoan(@Res() res: any, @Body()loanDto : LoanDto):Promise<any>{
        this.logger.debug("In Loan Controller ::createLoan::" + loanDto);
        const loan = await this.loanService.createLoan(loanDto);
        return res.status(201).send(loan);
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe([joiLoanUpdateSchema]))
    @Put()
    async updateLoan(@Res() res: any, @Body()loanDto : LoanDto):Promise<any>{
        this.logger.debug("In Loan Controller ::updateLoan::" + loanDto);
        const loan = await this.loanService.updateLoan(loanDto);
        return res.status(200).send(loan);
    }


    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe([joiLoanValidateSchema]))
    @Put('/status')
    async validateLoan(@Res() res: any, @Body()loanDto : LoanDto):Promise<any>{
        this.logger.debug("In Loan Controller ::validateLoan::" + loanDto);
        const loan = await this.loanService.validateLoan(loanDto);
        return res.status(200).send(loan);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:loanNumber')
    async getLoanById(@Res() res: any, @Param('loanNumber') loanNumber: string):Promise<any>{
        this.logger.debug("In Loan Controller ::getLoanById::" + loanNumber);
        const loan = await this.loanService.getLoanById(loanNumber);
        return res.status(200).send(loan);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllLoanByCutomerId(@Req() req: any, @Res() res: any):Promise<any>{
        this.logger.debug("In Loan Controller ::getAllLoanByCutomerId::");
        const loan = await this.loanService.getAllLoanByCutomerId(req.body.customerId);
        return res.status(200).send(loan);
    }
}
