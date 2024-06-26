import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Headers,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AuthGuard } from '../jwt/guards/jwt-guard';
import { EAlbumType } from './entities/album-type.entity';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Headers('Authorization') token: string,
    @Body() createAlbumDto: CreateAlbumDto,
  ) {
    return this.albumService.createAlbum(
      {
        ...createAlbumDto,
        album_type: EAlbumType.STANDARD,
      },
      token,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Headers('Authorization') token: string) {
    return this.albumService.findAll(token);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Headers('Authorization') token: string,
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.update(+id, updateAlbumDto, token);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Headers('Authorization') token: string, @Param('id') id: string) {
    return this.albumService.remove(id, token);
  }
}
