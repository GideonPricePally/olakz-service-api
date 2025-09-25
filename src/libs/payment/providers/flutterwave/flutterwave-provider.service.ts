import { Injectable } from '@nestjs/common';
import { IBankList } from '../../types/bank-list.provider';
import { IBank } from '../../types/bank.interface';
import { IBaseProvider } from '../../types/base.provider';
import { EProviderName } from '../../types/provider-name';

@Injectable()
export class FlutterwaveProviderService implements IBankList, IBaseProvider {
  constructor() {}

  banks(): Promise<IBank[]> {
    throw new Error('Method not implemented.');
  }

  get name(): EProviderName {
    return EProviderName.FLUTTERWAVE;
  }

  get isBase(): boolean {
    return false;
  }
}
