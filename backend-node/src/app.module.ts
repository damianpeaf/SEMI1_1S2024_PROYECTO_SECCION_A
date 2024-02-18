import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilesService } from './files/files.service';
import { FilesModule } from './files/files.module';

import { AppConfigService } from './config/app/app-config.service';
import { AppConfiguration } from './config/app/app-config.enum';
import { AppConfigModule } from './config/app/app-config.module';
import { DatabaseConfigModule } from './config/database/database-config.module';
import { DatabaseConfigService } from './config/database/database-config.service';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useExisting: DatabaseConfigService,
    }),
    AuthModule,
    FilesModule,
    CommonModule,
  ],
  providers: [FilesService],
})
export class AppModule {
  static port: number;

  constructor(private readonly _configService: AppConfigService) {
    AppModule.port = _configService.getAppConfig(AppConfiguration.PORT)
  }

}
