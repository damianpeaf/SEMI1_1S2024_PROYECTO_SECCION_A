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

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useExisting: DatabaseConfigService,
    }),
    AuthModule,
    FilesModule,
    AppConfigModule,
  ],
  providers: [FilesService],
})
export class AppModule {
  static port: number;

  constructor(private readonly _configService: AppConfigService) {
    AppModule.port = _configService.getAppConfig(AppConfiguration.PORT)
  }

}
