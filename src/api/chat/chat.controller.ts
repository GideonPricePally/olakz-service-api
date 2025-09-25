import { Uuid } from '@/common/types/common.type';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Version } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat as ChatEntity } from './entities/chat.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ChatEntity })
  create(@Body() createChatDto: CreateChatDto): Promise<ChatEntity> {
    return this.chatService.create(createChatDto);
  }

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all chat' })
  @ApiResponse({ status: HttpStatus.OK, type: [ChatEntity] })
  findAll(): Promise<ChatEntity[]> {
    return this.chatService.findAll();
  }

  @Version('1')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a chat by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ChatEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Chat not found' })
  findOne(@Param('id') id: Uuid): Promise<ChatEntity> {
    return this.chatService.findOne(id);
  }

  @Version('1')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a chat by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ChatEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Chat not found' })
  update(@Param('id') id: Uuid, @Body() updateChatDto: UpdateChatDto): Promise<ChatEntity> {
    return this.chatService.update(id, updateChatDto);
  }

  @Version('1')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a chat by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Chat successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Chat not found' })
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.chatService.remove(id);
  }
}
