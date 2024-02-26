import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS: process.env.AWS_SECRET_ACCESS,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
}));
