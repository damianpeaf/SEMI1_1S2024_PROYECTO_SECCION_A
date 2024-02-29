import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { createHash } from 'crypto';

import { JwtPayload } from './interfaces';

@Injectable()
export class JwtServiceLocal {

    constructor(private jwtService: JwtService) { }

    public getJwtToken(payload: JwtPayload) {
        return this.jwtService.sign(payload);
    }

    public validateToken(token: string) {
        return this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET_KEY
        });
    }
    
    async encrypt(password: string) {
        if (!password) return null;
        return createHash('md5').update(password, 'utf8').digest('hex');
      }
}
