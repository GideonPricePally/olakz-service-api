import { Test, TestingModule } from '@nestjs/testing';
import { ChatReplyController } from './chat_reply.controller';
import { ChatReplyService } from './chat_reply.service';

describe('ChatReplyController', () => {
  let controller: ChatReplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatReplyController],
      providers: [ChatReplyService],
    }).compile();

    controller = module.get<ChatReplyController>(ChatReplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
