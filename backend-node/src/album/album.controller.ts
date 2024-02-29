import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AuthGuard } from 'src/jwt/guards/jwt-guard';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Headers('Authorization') token: string,
    @Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.createAlbum(createAlbumDto, token);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Headers('Authorization') token: string
  ) {
    return this.albumService.findAll(token);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Headers('Authorization') token: string,
    @Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumService.update(+id, updateAlbumDto, token);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(
    @Headers('Authorization') token: string,
    @Param('id') id: string) {
    return this.albumService.remove(id, token);
  }
}
