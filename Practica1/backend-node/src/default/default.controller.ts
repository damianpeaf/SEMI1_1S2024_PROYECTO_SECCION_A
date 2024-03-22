import { Controller, Get } from '@nestjs/common';

@Controller()
export class DefaultController {
  @Get('check')
  index() {
    return { status: 200, message: 'API is running' };
  }
}
