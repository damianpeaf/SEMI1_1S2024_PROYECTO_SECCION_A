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
  Patch,
  UseGuards,
  Headers,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guards/jwt-guard';

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
  createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    photo: Express.Multer.File,
  ) {
    return this.authService.create({
      ...createUserDto,
      photo,
    });
  }

  @UseGuards(AuthGuard)
  @Patch('info')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  updateInfo(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    photo: Express.Multer.File,
    @Headers('authorization') token: string,
  ) {
    return this.authService.update({
      ...updateUserDto,
      photo,
    }, token);
  }

  @UseGuards(AuthGuard)
  @Get('info')
  getUserInfo(@Headers('authorization') token: string) {
    return this.authService.getUserInfo(token);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
