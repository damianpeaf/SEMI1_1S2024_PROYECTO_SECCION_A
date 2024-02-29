import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import jwtConfig from '../config/jwt/jwt-config';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [jwtConfig],
        }),

        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              return {
                secret: configService.get('jwt.secret'),
                signOptions: {
                  expiresIn: configService.get('jwt.expiresIn'),
                },
              };
            },
          }),

        PassportModule.register({ defaultStrategy: 'jwt' }),
    ], 
    exports: [JwtModule, PassportModule],
})
export class JwtModuleLocal { }
