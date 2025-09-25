import { Injectable } from '@nestjs/common';
import { IBaseProvider } from '../../types/base.provider';
import { EProviderName } from '../../types/provider-name';

@Injectable()
export class MixpayProviderService implements IBaseProvider {
  constructor() {}

  get name(): EProviderName {
    return EProviderName.MIXPAY;
  }

  get isBase(): boolean {
    return false;
  }
}
