import { Uuid } from '@/common/types/common.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FulfillmentProvider } from './entities/fulfillment-provider.entity';

@Injectable()
export class FulfillmentService {
  constructor(
    @InjectRepository(FulfillmentProvider)
    private readonly fulfillmentProviderRepository: Repository<FulfillmentProvider>,
  ) {}

  findById(id: Uuid) {
    return this.fulfillmentProviderRepository.findOneBy({ id });
  }

  findByIds(ids: Uuid[]) {
    return this.fulfillmentProviderRepository.findBy({ id: In(ids) });
  }
}
