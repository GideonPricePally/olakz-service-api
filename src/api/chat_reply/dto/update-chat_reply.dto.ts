import { PartialType } from '@nestjs/swagger';
import { CreateChatReplyDto } from './create-chat_reply.dto';

export class UpdateChatReplyDto extends PartialType(CreateChatReplyDto) {}
