import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { FPR } from './entities/fpr.entity';
import { FprService } from './fpr.service';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([FPR])],
  providers: [FprService],
  exports: [FprService],
})
export class FprModule {}
