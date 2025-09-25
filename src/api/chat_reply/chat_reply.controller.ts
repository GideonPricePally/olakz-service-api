import { Uuid } from '@/common/types/common.type';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Version } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatReplyService } from './chat_reply.service';
import { CreateChatReplyDto } from './dto/create-chat_reply.dto';
import { UpdateChatReplyDto } from './dto/update-chat_reply.dto';
import { ChatReply as ChatReplyEntity } from './entities/chat_reply.entity';

@Controller('chat-reply')
export class ChatReplyController {
  constructor(private readonly chatReplyService: ChatReplyService) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new chat reply' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ChatReplyEntity })
  create(@Body() createChatReplyDto: CreateChatReplyDto): Promise<ChatReplyEntity> {
    return this.chatReplyService.create(createChatReplyDto);
  }

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all chat replie' })
  @ApiResponse({ status: HttpStatus.OK, type: [ChatReplyEntity] })
  findAll(): Promise<ChatReplyEntity[]> {
    return this.chatReplyService.findAll();
  }

  @Version('1')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a chat reply by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ChatReplyEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Chat reply not found' })
  findOne(@Param('id') id: Uuid): Promise<ChatReplyEntity> {
    return this.chatReplyService.findOne(id);
  }

  @Version('1')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a chat reply by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ChatReplyEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Chat reply not found' })
  update(@Param('id') id: Uuid, @Body() updateChatReplyDto: UpdateChatReplyDto): Promise<ChatReplyEntity> {
    return this.chatReplyService.update(id, updateChatReplyDto);
  }

  @Version('1')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a chat reply by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Chat reply successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Chat reply not found' })
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.chatReplyService.remove(id);
  }
}
