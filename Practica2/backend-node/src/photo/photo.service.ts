import { Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Photo } from './entities/photo.entity';
import { CreatePhotoDto, CreatePhotoWithFile } from './dto/create-photo.dto';
import {
  FileUploaderService,
  ImagesFolders,
} from '../file-uploader/file-uploader.service';
import { TranslateService } from 'src/translate/translate.service';
import { PhotoAlbum } from './entities/photo_album.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    @InjectRepository(PhotoAlbum)
    private readonly photoAlbumRepository: Repository<PhotoAlbum>,
    private readonly fileUploaderService: FileUploaderService,
    private readonly translateService: TranslateService,
  ) {}

  async createPhoto(createPhotoDto: CreatePhotoWithFile) {
    const profileUrl = await this.fileUploaderService.uploadImage(
      createPhotoDto.photo,
      ImagesFolders.PUBLISHED,
    );
    if (!profileUrl)
      throw new InternalServerErrorException('No se pudo subir la imagen');

    return await this.create({
      album: createPhotoDto.album,
      name: createPhotoDto.name,
      url: profileUrl,
      description: createPhotoDto.description,
    });
  }

  async create(createPhotoDto: CreatePhotoDto & { url?: string }) {
    try {
      const photo = this.photoRepository.create({
        ...createPhotoDto,
      });
      await this.photoRepository.save(photo);
      return {
        message: 'Foto creada correctamente',
        status: 200,
        data: photo,
      };
    } catch (error) {
      console.log(error);
      throw new Error('No se pudo crear la foto');
    }
  }

  async findByAlbumId(album: number) {
    return await this.photoRepository.find({
    });
  }

  async translatePhotoDescription(id: string, language: string) {
    const photo = await this.photoRepository.findOne({
      where: { id },
    });
    if (!photo) throw new Error('Foto no encontrada');

    const translatedDescription = await this.translateService.translateText(
      photo.description,
      'es',
      language,
    );

    return {
      ...photo,
      description: translatedDescription,
    };
  }
}
