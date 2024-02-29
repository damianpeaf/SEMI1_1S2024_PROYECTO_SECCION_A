import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { JwtModuleLocal } from '../jwt/jwt.module';
import { FileUploaderModule } from 'src/file-uploader/file-uploader.module';
import { JwtServiceLocal } from 'src/jwt/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    JwtModuleLocal,
    FileUploaderModule,
  ],
  controllers: [PhotoController],
  providers: [PhotoService, JwtServiceLocal],
  exports: [PhotoService, TypeOrmModule]
})
export class PhotoModule {}
