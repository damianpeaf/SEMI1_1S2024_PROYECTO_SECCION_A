import { IsNumber, IsString } from "class-validator";

export class CreateAlbumPhotoDto {
    @IsString()
    name: string;

    @IsString()
    url: string;

    @IsNumber()
    albumId: number;
}