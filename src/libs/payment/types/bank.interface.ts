export interface IBank {
  id: string | number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  supports_transfer: boolean;
  available_for_direct_debit: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: 'nuban';
  is_deleted: boolean;
}

export interface IResolvedAccountData {
  account_number: string;
  account_name: string;
  bank_id: number;
}
export interface IResolvedAccount {
  status: boolean;
  message: string;
  data: IResolvedAccountData;
}
