import { Test, TestingModule } from '@nestjs/testing';
import { LargeChatController } from './large-chat.controller';

describe('LargeChatController', () => {
  let controller: LargeChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LargeChatController],
    }).compile();

    controller = module.get<LargeChatController>(LargeChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
