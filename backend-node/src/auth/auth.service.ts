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
import { createHash } from 'crypto';
import { AlbumService } from '../album/album.service';
import {
  FileUploaderService,
  ImagesFolders,
} from 'src/file-uploader/file-uploader.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly albumService: AlbumService,
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
      const encryptedPassword = await this.encrypt(password);

      // 'INSERT INTO "user"("id", "username", "name", "password", "photo_url") VALUES (DEFAULT, DEFAULT, $1, $2, $3) RETURNING "id"',
      const user = this.userRepository.create({
        ...userData,
        photoUrl: profileUrl,
        password: encryptedPassword,
      });

      await this.userRepository.save(user);

      // This was comment out because it was not working
      // it says: EntityMetadataNotFoundError: No metadata for "Album" was found.
      // await this.albumService.create({
      //   album_type: EAlbumType.PROFILE,
      //   name: 'Fotos de perfil',
      //   user: +user.id,
      // });

      // TODO: photo registration
      delete user.password;

      return {
        message: 'Usuario creado correctamente',
        status: HttpStatus.OK,
        data: {
          ...user,
          token: this.getJwtToken({ id: user.id }),
        },
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, username } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    const encryptedPassword = await this.encrypt(password);
    if (user.password !== encryptedPassword) {
      throw new UnauthorizedException('La contraseña es incorrecta');
    }

    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
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
