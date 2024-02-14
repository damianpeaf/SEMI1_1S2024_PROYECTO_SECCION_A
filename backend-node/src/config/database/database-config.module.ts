import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DatabaseConfig from './database-config';
import { DatabaseConfigService } from './database-config.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            expandVariables: true,
            load: [DatabaseConfig],
        }),
    ],
    providers: [DatabaseConfigService],
    exports: [DatabaseConfigService],
})
export class DatabaseConfigModule { }