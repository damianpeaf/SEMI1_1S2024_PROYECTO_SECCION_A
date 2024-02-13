import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nickname: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  photo: File;
}
