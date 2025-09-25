import validateConfig from '@/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import { CloudinaryConfig } from './cloudinary-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_SECRET: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_CLOUD_NAME: string;
}

export default registerAs<CloudinaryConfig>('cloudinary', () => {
  console.info(`Register CloundinaryConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiKey: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_API_SECRET,
    name: process.env.CLOUDINARY_CLOUD_NAME,
  };
});
