import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { AuthGuard } from '../jwt/guards/jwt-guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) { }

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  create(
    @Body() createPhotoDto: CreatePhotoDto,
    @UploadedFile() photo: Express.Multer.File
  ) {
    return this.photoService.createPhoto({
      ...createPhotoDto,
      photo,
    });
  }
}
