import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

import { JwtServiceLocal } from '../jwt/jwt.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserWithPhoto } from '../user/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtServiceLocal: JwtServiceLocal,
    private readonly userService: UserService,
  ) {}

  async register(createUserDto: CreateUserWithPhoto) {
    return this.userService.create(createUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, username, photo } = loginUserDto;

    if (!password && !photo) {
      throw new UnauthorizedException('Debe ingresar una contraseña o una foto');
    }

    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    const encryptedPassword = await this.jwtServiceLocal.encrypt(password);
    if (user.password !== encryptedPassword) {
      throw new UnauthorizedException('La contraseña es incorrecta');
    }

    delete user.password;
    return {
      message: 'Usuario logueado correctamente',
      status: 200,
      data: {
        userid: user.id,
        name: user.name,
        username: user.username,
        image: user.photoUrl,
        jwt: this.jwtServiceLocal.getJwtToken({ id: user.id }),
      },
    };
  }
}
