import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatReplyController } from './chat_reply.controller';
import { ChatReplyService } from './chat_reply.service';
import { ChatReply } from './entities/chat_reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatReply])],
  controllers: [ChatReplyController],
  providers: [ChatReplyService],
})
export class ChatReplyModule {}
