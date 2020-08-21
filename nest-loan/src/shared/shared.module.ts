import { Module } from '@nestjs/common';
import { LoanExceptionFilter } from './rpc.exception.filter';

@Module({
    providers: [LoanExceptionFilter],
    exports: [LoanExceptionFilter]
})
export class SharedModule {}
