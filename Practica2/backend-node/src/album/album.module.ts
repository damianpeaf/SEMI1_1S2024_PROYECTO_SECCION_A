import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumType } from './entities/album-type.entity';
import { Album } from './entities/album.entity';
import { JwtServiceLocal } from '../jwt/jwt.service';
import { JwtModuleLocal } from '../jwt/jwt.module';
import { PhotoModule } from '../photo/photo.module';
import { PhotoService } from '../photo/photo.service';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album, AlbumType]),
    JwtModuleLocal,
    PhotoModule,
    FileUploaderModule,
  ],
  controllers: [AlbumController],
  providers: [AlbumService, JwtServiceLocal, PhotoService],
  exports: [AlbumService, TypeOrmModule]
})
export class AlbumModule {}
