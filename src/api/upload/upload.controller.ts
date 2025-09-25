import { AuthUser } from '@/decorators/auth.decorator';
import { Controller, Headers, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { IdempotencyKeyService } from '../idempotency-key/idempotency-key.service';
import { UploadService } from './upload.service';

@ApiTags('uploads')
@Controller({
  path: 'uploads',
  version: '1',
})
export class UploadController {
  constructor(
    private readonly service: UploadService,
    private readonly idempotencyKeyService: IdempotencyKeyService,
  ) {}

  @AuthUser()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @Post('image')
  async uploadImage(@UploadedFile() file: any, @Headers('idempotency-key') idempotencyKey: string) {
    return this.idempotencyKeyService.handle(idempotencyKey, file, () => this.service.uploadImage(file));
  }
}
