import { Module } from '@nestjs/common';
import { RekognitionService } from './rekognition.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [RekognitionService],
  exports: [RekognitionService],
})
export class RekognitionModule {}
