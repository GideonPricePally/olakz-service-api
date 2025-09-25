import { QueueName, QueuePrefix } from '@/constants/job.constant';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModule } from '../country/country.module';
import { FprModule } from '../forget_password_request/fpr.module';
import { PaymentModule } from '../payment/payment.module';
import { ProspectModule } from '../prospect/prospect.module';
import { RegionModule } from '../region/region.module';
import { RoleModule } from '../role/role.module';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UtilsModule } from '../utils/utils.module';
import { WalletModule } from '../wallet/wallet.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    BullModule.registerQueue({
      name: QueueName.EMAIL,
      prefix: QueuePrefix.AUTH,
      streams: {
        events: {
          maxLen: 1000,
        },
      },
    }),
    UtilsModule,
    ProspectModule,
    CountryModule,
    RoleModule,
    FprModule,
    WalletModule,
    RegionModule,
    PaymentModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
