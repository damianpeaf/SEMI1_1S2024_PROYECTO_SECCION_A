import { Repository } from 'typeorm';

import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';
import { EAlbumType } from '../album/entities/album-type.entity';

import { AlbumService } from '../album/album.service';
import { FileUploaderService, ImagesFolders } from '../file-uploader/file-uploader.service';
import { JwtServiceLocal } from '../jwt/jwt.service';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly albumService: AlbumService,
    private readonly jwtServiceLocal: JwtServiceLocal,
    private readonly fileUploaderService: FileUploaderService,
  ) {}


  async create(createUserDto: CreateUserDto & { photo: Express.Multer.File }) {
    const { password, ...userData } = createUserDto;
    const profileUrl = await this.fileUploaderService.uploadImage(
      userData.photo,
      ImagesFolders.PROFILE,
    );
    if (!profileUrl)
      throw new InternalServerErrorException(
        'No se pudo subir la imagen de perfil',
      );

    try {
      const encryptedPassword = await this.jwtServiceLocal.encrypt(password);

      const user = this.userRepository.create({
        ...userData,
        photoUrl: profileUrl,
        password: encryptedPassword,
      });

      await this.userRepository.save(user);

      await this.albumService.create({
        album_type: EAlbumType.PROFILE,
        name: 'Fotos de perfil',
        user: +user.id,
      });

      // TODO: photo registration
      delete user.password;

      return {
        message: 'Usuario creado correctamente',
        status: HttpStatus.OK,
        data: {
          ...user,
          token: this.jwtServiceLocal.getJwtToken({ id: user.id }),
        },
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findOne(token: string) {
    const payload = this.jwtServiceLocal.validateToken(token);
    const userId = payload.id;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    delete user.password;

    return {
      message: 'Usuario encontrado',
      status: HttpStatus.OK,
      data: {
        ...user,
      },
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  async update(updateUserDto: UpdateUserDto, token: string) {
    // get id with token jwt
    const payload = this.jwtServiceLocal.validateToken(token);
    const userId = payload.id;

    const { password, ...userData } = updateUserDto;

    const encryptedPassword = password ? await this.jwtServiceLocal.encrypt(password) : null;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    const profileUrl = await this.fileUploaderService.uploadImage(
      userData.photo,
      ImagesFolders.PROFILE,
    );


    // update user

    try {
      await this.userRepository.update(
        { id: userId },
        {
          ...userData,
          photoUrl: profileUrl || user.photoUrl,
          password: encryptedPassword || user.password,
        },
      );

      const updatedUser = await this.userRepository.findOne({
        where: { id: userId },
      });

      delete updatedUser.password;

      return {
        message: 'Usuario actualizado correctamente',
        status: HttpStatus.OK,
        data: {
          ...updatedUser,
          token: this.jwtServiceLocal.getJwtToken({ id: updatedUser.id }),
        },
      };
    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
