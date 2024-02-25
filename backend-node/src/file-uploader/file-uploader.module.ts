import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import S3Config from 'src/config/s3/s3.config';

import { FileUploaderService } from './file-uploader.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      load: [S3Config],
    }),
  ],
  providers: [FileUploaderService],
  exports: [FileUploaderService],
})
export class FileUploaderModule {}
