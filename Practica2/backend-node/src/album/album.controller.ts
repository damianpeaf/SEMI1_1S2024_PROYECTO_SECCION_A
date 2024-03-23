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
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AuthGuard } from '../jwt/guards/jwt-guard';
import { EAlbumType } from './entities/album-type.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreatePhotoDto } from 'src/photo/dto/create-photo.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @UseGuards(AuthGuard)
  @Post('photo/text')
  extractTextFromImage(
    @Headers('Authorization') token: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      })
    )
    photo?: Express.Multer.File,
  ) {
    return this.albumService.extractTextFromImage(photo);
  }

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

  @UseGuards(AuthGuard)
  @Post('photo')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  createPhoto(
    @Headers('Authorization') token: string,
    @Body() createPhotoDto: CreatePhotoDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.albumService.createPhoto({
      ...createPhotoDto,
      photo,
    }, token);
  }

  @UseGuards(AuthGuard)
  @Post('photo/translate')
  translatePhotoDescription(
    @Headers('Authorization') token: string,
    @Body('id') id: string,
    @Body('language') language: string,
  ) {
    return this.albumService.translatePhotoDescription(id, language, token);
  }
}
