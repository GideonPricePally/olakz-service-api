import { IsMs } from '@/decorators/validators/is-ms.decorator';
import validateConfig from '@/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AuthConfig } from './auth-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  AUTH_JWT_SECRET: string;

  @IsString()
  @IsOptional()
  @IsMs()
  AUTH_JWT_TOKEN_EXPIRES_IN?: string;

  @IsString()
  @IsNotEmpty()
  AUTH_REFRESH_SECRET: string;

  @IsString()
  @IsNotEmpty()
  @IsMs()
  AUTH_REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  AUTH_FORGOT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  @IsMs()
  AUTH_FORGOT_TOKEN_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  AUTH_CONFIRM_EMAIL_SECRET: string;

  @IsString()
  @IsNotEmpty()
  AUTH_CONFIRM_USERNAME_SECRET: string;

  @IsNumber()
  @IsNotEmpty()
  OTP_TTL: number;
}

export default registerAs<AuthConfig>('auth', () => {
  console.info(`Register AuthConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.AUTH_JWT_SECRET,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    refreshSecret: process.env.AUTH_REFRESH_SECRET,
    refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    forgotSecret: process.env.AUTH_FORGOT_SECRET,
    forgotExpires: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN,
    confirmEmailSecret: process.env.AUTH_CONFIRM_EMAIL_SECRET,
    confirmEmailExpires: process.env.AUTH_CONFIRM_USERNAME_SECRET,
    otp_ttl: Number(process.env.OTP_TTL),
    spotify_client_id: process.env.SPOTIFY_CLIENT_ID,
    spotify_client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    spotify_redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    tiktok_client_id: process.env.TIKTOK_CLIENT_ID,
    tiktok_client_secret: process.env.TIKTOK_CLIENT_SECRET,
    tiktok_redirect_uri: process.env.TIKTOK_REDIRECT_URI,
    apple_client_id: process.env.APPLE_CLIENT_ID,
    apple_client_secret: process.env.APPLE_CLIENT_SECRET,
    apple_redirect_uri: process.env.APPLE_REDIRECT_URI,
  };
});
