import { CreateUserDto } from "../dto/create-user.dto";

export interface CreateUserWithPhoto extends CreateUserDto {
  photo: Express.Multer.File;
}

export interface UpdateUserWithPhoto extends Partial<CreateUserWithPhoto> {}