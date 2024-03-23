import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsOptional()
  password?: string;

  photo?: Express.Multer.File;
}
