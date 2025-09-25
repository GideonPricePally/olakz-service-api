import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { DataManagerService } from '../utils/data-manager.service';
import { CreateFprDto } from './dto/create-Fpr.dto';
import { FPR } from './entities/fpr.entity';

@Injectable()
export class FprService {
  constructor(
    @InjectRepository(FPR) private readonly FprRepository: Repository<FPR>,
    private readonly dataManager: DataManagerService,
  ) {}

  async getFprById(id: string) {
    return this.FprRepository.findOne({ where: { id } });
  }

  async getFprByUsername(username: string) {
    return this.FprRepository.findOne({ where: { username } });
  }

  async getOpenFprByUsername(username: string) {
    return this.FprRepository.findOne({ where: { username, request_completed_at: '' } });
  }

  async updateFprOtp(prospectId: string, otp: string) {
    return await this.FprRepository.createQueryBuilder()
      .update(FPR)
      .set({
        otps: () => `array_append("otps", :otp)`,
      })
      .where('id = :id', { id: prospectId, otp })
      .execute();
  }

  async increaseNoOfRequestTries(criteria: FindOptionsWhere<FPR>) {
    return this.FprRepository.increment(criteria, 'no_of_request_tries', 1);
  }

  private async increaseRequestTriesMultiple(criteria: FindOptionsWhere<FPR>) {
    return this.FprRepository.increment(criteria, 'request_tries_multiple', 1);
  }

  async resetNoOfRequestTries(criteria: FindOptionsWhere<FPR>) {
    await this.increaseRequestTriesMultiple(criteria);
    return this.FprRepository.update(criteria, { no_of_request_tries: 0, otps: [] });
  }

  async create_save(Fpr: Partial<FPR>): Promise<FPR> {
    const FprInstance = await this.FprRepository.create(Fpr);
    return (await this.FprRepository.save(FprInstance)) as FPR;
  }

  async mark_as_completed(Fpr_id: string, entityManager: EntityManager) {
    if (entityManager) return entityManager.update(FPR, Fpr_id, { request_completed_at: moment.utc().format() });
    return await this.FprRepository.update({ id: Fpr_id }, { request_completed_at: moment.utc().format() });
  }

  async delete(Fpr_id: string, entityManager: EntityManager) {
    const fpr = await this.FprRepository.findOne({ where: { id: Fpr_id } });
    await this.FprRepository.update(
      { id: Fpr_id },
      {
        username: `${fpr.username}-deleted-${fpr.id}`,
      },
    );
    if (entityManager) return entityManager.softDelete(FPR, Fpr_id);
    return await this.FprRepository.softDelete({ id: Fpr_id });
  }
  async multiple_create_save(Fprs: CreateFprDto[]): Promise<FPR[]> {
    const FprInstances = [];
    for (let index = 0; index < Fprs.length; index++) {
      const instance = await this.FprRepository.create(Fprs[index]);
      FprInstances.push(instance);
    }
    return (await this.FprRepository.save(FprInstances)) as FPR[];
  }
}
