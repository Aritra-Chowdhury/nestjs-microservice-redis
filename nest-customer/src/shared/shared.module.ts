import { Module, ValidationPipe } from '@nestjs/common';

@Module({
    providers: [ValidationPipe],
    exports: [ValidationPipe]
})
export class SharedModule {}
