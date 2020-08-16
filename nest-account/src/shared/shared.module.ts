import { Module, HttpModule } from '@nestjs/common';

import { ValidationPipe } from './valiation.pipe';
import { SharedService } from './services/shared.service';
import { AccountExceptionFilter } from './rpc.exception.filter';

@Module({
    imports: [HttpModule.register({
        timeout: 5000,
        maxRedirects: 5,
      })],
    providers: [ValidationPipe, SharedService, AccountExceptionFilter],
    exports: [ValidationPipe , SharedService, AccountExceptionFilter]  
})
export class SharedModule {}
