// cloudinary.provider.ts
import { ConfigReaderService } from '@/api/utils/config-reader.service';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryProviderService {
  private cloudinary = cloudinary;
  constructor(config: ConfigReaderService) {
    this.cloudinary.config({
      cloud_name: config.cloudinary.name,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.secret,
    });
  }

  public get client() {
    return this.cloudinary;
  }
}
