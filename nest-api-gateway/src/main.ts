import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule, } from '@nestjs/swagger';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService: ConfigService = app.get(ConfigService);

  app.listen(configService.get<string>('port'),()=>{
    console.log(`Api gateway listening on : https:localhost:${configService.get<string>('port')}`);
  });

  const options = new DocumentBuilder()
                    .setTitle("Banking API")
                    .setDescription( "A banking-management-application ,used for creating and maintain customer account. It also allows the customer to apply for a loan.")
                    .setVersion("1.0.0")
                    .build();

  const document = SwaggerModule.createDocument(app,options);
  const swaggerDocument= fs.readFileSync(path.resolve(__dirname, '../../swagger-files/swagger.json')).toString();

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(swaggerDocument)));

  process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    console.log('unhandledRejection', error);
  });

}
bootstrap();
