import { Uuid } from '@/common/types/common.type';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFprDto } from './dto/create-Fpr.dto';
import { UpdateFprDto } from './dto/update-Fpr.dto';
import { FPR as ForgetPasswordRequestEntity } from './entities/fpr.entity';

@Injectable()
export class ForgetPasswordRequestService {
  constructor(
    @InjectRepository(ForgetPasswordRequestEntity)
    private readonly forgetPasswordRequestRepository: Repository<ForgetPasswordRequestEntity>,
  ) {}

  async create(createForgetPasswordRequestDto: CreateFprDto): Promise<ForgetPasswordRequestEntity> {
    const forgetPasswordRequest = this.forgetPasswordRequestRepository.create(createForgetPasswordRequestDto);
    return this.forgetPasswordRequestRepository.save(forgetPasswordRequest);
  }

  async findAll(): Promise<ForgetPasswordRequestEntity[]> {
    return this.forgetPasswordRequestRepository.find();
  }

  async findOne(id: Uuid): Promise<ForgetPasswordRequestEntity> {
    const forgetPasswordRequest = await this.forgetPasswordRequestRepository.findOne({ where: { id } });
    if (!forgetPasswordRequest) {
      throw new NotFoundException(`ForgetPasswordRequest with ID ${id} not found`);
    }
    return forgetPasswordRequest;
  }

  async update(id: Uuid, updateForgetPasswordRequestDto: UpdateFprDto): Promise<ForgetPasswordRequestEntity> {
    const forgetPasswordRequest = await this.findOne(id);
    Object.assign(forgetPasswordRequest, updateForgetPasswordRequestDto);
    return this.forgetPasswordRequestRepository.save(forgetPasswordRequest);
  }

  async remove(id: Uuid): Promise<void> {
    const result = await this.forgetPasswordRequestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ForgetPasswordRequest with ID ${id} not found`);
    }
  }
}
