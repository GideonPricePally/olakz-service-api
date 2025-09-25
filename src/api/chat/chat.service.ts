import { Uuid } from '@/common/types/common.type';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const chat = this.chatRepository.create(createChatDto);
    return this.chatRepository.save(chat);
  }

  async findAll(): Promise<Chat[]> {
    return this.chatRepository.find();
  }

  async findOne(id: Uuid): Promise<Chat> {
    const chat = await this.chatRepository.findOne({ where: { id } });
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    return chat;
  }

  async update(id: Uuid, updateChatDto: UpdateChatDto): Promise<Chat> {
    const chat = await this.findOne(id);
    this.chatRepository.merge(chat, updateChatDto);
    return this.chatRepository.save(chat);
  }

  async remove(id: Uuid): Promise<void> {
    const chat = await this.findOne(id);
    await this.chatRepository.remove(chat);
  }
}
