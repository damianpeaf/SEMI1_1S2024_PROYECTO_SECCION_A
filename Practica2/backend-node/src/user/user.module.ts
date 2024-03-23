import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { AlbumModule } from '../album/album.module';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';
import { JwtServiceLocal } from '../jwt/jwt.service';
import { JwtModuleLocal } from '../jwt/jwt.module';
import { PhotoModule } from '../photo/photo.module';
import { RekognitionModule } from 'src/rekognition/rekognition.module';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtServiceLocal],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModuleLocal,
    AlbumModule,
    RekognitionModule,
    PhotoModule,
    FileUploaderModule,
  ],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
