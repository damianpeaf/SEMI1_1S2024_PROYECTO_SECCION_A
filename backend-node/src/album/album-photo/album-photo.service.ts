import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumPhoto } from '../entities/album-photo.entity';
import { Repository } from 'typeorm';
import { CreateAlbumPhotoDto } from '../dto/create-album-photo.dt';

@Injectable()
export class AlbumPhotoService {

    constructor(
        @InjectRepository(AlbumPhoto)
        private readonly albumPhotoRepository: Repository<AlbumPhoto>,
    ) {}

    async create(createAlbumPhotoDto: CreateAlbumPhotoDto) {
        return await this.albumPhotoRepository.save(createAlbumPhotoDto);
    }

    async findByAlbumId(albumId: number) {
        return await this.albumPhotoRepository.find({
            where: { albumId }
        });
    }
}
