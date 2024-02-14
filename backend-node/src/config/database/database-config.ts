import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export default registerAs('database', (): TypeOrmModuleOptions => ({
    host: process.env.DB_HOSTNAME,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    autoLoadEntities: process.env.AUTOLOAD_ENTITIES === 'true' ? true : false,
    synchronize: process.env.SYNCHRONIZE === 'true' ? true : false,
    encrypt: true,
  }));