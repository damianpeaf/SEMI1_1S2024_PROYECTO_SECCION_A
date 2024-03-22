import { IsString } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  name: string;

  @IsString()
  album: string;
}

export interface CreatePhotoWithFile extends CreatePhotoDto {
  photo: Express.Multer.File;
}
