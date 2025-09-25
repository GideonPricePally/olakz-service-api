import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RegionService } from '../region/region.service';
import { User } from '../user/entities/user.entity';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

const DEFAULT_REGION_RELATIONS = ['currency'];
const DEFAULT_WALLET_RELATIONS = ['currency', 'bank_details', 'default_bank_detail'];

@Injectable()
export class WalletService {
  constructor(
    private readonly regionService: RegionService,
    @InjectRepository(Wallet) private readonly walletRepository: Repository<Wallet>,
  ) {}

  async create(userId: string, countryId: string, entityManager?: EntityManager): Promise<Wallet> {
    const user = { id: userId } as User;
    const region = await this.regionService.findOneByCountryId(countryId, DEFAULT_REGION_RELATIONS);

    if (!region) throw new NotFoundException('region not found');
    const currency = region?.currency;

    const newWallet = await this.walletRepository.create({ user, currency, created_by: SYSTEM_USER_ID, updated_by: SYSTEM_USER_ID });
    if (entityManager) return entityManager.save(Wallet, newWallet);
    return await this.walletRepository.save(newWallet);
  }

  findAll(): Promise<Wallet[]> {
    return this.walletRepository.find();
  }

  findOne(id: Uuid): Promise<Wallet> {
    return this.walletRepository.findOne({ where: { id }, relations: DEFAULT_WALLET_RELATIONS });
  }

  async setDefaultAcccountDetail(walletId: string, bandDetailId: string) {
    await this.walletRepository.update({ id: walletId }, { default_bank_detail: { id: bandDetailId } });
  }

  async update(id: Uuid, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    await this.walletRepository.update(id, updateWalletDto);
    return this.findOne(id);
  }

  async remove(id: Uuid): Promise<void> {
    await this.walletRepository.delete(id);
  }
}
