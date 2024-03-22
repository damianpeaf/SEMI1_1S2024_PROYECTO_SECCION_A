import { Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Photo } from './entities/photo.entity';
import { CreatePhotoDto, CreatePhotoWithFile } from './dto/create-photo.dto';
import {
  FileUploaderService,
  ImagesFolders,
} from '../file-uploader/file-uploader.service';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly fileUploaderService: FileUploaderService,
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
    });
  }

  async create(createPhotoDto: CreatePhotoDto & { url?: string }) {
    try {
      const photo = this.photoRepository.create({
        ...createPhotoDto,
        album: +createPhotoDto.album,
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
      where: { album },
    });
  }
}
