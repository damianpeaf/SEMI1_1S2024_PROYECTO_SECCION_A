import { IsNumber, IsString } from "class-validator";

export class CreateAlbumDto {
    @IsString()
    name: string;

    @IsNumber()
    user: number;

    @IsNumber()
    album_type: number;
}
