import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumPhoto } from './entities/album-photo.entity';
import { AlbumType } from './entities/album-type.entity';
import { Album } from './entities/album.entity';
import { AlbumPhotoService } from './album-photo/album-photo.service';
import { JwtServiceLocal } from 'src/jwt/jwt.service';
import { JwtModuleLocal } from 'src/jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album, AlbumType, AlbumPhoto]),
    JwtModuleLocal,
  ],
  controllers: [AlbumController],
  providers: [AlbumService, AlbumPhotoService, JwtServiceLocal],
  exports: [AlbumService, TypeOrmModule, AlbumPhotoService]
})
export class AlbumModule {}
