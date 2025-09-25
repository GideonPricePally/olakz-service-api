import { IResolvedAccountData } from './bank.interface';

export abstract class IResolveAccount {
  abstract verifyAccountNumber(query?: string): Promise<IResolvedAccountData>;
}
