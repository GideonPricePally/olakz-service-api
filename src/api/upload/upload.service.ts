import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { CloudinaryProviderService } from './provider/cloudinary.provider.service';

@Injectable()
export class UploadService {
  private cloudinary: typeof v2;
  constructor(private readonly cloudinaryProviderService: CloudinaryProviderService) {
    this.cloudinary = cloudinaryProviderService.client;
  }
  async uploadImage(file: any) {
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        this.cloudinary.uploader
          .upload_stream(
            {
              folder: 'microtask',
              resource_type: 'image',
              transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result as UploadApiResponse);
            },
          )
          .end(file.buffer);
      });

      return { secure_url: result.secure_url, url: result.url };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
