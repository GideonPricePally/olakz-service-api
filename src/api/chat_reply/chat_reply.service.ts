import { Uuid } from '@/common/types/common.type';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatReplyDto } from './dto/create-chat_reply.dto';
import { UpdateChatReplyDto } from './dto/update-chat_reply.dto';
import { ChatReply } from './entities/chat_reply.entity';

@Injectable()
export class ChatReplyService {
  constructor(
    @InjectRepository(ChatReply)
    private readonly chatReplyRepository: Repository<ChatReply>,
  ) {}

  async create(createChatReplyDto: CreateChatReplyDto): Promise<ChatReply> {
    const chatReply = this.chatReplyRepository.create(createChatReplyDto);
    return this.chatReplyRepository.save(chatReply);
  }

  async findAll(): Promise<ChatReply[]> {
    return this.chatReplyRepository.find();
  }

  async findOne(id: Uuid): Promise<ChatReply> {
    const chatReply = await this.chatReplyRepository.findOne({ where: { id } });
    if (!chatReply) {
      throw new NotFoundException(`ChatReply with ID ${id} not found`);
    }
    return chatReply;
  }

  async update(id: Uuid, updateChatReplyDto: UpdateChatReplyDto): Promise<ChatReply> {
    const chatReply = await this.findOne(id);
    this.chatReplyRepository.merge(chatReply, updateChatReplyDto);
    return this.chatReplyRepository.save(chatReply);
  }

  async remove(id: Uuid): Promise<void> {
    const chatReply = await this.findOne(id);
    await this.chatReplyRepository.remove(chatReply);
  }
}
