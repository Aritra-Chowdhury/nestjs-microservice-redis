import { Module, HttpModule } from '@nestjs/common';

import { ValidationPipe } from './valiation.pipe';
import { SharedService } from './services/shared.service';

@Module({
    imports: [HttpModule.register({
        timeout: 5000,
        maxRedirects: 5,
      })],
    providers: [ValidationPipe, SharedService],
    exports: [ValidationPipe , SharedService]  
})
export class SharedModule {}
