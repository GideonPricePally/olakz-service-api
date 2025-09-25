import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdempotencyKeyModule } from '../idempotency-key/idempotency-key.module';
import { UtilsModule } from '../utils/utils.module';
import { Upload } from './entities/upload.entity';
import { CloudinaryProviderService } from './provider/cloudinary.provider.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Upload]), UtilsModule, IdempotencyKeyModule],
  controllers: [UploadController],
  providers: [UploadService, CloudinaryProviderService],
  exports: [UploadService],
})
export class UploadModule {}
