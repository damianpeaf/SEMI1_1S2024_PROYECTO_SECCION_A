import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FilesService } from './files/files.service';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';

import { envConfiguration } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfiguration],
    }),
    AuthModule,
    FilesModule,
  ],
  providers: [FilesService],
})
export class AppModule { }
