import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PaymentProvider } from './entities/payment-provider.entity';

@Injectable()
export class PaymentProviderRepository extends Repository<PaymentProvider> {
  constructor(private readonly dataSource: DataSource) {
    super(PaymentProvider, dataSource.createEntityManager());
  }
}
