import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigService } from './config/app/app-config.service';
import { AppConfiguration } from './config/app/app-config.enum';
import { AppConfigModule } from './config/app/app-config.module';
import { DatabaseConfigModule } from './config/database/database-config.module';
import { DatabaseConfigService } from './config/database/database-config.service';

import { AlbumModule } from './album/album.module';
import { FileUploaderModule } from './file-uploader/file-uploader.module';
import { UserModule } from './user/user.module';

import { JwtServiceLocal } from './jwt/jwt.service';
import { JwtModuleLocal } from './jwt/jwt.module';
import { PhotoModule } from './photo/photo.module';
import { DefaultController } from './default/default.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useExisting: DatabaseConfigService,
    }),
    AuthModule,
    AppConfigModule,
    AlbumModule,
    FileUploaderModule,
    UserModule,
    JwtModuleLocal,
    PhotoModule,
  ],
  providers: [JwtServiceLocal],
  controllers: [DefaultController],
})
export class AppModule {
  static port: number;

  constructor(private readonly _configService: AppConfigService) {
    AppModule.port = _configService.getAppConfig(AppConfiguration.PORT);
  }
}
