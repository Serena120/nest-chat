import { Test, TestingModule } from '@nestjs/testing';
import { LargeChatService } from './large-chat.service';

describe('LargeChatService', () => {
  let service: LargeChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LargeChatService],
    }).compile();

    service = module.get<LargeChatService>(LargeChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
