import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
   //Http application
  // const app = await NestFactory.create(AppModule, { cors: true });
  // const configService: ConfigService = app.get(ConfigService);

  // app.listen(configService.get<string>('port'),()=>{
  //   console.log(`Account service listening on : https:localhost:${configService.get<string>('port')}`);
  // });

  //microservice tcp application
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
  //   transport: Transport.TCP,
  //   options: {
  //     host: '127.0.0.1',
  //     port: parseInt(process.env.PORT, 10)
  //   }
  // });
  // app.listen(() => console.log(`Account service listening on : http://localhost:${process.env.PORT}`));

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport: Transport.REDIS,
    options: {
      url: 'redis://localhost:6379'
    }
  });
  app.listen(() => console.log(`Account service listening on : http://localhost:${process.env.PORT}`));
}
bootstrap();
