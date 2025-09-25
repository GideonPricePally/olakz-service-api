import { UserPayload, Uuid } from '@/common/types/common.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

const TRANSACTION_RELATIONS = ['currency'];

@Injectable()
export class TransactionService {
  constructor(@InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>) {}

  async create(user: UserPayload, createTransactionDto: CreateTransactionDto, entityManager?: EntityManager): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create(createTransactionDto);
    if (entityManager) return await entityManager.save(Transaction, newTransaction);
    else return await this.transactionRepository.save(newTransaction);
  }

  findAll(user: UserPayload): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { wallet: { id: user.walletId } },
      relations: TRANSACTION_RELATIONS,
      order: { created_at: 'DESC' },
    });
  }

  findOne(user: UserPayload, criteria: FindOptionsWhere<Transaction>): Promise<Transaction> {
    return this.transactionRepository.findOne({ where: { ...criteria, wallet: { id: user.walletId } }, relations: TRANSACTION_RELATIONS });
  }

  async update(
    user: UserPayload,
    criteria: FindOptionsWhere<Transaction>,
    updateTransactionDto: UpdateTransactionDto,
    entityManager?: EntityManager,
  ): Promise<Transaction> {
    if (entityManager) await entityManager.update(Transaction, criteria, updateTransactionDto);
    else await this.transactionRepository.update(criteria, updateTransactionDto);
    return this.findOne(user, criteria);
  }

  async remove(user: UserPayload, id: Uuid): Promise<void> {
    await this.transactionRepository.softDelete({ id, wallet: { id: user.walletId } });
  }
}
