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
import { RekognitionService } from 'src/rekognition/rekognition.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly albumService: AlbumService,
    private readonly photoService: PhotoService,
    private readonly jwtServiceLocal: JwtServiceLocal,
    private readonly fileUploaderService: FileUploaderService,
    private readonly rekognitionService: RekognitionService,
  ) { }

  async create(createUserDto: CreateUserWithPhoto) {
    const { password, ...userData } = createUserDto;

    if (!userData.photo) {
      throw new BadRequestException('Se necesita una imagen de perfil');
    }

    const { Labels } = await this.rekognitionService.getTags(userData.photo);

    if (!Labels) {
      throw new BadRequestException('No se pudo obtener las etiquetas de la imagen');
    }

    // const profileUrl = await this.fileUploaderService.uploadImage(
    //   userData.photo,
    //   ImagesFolders.PROFILE,
    // );
    // if (!profileUrl)
    //   throw new InternalServerErrorException(
    //     'No se pudo subir la imagen de perfil',
    //   );

    const profileUrl = '';

    try {
      const encryptedPassword = await this.jwtServiceLocal.encrypt(password);

      const user = this.userRepository.create({
        ...userData,
        photoUrl: profileUrl,
        password: encryptedPassword,
        faceDescriptor: Labels,
      });

      await this.userRepository.save(user);

      const { data: newAlbum } = await this.albumService.create({
        album_type: EAlbumType.PROFILE,
        name: 'Fotos de perfil',
        user: +user.id,
      });

      const { data: newPhoto } = await this.photoService.create({
        name: 'Foto de perfil' + new Date().toISOString(),
        url: profileUrl,
        description: 'Foto de perfil',
      });

      await this.photoService.createPhotoAlbum(
        +newAlbum.id,
        +newPhoto.id,
      );

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
          name: 'Foto de perfil' + new Date().toISOString(),
          url: profileUrl,
          description: 'Foto de perfil',
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

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
