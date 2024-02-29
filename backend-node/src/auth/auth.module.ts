import { Module } from '@nestjs/common';

import { AlbumModule } from '../album/album.module';
import { UserModule } from '../user/user.module';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';
import { JwtModuleLocal } from '../jwt/jwt.module';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtServiceLocal } from '../jwt/jwt.service';

import { AuthController } from './auth.controller';
import { PhotoModule } from 'src/photo/photo.module';


@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtServiceLocal],
  imports: [
    AlbumModule,
    FileUploaderModule,
    UserModule,
    PhotoModule,
    JwtModuleLocal,
  ],
})
export class AuthModule { }
