import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export enum ImagesFolders {
  PROFILE = 'Fotos_Perfil',
  PUBLISHED = 'Fotos_Publicadas',
}

@Injectable()
export class FileUploaderService {
  private s3Client: S3Client;
  private DEFAULT_BUCKET: string;
  private readonly logger = new Logger(FileUploaderService.name);

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.DEFAULT_BUCKET = this.configService.get('AWS_S3_BUCKET');
  }

  public async getS3Client() {
    return this.s3Client;
  }

  async uploadFile(file: Express.Multer.File, path: string) {
    if (!file) return null;

    const { originalname } = file;
    const [name, ext] = originalname.split('.');

    const location =
      path.trim().replace(/^\/+|\/+$/g, '') +
      `/${name}${new Date().toISOString()}.${ext}`;

    return this.s3_upload(
      file.buffer,
      this.DEFAULT_BUCKET,
      location,
      file.mimetype,
    );
  }

  async uploadImage(file: Express.Multer.File, folder: ImagesFolders) {
    return this.uploadFile(file, folder);
  }

  async s3_upload(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    try {
      const result = await new Upload({
        client: this.s3Client,
        params: {
          Bucket: bucket,
          Key: name,
          Body: file,
          ContentType: mimetype,
        },
      }).done();
      return result.Location;
    } catch (error) {
      this.logger.error(error);
    }
    return null;
  }
}
