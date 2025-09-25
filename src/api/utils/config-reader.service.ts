import { AppConfig } from '@/config/app-config.type';
import { AllConfigType } from '@/config/config.type';
import { DatabaseConfig } from '@/database/config/database-config.type';
import { PaymentConfig } from '@/libs/payment/config/payment-config.type';
import { MailConfig } from '@/mail/config/mail-config.type';
import { RedisConfig } from '@/redis/config/redis-config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryConfig } from 'src/cloudinary/config/cloudinary-config.type';
import { AuthConfig } from '../auth/config/auth-config.type';

@Injectable()
export class ConfigReaderService {
  public readonly app: AppConfig;
  public readonly database: DatabaseConfig;
  public readonly redis: RedisConfig;
  public readonly auth: AuthConfig;
  public readonly mail: MailConfig;
  public readonly payment: PaymentConfig;
  public readonly cloudinary: CloudinaryConfig;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.app = configService.get('app');
    this.database = configService.get('database');
    this.redis = configService.get('redis');
    this.auth = configService.get('auth');
    this.mail = configService.get('mail');
    this.payment = configService.get('payment');
    this.cloudinary = configService.get('cloudinary');
  }
}
