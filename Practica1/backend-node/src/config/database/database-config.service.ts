import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import DatabaseConfig from './database-config';
import { DatabaseConfiguration } from './database-config.enum';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(DatabaseConfig.KEY)
    private databaseConfig: ConfigType<typeof DatabaseConfig>,
  ) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getDatabaseConfig(DatabaseConfiguration.HOST),
      port: this.getDatabaseConfig(DatabaseConfiguration.PORT),
      username: this.getDatabaseConfig(DatabaseConfiguration.USERNAME),
      password: this.getDatabaseConfig(DatabaseConfiguration.PASSWORD),
      database: this.getDatabaseConfig(DatabaseConfiguration.DATABASE),
      synchronize: this.getDatabaseConfig(DatabaseConfiguration.SYNCHRONIZE),
      autoLoadEntities: this.getDatabaseConfig(
        DatabaseConfiguration.AUTOLOAD_ENTITIES,
      ),
    };
  }

  getDatabaseConfig(key: string) {
    return this.databaseConfig[key];
  }
}
