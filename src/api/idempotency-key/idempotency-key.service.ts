import { EIdempotencyKeyStatus } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { IdempotencyKey } from './entities/idempotency-key.entity';

@Injectable()
export class IdempotencyKeyService {
  constructor(@InjectRepository(IdempotencyKey) private readonly idempotencyKeyRepository: Repository<IdempotencyKey>) {}

  private hashRequest(body: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');
  }

  async handle<T>(key: string, request: any, processFn: () => Promise<T>): Promise<T> {
    if (!key) {
      throw new BadRequestException('Idempotency key is required');
    }
    const requestHash = this.hashRequest(request);

    let entry = await this.idempotencyKeyRepository.findOne({ where: { key } });

    if (entry) {
      if (entry.status === EIdempotencyKeyStatus.COMPLETED) {
        return entry.response as T;
      }
      if (entry.request_hash !== requestHash) {
        throw new ConflictException('Idempotency key already used with different request');
      }
      if (entry.status === EIdempotencyKeyStatus.IN_PROGRESS) {
        throw new ConflictException('Kindly do not re-submit');
      }
    } else {
      entry = this.idempotencyKeyRepository.create({
        key,
        request_hash: requestHash,
        status: EIdempotencyKeyStatus.IN_PROGRESS,
        created_by: SYSTEM_USER_ID,
        updated_by: SYSTEM_USER_ID,
      });
      await this.idempotencyKeyRepository.save(entry);
    }

    const result = await processFn();

    entry.response = result as any;
    entry.status = EIdempotencyKeyStatus.COMPLETED;
    await this.idempotencyKeyRepository.save(entry);

    return result;
  }
}
