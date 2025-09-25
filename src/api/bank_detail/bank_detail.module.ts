import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from '../payment/payment.module';
import { UtilsModule } from '../utils/utils.module';
import { WalletModule } from '../wallet/wallet.module';
import { BankDetailController } from './bank_detail.controller';
import { BankDetailService } from './bank_detail.service';
import { BankDetail } from './entities/bank_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankDetail]), UtilsModule, PaymentModule, WalletModule],
  controllers: [BankDetailController],
  providers: [BankDetailService],
})
export class BankDetailModule {}
