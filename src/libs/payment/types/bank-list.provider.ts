import { IBank } from './bank.interface';

export abstract class IBankList {
  abstract banks(query?: string): Promise<IBank[]>;
}
