import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Rekognition } from 'aws-sdk'
import { CompareFacesRequest } from 'aws-sdk/clients/rekognition';

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

    async compareFaces(photo1: Buffer, photo2: Buffer) {
        
        const rekognition = await this.configureRekognition();

        const params: CompareFacesRequest = {
            SourceImage: {
                Bytes: photo1,
            },
            TargetImage: {
                Bytes: photo2,
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

    async getTags(photo: Buffer) {
        const rekognition = await this.configureRekognition();
        const params = {
            Image: {
                Bytes: photo,
            },
        };

        try {
            const response = await rekognition.detectLabels(params).promise();
            return response;
        } catch (err) {
            console.error(err);
        }
    }
}
