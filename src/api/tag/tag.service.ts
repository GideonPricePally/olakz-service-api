import { Uuid } from '@/common/types/common.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const newTag = await this.tagRepository.create(createTagDto);
    return this.tagRepository.save(newTag) as Promise<Tag>;
  }

  findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  findOne(id: Uuid): Promise<Tag> {
    return this.tagRepository.findOne({ where: { id } });
  }

  async update(id: Uuid, updateTagDto: UpdateTagDto): Promise<Tag> {
    await this.tagRepository.update(id, updateTagDto);
    return this.findOne(id);
  }

  async remove(id: Uuid): Promise<void> {
    await this.tagRepository.delete(id);
  }
}
