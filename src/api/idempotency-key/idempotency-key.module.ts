import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdempotencyKey } from './entities/idempotency-key.entity';
import { IdempotencyKeyService } from './idempotency-key.service';

@Module({
  imports: [TypeOrmModule.forFeature([IdempotencyKey])],
  providers: [IdempotencyKeyService],
  exports: [IdempotencyKeyService],
})
export class IdempotencyKeyModule {}
