import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService: ConfigService = app.get(ConfigService);

  app.listen(configService.get<string>('port'),()=>{
    console.log(`Api gateway listening on : https:localhost:${configService.get<string>('port')}`);
  });

  process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    console.log('unhandledRejection', error);
  });

}
bootstrap();
