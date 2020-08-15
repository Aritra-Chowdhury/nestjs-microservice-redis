import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as winston from 'winston';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    winston.info("In AppController::getHello");
    return this.appService.getHello();
  }
}
