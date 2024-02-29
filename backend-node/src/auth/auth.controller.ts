import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  registerUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    photo: Express.Multer.File,
  ) {
    return this.authService.register({
      ...createUserDto,
      photo,
    });
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // @UseGuards(AuthGuard)
  // @Patch('info')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     storage: memoryStorage(),
  //   }),
  // )
  // updateInfo(
  //   @Body() updateUserDto: UpdateUserDto,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
  //     }),
  //   )
  //   photo: Express.Multer.File,
  //   @Headers('authorization') token: string,
  // ) {
  //   return this.authService.update({
  //     ...updateUserDto,
  //     photo,
  //   }, token);
  // }
}
