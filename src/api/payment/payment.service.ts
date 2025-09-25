import { TransactionType } from '@/common/types/account.type';
import { EPaymentStatus, UserPayload } from '@/common/types/common.type';
import { InitializePaymentDto } from '@/libs/payment/dto/initialize-payment.dto';
import { PaymentProviderService } from '@/libs/payment/payment-provider.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { TransactionService } from '../transaction/transaction.service';
import { Wallet } from '../wallet/entities/wallet.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ResolveAccountNumber } from './dto/resolve-account-number.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    private readonly paymentProviderService: PaymentProviderService,
    private readonly transactionService: TransactionService,
  ) {}

  async createPayment(user: UserPayload, createDto: CreatePaymentDto, entityManager?: EntityManager) {
    const newPayment = this.paymentRepository.create(createDto);

    let payment;
    if (entityManager) payment = await entityManager.save(Payment, newPayment);
    else payment = await this.paymentRepository.save(newPayment);
    await this.transactionService.create(
      user,
      {
        payment: { id: payment.id } as Payment,
        amount: createDto.amount,
        currency: createDto.currency,
        type: TransactionType.CAMPAIGN,
        wallet: { id: user.walletId } as Wallet,
        currency_code: createDto.currency.code,
        created_by: createDto.created_by,
        updated_by: createDto.updated_by,
        status: EPaymentStatus.NOT_PAID,
      },
      entityManager,
    );

    return payment;
  }

  async updatePayment(user: UserPayload, paymentId: string, updateDto: UpdatePaymentDto, entityManager?: EntityManager) {
    if (entityManager) {
      await entityManager.update(Payment, paymentId, updateDto);
    } else {
      await this.paymentRepository.update(paymentId, updateDto);
    }

    if (updateDto.status) await this.transactionService.update(user, { payment: { id: paymentId } }, { status: updateDto.status });
  }

  async initializePayment(countryId: string, data: InitializePaymentDto) {
    const providerService = await this.paymentProviderService.providerServicebyCountryId(countryId, true);
    return await providerService?.initializePayment(data);
  }

  async payment() {
    const payment = this.paymentRepository.create({});
    await this.paymentRepository.save(payment);
  }

  async banks(countryId: string) {
    return await this.paymentProviderService.banks(countryId);
  }

  async baseProviderByCountryId(countryId: string) {
    return await this.paymentProviderService.baseProviderByCountryId(countryId);
  }

  async paymentProviders(countryId: string) {
    return await this.paymentProviderService.providersbyCountryId(countryId);
  }

  async verifyAccountNumber(user: UserPayload, query: ResolveAccountNumber) {
    return await this.paymentProviderService.verifyAccountNumber(user?.countryId, query.bank_code, query.account_number);
  }

  async verifyPayment(user: UserPayload, reference: string) {
    return await this.paymentProviderService.verifyPayment(user?.countryId, reference);
  }

  async findOneByReference(reference: string) {
    return this.paymentRepository.findOne({ where: { reference } });
  }
}
