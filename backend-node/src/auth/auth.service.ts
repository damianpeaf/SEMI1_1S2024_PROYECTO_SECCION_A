import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import  { createHash } from 'crypto';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: await this.encrypt(password),
      });

      await this.userRepository.save(user);

      delete user.password;

      return {
        message: 'Usuario creado correctamente',
        status: HttpStatus.OK,
        data: {
          ...user,
          token: this.getJwtToken({ id: user.id }),
        }
      }
      
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, username } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { username },
      })

      if (!user) {
        throw new UnauthorizedException('El usuario no existe');
      }

      const encryptedPassword = await this.encrypt(password);
      if (user.password !== encryptedPassword) {
        throw new UnauthorizedException('La contraseña es incorrecta');
      }

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      }

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async encrypt(password: string) {
    return createHash('md5').update(password, 'utf8').digest('hex');
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
