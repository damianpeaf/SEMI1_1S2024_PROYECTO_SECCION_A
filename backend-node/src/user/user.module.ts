import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { AlbumModule } from '../album/album.module';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';
import { JwtServiceLocal } from 'src/jwt/jwt.service';
import { JwtModuleLocal } from 'src/jwt/jwt.module';
import { AlbumPhotoService } from 'src/album/album-photo/album-photo.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtServiceLocal, AlbumPhotoService],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModuleLocal,
    AlbumModule,
    FileUploaderModule,
  ],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
