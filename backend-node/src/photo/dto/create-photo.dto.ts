import { IsNumber, IsString } from "class-validator";

export class CreatePhotoDto {
    @IsString()
    name: string;

    @IsString()
    url: string;

    @IsNumber()
    albumId: number;
}

export interface CreatePhotoWithFile extends CreatePhotoDto {
    photo: Express.Multer.File;
}