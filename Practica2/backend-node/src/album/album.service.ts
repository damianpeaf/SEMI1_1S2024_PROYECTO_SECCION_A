import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { JwtServiceLocal } from '../jwt/jwt.service';
import { PhotoService } from '../photo/photo.service';
import { RekognitionService } from '..//rekognition/rekognition.service';
import { CreatePhotoDto } from 'src/photo/dto/create-photo.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    private readonly photoService: PhotoService,
    private readonly jwtService: JwtServiceLocal,
    private readonly rekognitionService: RekognitionService,
  ) {}

  async createAlbum(
    createAlbumDto: {
      name: string;
      album_type: number;
    },
    token: string,
  ) {
    const userId = this.jwtService.getUserIdFromToken(token);
    return await this.create({
      ...createAlbumDto,
      user: +userId,
    });
  }

  async create(createAlbumDto: CreateAlbumDto) {
    try {
      const album = this.albumRepository.create({
        ...createAlbumDto,
      });
      await this.albumRepository.save(album);
      return {
        message: 'Album creado correctamente',
        status: HttpStatus.OK,
        data: album,
      };
    } catch (error) {
      console.log(error);
      throw new Error('No se pudo crear el album');
    }
  }

  async findAll(token: string) {
    const userId = this.jwtService.getUserIdFromToken(token);

    const albumsByUser = await this.albumRepository.find({
      where: { user: +userId, deleted_at: null },
    });

    const response = [];

    for (let i = 0; i < albumsByUser.length; i++) {
      const photos = await this.photoService.findByAlbumId(+albumsByUser[i].id);
      response.push({
        ...albumsByUser[i],
        images: photos,
      });
    }

    return {
      message: 'Albums encontrados correctamente',
      status: HttpStatus.OK,
      data: {
        albums: response,
      },
    };
  }

  async findOne(id: string) {
    return await this.albumRepository.findOne({
      where: { id, deleted_at: null },
    });
  }

  async getProfileAlbum(userId: number) {
    return await this.albumRepository.findOne({
      where: { user: userId, album_type: 1, deleted_at: null },
    });
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto, token: string) {
    try {
      await this.albumRepository.update(id, updateAlbumDto);

      const userId = this.jwtService.getUserIdFromToken(token);

      const albumUpdated = await this.albumRepository.findOne({
        where: { user: +userId, deleted_at: null, id: `${id}` },
      });

      return {
        message: 'Album actualizado correctamente',
        status: HttpStatus.OK,
        data: albumUpdated,
      };
    } catch (error) {
      throw new Error('No se pudo actualizar el album');
    }
  }

  remove(id: string, token: string) {
    try {
      const userId = this.jwtService.getUserIdFromToken(token);
      this.albumRepository.softDelete({ id, user: +userId });
      return {
        message: 'Album eliminado correctamente',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new Error('No se pudo eliminar el album');
    }
  }

  async extractTextFromImage(photo: Express.Multer.File) {
    return await this.rekognitionService.extractText(photo);
  }

  async translatePhotoDescription(id: string, language: string, token: string) {
    const response = await this.photoService.translatePhotoDescription(id, language);
    return {
      message: 'Descripción traducida correctamente',
      status: HttpStatus.OK,
      data: response,
    };
  }

  async createPhoto(createPhotoDto: CreatePhotoDto & { photo: Express.Multer.File }, token: string) {
      /*
      1. Create photo
      2. Extract TAGS from photo
      3. Create/Find album with TAGS
      4. Add photo to album with photo_album
      */

      const photo = await this.photoService.create(createPhotoDto);

      const { Labels } = await this.rekognitionService.getTags(createPhotoDto.photo)

      console.log(Labels, 'Labels');

      const tags = Labels.slice(0, 5).map((label) => label.name);

      console.log(tags, 'tags');

      for (let i = 0; i < tags.length; i++) {
        const album = await this.albumRepository.findOne({
          where: { name: tags[i] },
        });

        if (!album) {
          await this.createAlbum({
            name: tags[i],
            album_type: 2,
          }, token);
        } 

        const photoAlbum = await this.photoService.createPhotoAlbum(+photo.data.id, +album.id);

        console.log(photoAlbum, 'photoAlbum');
      }
      

      return {
        message: 'Foto creada correctamente',
        status: HttpStatus.OK,
        data: photo,
      }
  }

}
