import { Injectable, UnauthorizedException } from '@nestjs/common';
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
        try {
            const decodedToken = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET_KEY
            });
            return decodedToken;
        } catch (error) {
            console.log('Error validating token', error);
            return null;
        }
    }

    async encrypt(password: string) {
        if (!password) return null;
        return createHash('md5').update(password, 'utf8').digest('hex');
    }


    public getUserIdFromToken(token: string): string {

        if (!token) {
            throw new UnauthorizedException('No se ha enviado el token');
        }

        const payload = this.validateToken(token);
        return payload.id;
    }
}
