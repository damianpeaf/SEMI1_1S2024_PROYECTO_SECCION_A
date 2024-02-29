import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { JwtServiceLocal } from 'src/jwt/jwt.service';
import { AlbumPhotoService } from './album-photo/album-photo.service';

@Injectable()
export class AlbumService {

  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    private readonly photoService: AlbumPhotoService,
    private readonly jwtService: JwtServiceLocal
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

  async findAll(token: string) {
    const userId = this.jwtService.getUserIdFromToken(token);

    const albumsByUser = await this.albumRepository.find(
      {
        where: { user: +userId }
      }
    );

    const response = []

    for (let i = 0; i < albumsByUser.length; i++) {
      const photos = await this.photoService.findByAlbumId(+albumsByUser[i].id);
      response.push({
        ...albumsByUser[i],
        photos
      })
    }

    return {
      message: 'Albums encontrados correctamente',
      status: HttpStatus.OK,
      data: response
    }
  
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
