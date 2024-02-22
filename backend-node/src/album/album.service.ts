import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {

  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) { }

  async create(createAlbumDto: CreateAlbumDto) {

    const album = this.albumRepository.create(createAlbumDto);

    await this.albumRepository.save(album);

    return {
      message: 'Album creado correctamente',
      status: HttpStatus.OK,
      data: album
    }
  }

  async findAll() {
    return await this.albumRepository.find();
  }

  async findOne(id: string) {
    return await this.albumRepository.findOne({
      where: { id }
    });
  }

  update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return `This action updates a #${id} album`;
  }

  remove(id: number) {
    return `This action removes a #${id} album`;
  }
}
