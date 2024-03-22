import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

// username required
// user can login with password or photo face recognition
export class LoginUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })

  password?: string;

  photo?: Express.Multer.File;
}
