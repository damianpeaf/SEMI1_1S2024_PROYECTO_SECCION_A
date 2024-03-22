import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Rekognition } from 'aws-sdk'
import { CompareFacesRequest, DetectTextRequest } from 'aws-sdk/clients/rekognition';
import * as fs from 'fs';

@Injectable()
export class RekognitionService {

    private rekognition: Rekognition;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.rekognition = new Rekognition({
            region: this.configService.get('AWS_S3_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }

    private async configureRekognition() {
        return this.rekognition;
    }

    async compareFaces(photoFromS3Url: string, photoFromFile: Express.Multer.File) {
        const photoBuffer = fs.readFileSync(photoFromFile.path);

        const rekognition = await this.configureRekognition();

        const params: CompareFacesRequest = {
            SourceImage: {
                Bytes: photoBuffer,
            },
            TargetImage: {
                S3Object: {
                    Bucket: this.configService.get('AWS_S3_BUCKET'),
                    Name: photoFromS3Url,
                },
            },
            SimilarityThreshold: 90,
        };

        try {
            const response = await rekognition.compareFaces(params).promise();
            return response;
        } catch (err) {
            console.error(err);
        }
      }

    async getTags(photo: Express.Multer.File) {

        const photoBuffer = fs.readFileSync(photo.path);

        const rekognition = await this.configureRekognition();
        const params = {
            Image: {
                Bytes: photoBuffer,
            },
        };

        try {
            const response = await rekognition.detectLabels(params).promise();
            return response;
        } catch (err) {
            console.error(err);
        }
    }

    async extractText(photo: Express.Multer.File) {
        const photoBuffer = fs.readFileSync(photo.path);

        const rekognition = await this.configureRekognition();

        const params: DetectTextRequest = {
            Image: {
                Bytes: photoBuffer,
            },
        };

        try {
            const response = await rekognition.detectText(params).promise();
            return response;
        } catch (err) {
            console.error(err);
        }
    }
}
