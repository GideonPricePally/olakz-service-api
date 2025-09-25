import { ApiHelper } from '@/api/utils/api-helper';
import { ConfigReaderService } from '@/api/utils/config-reader.service';
import { TWENTY_FOUR_HOURS_MILL } from '@/constants/app.constant';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { InitializePaymentDto } from '../../dto/initialize-payment.dto';
import { IBankList } from '../../types/bank-list.provider';
import { IBank, IResolvedAccount, IResolvedAccountData } from '../../types/bank.interface';
import { IBaseProvider } from '../../types/base.provider';
import { IInitializePayment } from '../../types/initialize-payment';
import { EProviderName } from '../../types/provider-name';
import { IResolveAccount } from '../../types/resolve-account.provider';

@Injectable()
export class PaystackProviderService implements IBankList, IBaseProvider, IResolveAccount, IInitializePayment {
  constructor(
    private readonly config: ConfigReaderService,
    private readonly apiHelper: ApiHelper,
  ) {}

  async verifyPayment(reference: string): Promise<{ status: string; amount: string; reference: string; captured_at: string }> {
    const baseUrl = this.config.payment.paystack.base_url;
    const config = this.paystackConfig();

    const response = (await this.apiHelper.get(`${baseUrl}/transaction/verify/${reference}`, config)) as any;
    const data = response?.data;
    return {
      status: data.status,
      amount: data.amount,
      reference: data.reference,
      captured_at: data.created_at,
    };
  }

  async initializePayment({
    amount,
    email,
    reference,
    callback_url,
  }: InitializePaymentDto): Promise<{ authorization_url: string; access_code: string; reference: string }> {
    const baseUrl = this.config.payment.paystack.base_url;
    const config = this.paystackConfig();
    const payload = {
      amount,
      email,
      reference,
      currency: 'NGN',
      callback_url,
    };
    const response = (await this.apiHelper.post(`${baseUrl}/transaction/initialize`, payload, config)) as any;
    const data = response?.data;
    return {
      authorization_url: data.authorization_url,
      access_code: data.access_code,
      reference: data.reference,
    };
  }

  private paystackConfig(): AxiosRequestConfig {
    const apiKey = this.config.payment.paystack.api_key;
    return {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    };
  }

  async verifyAccountNumber(query?: string): Promise<IResolvedAccountData> {
    const baseUrl = this.config.payment.paystack.base_url;
    const config = this.paystackConfig();
    return ((await this.apiHelper.get(`${baseUrl}/bank/resolve?${query}`, config, TWENTY_FOUR_HOURS_MILL)) as IResolvedAccount).data;
  }

  async banks(query?: string): Promise<IBank[]> {
    const baseUrl = this.config.payment.paystack.base_url;
    const config = this.paystackConfig();
    return (((await this.apiHelper.get(`${baseUrl}/bank?${query}`, config, TWENTY_FOUR_HOURS_MILL)) as { data: IBank[] })?.data || []) as IBank[];
  }

  get name(): EProviderName {
    return EProviderName.PAYSTACK;
  }

  get isBase(): boolean {
    return true;
  }
}

// VERIFICATION
// {
//   "status": true,
//   "message": "Verification successful",
//   "data": {
//     "id": 4099260516,
//     "domain": "test",
//     "status": "success",
//     "reference": "re4lyvq3s3",
//     "receipt_number": null,
//     "amount": 40333,
//     "message": null,
//     "gateway_response": "Successful",
//     "paid_at": "2024-08-22T09:15:02.000Z",
//     "created_at": "2024-08-22T09:14:24.000Z",
//     "channel": "card",
//     "currency": "NGN",
//     "ip_address": "197.210.54.33",
//     "metadata": "",
//     "log": {
//       "start_time": 1724318098,
//       "time_spent": 4,
//       "attempts": 1,
//       "errors": 0,
//       "success": true,
//       "mobile": false,
//       "input": [],
//       "history": [
//         {
//           "type": "action",
//           "message": "Attempted to pay with card",
//           "time": 3
//         },
//         {
//           "type": "success",
//           "message": "Successfully paid with card",
//           "time": 4
//         }
//       ]
//     },
//     "fees": 10283,
//     "fees_split": null,
//     "authorization": {
//       "authorization_code": "AUTH_uh8bcl3zbn",
//       "bin": "408408",
//       "last4": "4081",
//       "exp_month": "12",
//       "exp_year": "2030",
//       "channel": "card",
//       "card_type": "visa ",
//       "bank": "TEST BANK",
//       "country_code": "NG",
//       "brand": "visa",
//       "reusable": true,
//       "signature": "SIG_yEXu7dLBeqG0kU7g95Ke",
//       "account_name": null
//     },
//     "customer": {
//       "id": 181873746,
//       "first_name": null,
//       "last_name": null,
//       "email": "demo@test.com",
//       "customer_code": "CUS_1rkzaqsv4rrhqo6",
//       "phone": null,
//       "metadata": null,
//       "risk_action": "default",
//       "international_format_phone": null
//     },
//     "plan": null,
//     "split": {},
//     "order_id": null,
//     "paidAt": "2024-08-22T09:15:02.000Z",
//     "createdAt": "2024-08-22T09:14:24.000Z",
//     "requested_amount": 30050,
//     "pos_transaction_data": null,
//     "source": null,
//     "fees_breakdown": null,
//     "connect": null,
//     "transaction_date": "2024-08-22T09:14:24.000Z",
//     "plan_object": {},
//     "subaccount": {}
//   }
// }
