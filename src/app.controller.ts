import { Controller, Get } from '@nestjs/common';

@Controller('helloworld')
export class AppController {

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
