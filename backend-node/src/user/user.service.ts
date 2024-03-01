import { Repository } from 'typeorm';

import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { EAlbumType } from '../album/entities/album-type.entity';

import { AlbumService } from '../album/album.service';
import {
  FileUploaderService,
  ImagesFolders,
} from '../file-uploader/file-uploader.service';
import { JwtServiceLocal } from '../jwt/jwt.service';
import { CreateUserWithPhoto, UpdateUserWithPhoto } from './interfaces';
import { PhotoService } from '../photo/photo.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly albumService: AlbumService,
    private readonly photoService: PhotoService,
    private readonly jwtServiceLocal: JwtServiceLocal,
    private readonly fileUploaderService: FileUploaderService,
  ) {}

  async create(createUserDto: CreateUserWithPhoto) {
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

      const { data: newAlbum } = await this.albumService.create({
        album_type: EAlbumType.PROFILE,
        name: 'Fotos de perfil',
        user: +user.id,
      });

      this.photoService.create({
        album: newAlbum.id,
        name: 'Foto de perfil' + new Date().toISOString(),
        url: profileUrl,
      });

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
    const userId = this.jwtServiceLocal.getUserIdFromToken(token);

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
        photoUrl: undefined,
        imageUrl: user.photoUrl,
        token,
      },
    };
  }

  async update(updateUserDto: UpdateUserWithPhoto, token: string) {
    const userId = this.jwtServiceLocal.getUserIdFromToken(token);

    const { password, ...userData } = updateUserDto;

    const encryptedPassword = password
      ? await this.jwtServiceLocal.encrypt(password)
      : null;

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

    try {
      await this.userRepository.update(
        { id: userId },
        {
          name: userData.name || user.name,
          username: userData.username || user.username,
          photoUrl: profileUrl || user.photoUrl,
          password: encryptedPassword || user.password,
        },
      );

      if (profileUrl) {
        const profileAlbum = await this.albumService.getProfileAlbum(+userId);
        await this.photoService.create({
          album: profileAlbum.id,
          name: 'Foto de perfil' + new Date().toISOString(),
          url: profileUrl,
        });
      }

      const updatedUser = await this.userRepository.findOne({
        where: { id: userId },
      });

      delete updatedUser.password;

      return {
        message: 'Usuario actualizado correctamente',
        status: HttpStatus.OK,
        data: {
          ...updatedUser,
          token,
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
