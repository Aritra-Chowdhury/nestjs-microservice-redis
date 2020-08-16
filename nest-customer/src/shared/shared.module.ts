import { Module, ValidationPipe } from '@nestjs/common';
import { CustomerExceptionFilter } from './rpc-exception.filter';

@Module({
    providers: [ValidationPipe,CustomerExceptionFilter],
    exports: [ValidationPipe,CustomerExceptionFilter]
})
export class SharedModule {}
