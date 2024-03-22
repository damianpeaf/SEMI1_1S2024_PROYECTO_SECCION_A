import { Module } from '@nestjs/common';
import { TranslateService } from './translate.service';

@Module({
  controllers: [],
  providers: [TranslateService],
  exports: [TranslateService],
})
export class TranslateModule {}
