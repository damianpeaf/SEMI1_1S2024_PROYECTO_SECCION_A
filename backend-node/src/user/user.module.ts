import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { AlbumModule } from '../album/album.module';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';
import { JwtServiceLocal } from 'src/jwt/jwt.service';
import { JwtModuleLocal } from 'src/jwt/jwt.module';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtServiceLocal],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModuleLocal,
    AlbumModule,
    FileUploaderModule,
  ],
  exports: [UserService, TypeOrmModule, JwtServiceLocal],
})
export class UserModule {}
