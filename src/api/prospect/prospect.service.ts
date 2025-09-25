import { Uuid } from '@/common/types/common.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { Prospect } from './entities/prospect.entity';

@Injectable()
export class ProspectService {
  constructor(@InjectRepository(Prospect) private readonly prospectRepository: Repository<Prospect>) {}

  async getProspectById(id: Uuid | string) {
    return this.prospectRepository.findOne({ where: { id }, relations: ['country', 'referrer'] });
  }

  async getProspectByUsername(username: string) {
    return this.prospectRepository.findOne({ where: { username }, relations: ['country', 'referrer'] });
  }

  async getOpenProspectByUsername(username: string) {
    return this.prospectRepository.findOne({ where: { username }, relations: ['country', 'referrer'] });
  }

  async updateProspectOtp(prospectId: string, otp: string) {
    return await this.prospectRepository
      .createQueryBuilder()
      .update(Prospect)
      .set({
        otps: () => `array_append("otps", :otp)`,
      })
      .where('id = :id', { id: prospectId, otp })
      .execute();
  }

  async increaseNoOfRequestTries(criteria: FindOptionsWhere<Prospect>) {
    return this.prospectRepository.increment(criteria, 'no_of_request_tries', 1);
  }

  private async increaseRequestTriesMultiple(criteria: FindOptionsWhere<Prospect>) {
    return this.prospectRepository.increment(criteria, 'request_tries_multiple', 1);
  }

  async resetNoOfRequestTries(criteria: FindOptionsWhere<Prospect>) {
    await this.increaseRequestTriesMultiple(criteria);
    return this.prospectRepository.update(criteria, { no_of_request_tries: 0, otps: [] });
  }

  async save(prospect: Partial<Prospect>): Promise<Prospect> {
    const prospectInstance = await this.prospectRepository.create(prospect);
    return (await this.prospectRepository.save(prospectInstance)) as Prospect;
  }

  async mark_as_completed(prospect_id: Uuid, entityManager?: EntityManager) {
    if (entityManager) return entityManager.update(Prospect, prospect_id, { signup_completed_at: moment.utc().format() });
    return await this.prospectRepository.update({ id: prospect_id }, { signup_completed_at: moment.utc().format() });
  }

  async delete(prospect_id: Uuid, entityManager?: EntityManager) {
    const prospect = await this.prospectRepository.findOne({ where: { id: prospect_id } });
    await this.prospectRepository.update(
      { id: prospect_id },
      {
        username: `${prospect.username}-deleted-${prospect.id}`,
      },
    );
    if (entityManager) return entityManager.softDelete(Prospect, prospect_id);
    return await this.prospectRepository.softDelete({ id: prospect_id });
  }

  async multiple_create_save(prospects: CreateProspectDto[]): Promise<Prospect[]> {
    const prospectInstances = [];
    for (let index = 0; index < prospects.length; index++) {
      const instance = await this.prospectRepository.create(prospects[index]);
      prospectInstances.push(instance);
    }
    return (await this.prospectRepository.save(prospectInstances)) as Prospect[];
  }

  findAll(): Promise<Prospect[]> {
    return this.prospectRepository.find();
  }

  findOne(id: Uuid): Promise<Prospect> {
    return this.getProspectById(id);
  }

  async update(id: Uuid, updateProspectDto: UpdateProspectDto): Promise<Prospect> {
    await this.prospectRepository.update(id, updateProspectDto);
    return this.findOne(id);
  }

  async remove(id: Uuid): Promise<void> {
    await this.prospectRepository.delete(id);
  }
}
