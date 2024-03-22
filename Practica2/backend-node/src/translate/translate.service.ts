import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class TranslateService {

    constructor(
        private readonly configService: ConfigService,
    ) {}

    async translateText(text: string, sourceLang: string, targetLang: string) {
        const translate = new AWS.Translate({
            region: this.configService.get('AWS_S3_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            },
        });
        const params: AWS.Translate.TranslateTextRequest = {
            SourceLanguageCode: sourceLang,
            TargetLanguageCode: targetLang,
            Text: text
        };
        try {
            const response = await translate.translateText(params).promise();
            return response;
        } catch (err) {
            console.error(err);
        }
    }

}
