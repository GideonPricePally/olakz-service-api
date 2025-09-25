import { EProviderName } from './provider-name';

export abstract class IBaseProvider {
  abstract name: EProviderName;
  abstract isBase: boolean;
}
