import { Module } from '@nestjs/common';
import { RekognitionService } from './rekognition.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RekognitionService],
  exports: [RekognitionService],
})
export class RekognitionModule {}
