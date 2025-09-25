import { Test, TestingModule } from '@nestjs/testing';
import { ChatReplyService } from './chat_reply.service';

describe('ChatReplyService', () => {
  let service: ChatReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatReplyService],
    }).compile();

    service = module.get<ChatReplyService>(ChatReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
