import { InitializePaymentDto } from '../dto/initialize-payment.dto';

export abstract class IInitializePayment {
  abstract initializePayment(data: InitializePaymentDto): Promise<{
    authorization_url: string;
    access_code: string;
    reference: string;
  }>;
  abstract verifyPayment(reference: string): Promise<{
    status: string;
    amount: string;
    reference: string;
    captured_at: string;
  }>;
}
