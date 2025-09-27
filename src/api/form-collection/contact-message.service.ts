import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';
import { ContactMessage } from './entities/contact-message.entity';

@Injectable()
export class ContactMessageService {
  constructor(@InjectRepository(ContactMessage) private ContactMessageRepository: Repository<ContactMessage>) {}

  getContactMessages(condition?: FindManyOptions<ContactMessage>) {
    return this.ContactMessageRepository.find(condition);
  }

  async create(createContactMessageDto: CreateContactMessageDto): Promise<ContactMessage> {
    const newContactMessage = await this.ContactMessageRepository.create({
      ...createContactMessageDto,
      created_by: SYSTEM_USER_ID,
      updated_by: SYSTEM_USER_ID,
    });
    return this.ContactMessageRepository.save(newContactMessage) as Promise<ContactMessage>;
  }

  findAll(): Promise<ContactMessage[]> {
    return this.getContactMessages();
  }

  findOne(id: Uuid): Promise<ContactMessage> {
    return this.ContactMessageRepository.findOne({ where: { id } });
  }

  async update(id: Uuid, updateContactMessageDto: UpdateContactMessageDto): Promise<ContactMessage> {
    await this.ContactMessageRepository.update(id, updateContactMessageDto);
    return this.findOne(id);
  }

  async remove(id: Uuid): Promise<void> {
    await this.ContactMessageRepository.delete(id);
  }
}
