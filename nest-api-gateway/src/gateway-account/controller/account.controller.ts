import { Controller, Logger, Inject, UsePipes, Post, Res, Body, NotFoundException, HttpStatus, Get, UseGuards, Param, Put, Delete, Req } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Response, Request } from 'express';

import { ValidationPipe } from '../../shared/validation.pipe';
import { AccountService } from '../service/account.service';
import { JwtAuthGuard } from '../../gateway-customer/authgaurd/jwt.gaurd';
import { joiAccountSchema, joiAccountUpdateSchema } from '../schema/account.schema';
import { AccountDto } from '../dto/account.dto';

@Controller('api/v1/account')
export class AccountController {
    constructor(private accountService :AccountService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger){}

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe([joiAccountSchema]))
    @Post()
    async createAccount( @Res() res: any, @Body() accountDto: AccountDto):Promise<any>{
        this.logger.debug("In Account controller::client::getAccountById::"+accountDto);
        const account = await this.accountService.createAccount(accountDto);
        return res.status(201).send(account);
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe([joiAccountUpdateSchema]))
    @Put()
    async updateAccount(@Res() res: any, @Body() accountDto: AccountDto):Promise<any>{
        const account = await this.accountService.updateAccount(accountDto);
        return res.status(200).send(account);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllAccount(@Req() req: any, @Res() res: any):Promise<any>{
        const accounts = await this.accountService.getAllAccountByCustomerId(req.body.customerId,req.body.customer);
        return res.status(200).send(accounts);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:accountId')
    async getAccountById(@Req() req: any, @Res() res: any, @Param('accountId') accountId: String):Promise<any>{
        this.logger.debug("In Account controller::getAccountById::"+accountId);
        const account = await this.accountService.getAccountById(accountId,req.body.customer);
        return res.status(200).send(account);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:accountId')
    async deleteAccountById(@Req() req: any, @Res() res: any, @Param('accountId') accountId: String):Promise<any>{
        const account = await this.accountService.deleteAccountById(accountId,req.body.customer);
        return res.status(200).send(account);
    }
}
