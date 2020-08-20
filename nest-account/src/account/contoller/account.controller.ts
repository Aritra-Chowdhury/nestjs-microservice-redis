import { Controller, Post, Body, Res, Put, Get, Req, Param, Delete, UseGuards, UsePipes, Inject, Logger, UseFilters, HttpStatus } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { AccountDto } from '../dto/account.dto';
import { Response, Request } from 'express';
import { JwtAuthGaurd } from 'src/auth/jwt.gaurd';
import { ValidationPipe } from 'src/shared/valiation.pipe';
import { joiAccountSchema, joiAccountUpdateSchema } from '../schema/account.schema';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MessagePattern } from '@nestjs/microservices';
import { AccountExceptionFilter } from '../../shared/rpc.exception.filter';

@UseFilters(new AccountExceptionFilter())
@Controller('api/v1/account')
export class AccountController {
    constructor(private accountService :AccountService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}

        @MessagePattern({cmd:'createAccount'})
        async createAccount(accountDto: AccountDto):Promise<any>{
            this.logger.debug("In Account controller::createAccount::"+accountDto);
            const account = await this.accountService.createAccount(accountDto);
            return this.getResponse(account,HttpStatus.CREATED);
        }

        @MessagePattern({cmd:'updateAccount'})
        async updateAccount(accountDto: AccountDto):Promise<any>{
            this.logger.debug("In Account controller::updateAccount::"+accountDto);
            const account = await this.accountService.updateAccount(accountDto);
            return this.getResponse(account,HttpStatus.OK);
        }
    
        @MessagePattern({cmd:'getAllAccount'})
        async getAllAccount(accountDto: AccountDto):Promise<any>{
            this.logger.debug("In Account controller::getAllAccount::"+accountDto);
            const accounts = await this.accountService.getAllAccountByCustomerId(accountDto.customerId,accountDto.customer);
            return this.getResponse(accounts,HttpStatus.OK);
        }

        @MessagePattern({cmd:'getAccountById'})
        async getAccountById(accountDto: AccountDto):Promise<any>{
            this.logger.debug("In Account controller::getAccountById::"+accountDto.accountNumber);
            const account = await this.accountService.getAccountById(accountDto.accountNumber,accountDto.customer);
            return this.getResponse(account,HttpStatus.OK);
        }

        @MessagePattern({cmd:'deleteAccountById'})
        async deleteAccountById(accountDto: AccountDto):Promise<any>{
            this.logger.debug("In Account controller::deleteAccountById::"+accountDto);
            const account = await this.accountService.deleteAccountById(accountDto.accountNumber,accountDto.customer);
            return this.getResponse(account,HttpStatus.OK);
        }

        getResponse(data ,statusCode){
            return {data:data,status:statusCode}
          }


    // @UseGuards(JwtAuthGaurd)
    // @UsePipes(new ValidationPipe([joiAccountSchema]))
    // @Post()
    // async createAccount(@Req() req: Request, @Res() res: Response, @Body() accountDto: AccountDto):Promise<any>{
    //     this.logger.debug("In Account controller::getAccountById::"+accountDto);
    //     const account = await this.accountService.createAccount(accountDto,req.header('x-auth-token'));
    //     return res.status(201).send(account);
    // }

    // @UseGuards(JwtAuthGaurd)
    // @UsePipes(new ValidationPipe([joiAccountUpdateSchema]))
    // @Put()
    // async updateAccount(@Res() res: Response, @Body() accountDto: AccountDto):Promise<any>{
    //     const account = await this.accountService.updateAccount(accountDto);
    //     return res.status(200).send(account);
    // }

    // @UseGuards(JwtAuthGaurd)
    // @Get()
    // async getAllAccount(@Req() req: Request, @Res() res: Response):Promise<any>{
    //     const accounts = await this.accountService.getAllAccountByCustomerId(req.body.customerId,req.body.customer);
    //     return res.status(200).send(accounts);
    // }

    // @UseGuards(JwtAuthGaurd)
    // @Get('/:accountId')
    // async getAccountById(@Req() req: Request, @Res() res: Response, @Param('accountId') accountId: String):Promise<any>{
    //     this.logger.debug("In Account controller::getAccountById::"+accountId);
    //     const account = await this.accountService.getAccountById(accountId,req.body.customer);
    //     return res.status(200).send(account);
    // }

    // @UseGuards(JwtAuthGaurd)
    // @Delete('/:accountId')
    // async deleteAccountById(@Req() req: Request, @Res() res: Response, @Param('accountId') accountId: String):Promise<any>{
    //     const account = await this.accountService.deleteAccountById(accountId,req.body.customer);
    //     return res.status(200).send(account);
    // }
}
