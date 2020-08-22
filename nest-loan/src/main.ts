import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport: Transport.REDIS,
    options: {
      url: 'redis://localhost:6379'
    }
  });
  app.listen(() => console.log(`Loan service listening on : http://localhost:${process.env.PORT}`));
}

bootstrap();
