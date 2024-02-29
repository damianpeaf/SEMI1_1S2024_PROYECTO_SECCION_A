import { memoryStorage } from 'multer';
import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Headers,
  Put,
  UsePipes, ValidationPipe, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { AuthGuard } from '../jwt/guards/jwt-guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard)
  @Get('info')
  getUserInfo(@Headers('authorization') token: string) {
    return this.userService.findOne(token);
  }

  @UseGuards(AuthGuard)
  @Put('info')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  updateInfo(
    @Headers('Authorization') token: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
        fileIsRequired: false,
      }),
    )
    photo?: Express.Multer.File,
  ) {
    return this.userService.update({
      ...updateUserDto,
      photo,
    }, token);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
