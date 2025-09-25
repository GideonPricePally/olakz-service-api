import { UserPayload, Uuid } from '@/common/types/common.type';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentService } from '../payment/payment.service';
import { DataManagerService } from '../utils/data-manager.service';
import { Wallet } from '../wallet/entities/wallet.entity';
import { WalletService } from '../wallet/wallet.service';
import { CreateBankDetailDto } from './dto/create-bank_detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank_detail.dto';
import { BankDetail } from './entities/bank_detail.entity';

@Injectable()
export class BankDetailService {
  constructor(
    @InjectRepository(BankDetail) private readonly bankDetailRepository: Repository<BankDetail>,
    private readonly walletService: WalletService,
    private readonly dataManagerService: DataManagerService,
    private readonly paymentService: PaymentService,
  ) {}

  async registerBankDetail(user: UserPayload, createBankDetailDto: CreateBankDetailDto): Promise<BankDetail> {
    const selectedBank = (await this.paymentService.banks(user.countryId)).find((bank) => bank.code === createBankDetailDto.bankCode);
    if (!selectedBank) throw new NotFoundException('bank not found');

    const wallet = await this.walletService.findOne(user.walletId);
    if (!wallet) throw new NotFoundException('kindly create a wallet');

    const existBankDetail = await this.bankDetailRepository.findOne({
      where: { bank_code: createBankDetailDto.bankCode, account_number: createBankDetailDto.accountNumber, wallet: { id: user.walletId } },
    });
    if (existBankDetail) throw new ConflictException('account details alreeady exist');

    if (!/^[0-9]+$/.test(createBankDetailDto.accountNumber) || createBankDetailDto.accountNumber?.length !== wallet.account_number_length)
      throw new BadRequestException('invalid account number');

    let updatedBankDetails: BankDetail;
    await this.dataManagerService.transaction(async (manager) => {
      const bankDetail = this.bankDetailRepository.create({
        wallet: { id: user.walletId },
        account_number: createBankDetailDto.accountNumber,
        bank_code: createBankDetailDto.bankCode,
        bank_name: selectedBank.name,
        country: { id: user.countryId },
        created_by: user.sub,
        updated_by: user.sub,
      });
      updatedBankDetails = await manager.save(bankDetail);
      if (createBankDetailDto.isDefault || !wallet.default_bank_detail)
        await manager.update(Wallet, { id: user.walletId }, { default_bank_detail: { id: bankDetail.id } });
    });
    return updatedBankDetails;
  }

  async findAll(user: UserPayload): Promise<BankDetail[]> {
    return this.bankDetailRepository.find({ where: { wallet: { id: user.walletId } } });
  }

  async findOne(user: UserPayload, id: Uuid): Promise<BankDetail> {
    const bankDetail = await this.bankDetailRepository.findOne({ where: { id, wallet: { id: user.walletId } } });
    if (!bankDetail) {
      throw new NotFoundException(`bank details not found`);
    }
    return bankDetail;
  }

  async update(user: UserPayload, id: Uuid, updateBankDetailDto: UpdateBankDetailDto): Promise<BankDetail> {
    const bankDetail = await this.findOne(user, id);
    if (!bankDetail) throw new NotFoundException('bank details not found');
    this.bankDetailRepository.merge(bankDetail, {
      account_number: updateBankDetailDto.accountNumber,
      bank_code: updateBankDetailDto.bankCode,
    });
    return this.bankDetailRepository.save(bankDetail);
  }

  async setWalletDefaultAcccount(user: UserPayload, id: Uuid): Promise<BankDetail> {
    const bankDetail = await this.findOne(user, id);
    if (!bankDetail) throw new NotFoundException('bank details not found');
    await this.walletService.setDefaultAcccountDetail(user.walletId, id);
    return bankDetail;
  }

  async remove(user: UserPayload, id: Uuid): Promise<void> {
    const bankDetail = await this.findOne(user, id);
    if (!bankDetail) throw new NotFoundException('bank details not found');
    await this.bankDetailRepository.softDelete({ id });
  }
}
