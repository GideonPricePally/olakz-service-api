import { registerAs } from '@nestjs/config';

import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { MailConfig } from './mail-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  MAIL_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  MAIL_PORT: number;

  @IsString()
  @IsOptional()
  MAIL_USER: string;

  @IsString()
  @IsOptional()
  MAIL_PASSWORD: string;

  @IsBoolean()
  MAIL_IGNORE_TLS: boolean;

  @IsBoolean()
  MAIL_SECURE: boolean;

  @IsBoolean()
  MAIL_REQUIRE_TLS: boolean;

  @IsEmail()
  MAIL_DEFAULT_EMAIL: string;

  @IsString()
  MAIL_DEFAULT_NAME: string;

  @IsString()
  MAIL_SERVICE: string;

  @IsString()
  SIGNUP_COMPLETE_HEADER: string;

  @IsString()
  SIGNUP_REQUEST_HEADER: string;

  @IsString()
  FORGET_PASSWORD_REQUEST_HEADER: string;

  @IsString()
  FORGET_PASSWORD_COMPLETE_HEADER: string;

  @IsString()
  PASSWORD_UPDATED_HEADER: string;

  @IsString()
  ADMIN_NEW_PASSWORD_EMAIL_HEADER: string;
}

export default registerAs<MailConfig>('mail', () => {
  console.info(`Register MailConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
    secure: process.env.MAIL_SECURE === 'true',
    requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
    defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
    defaultName: process.env.MAIL_DEFAULT_NAME,
    service: process.env.MAIL_SERVICE,
    signupCompleteHeader: process.env.SIGNUP_COMPLETE_HEADER,
    signupRequestHeader: process.env.SIGNUP_REQUEST_HEADER,
    forgetPasswordRequestHeader: process.env.FORGET_PASSWORD_REQUEST_HEADER,
    forgetPasswordCompleteHeader: process.env.FORGET_PASSWORD_COMPLETE_HEADER,
    passwordUpdateHeader: process.env.PASSWORD_UPDATED_HEADER,
    adminNewPasswordEmailHeader: process.env.ADMIN_NEW_PASSWORD_EMAIL_HEADER,
  };
});
