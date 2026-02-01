import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @UseGuards(AuthGuard)
  @Get(':chatId/large-chats')
  async getLargechatMessages(@Param('chatId') chatId: string) {
    return this.messageService.getLargeChatMessages(chatId);
  }

  @UseGuards(AuthGuard)
  @Get(':chatId')
  async getMessagesByChatId(@Param('chatId') chatId: string) {
    return this.messageService.getMessagesByChatId(chatId);
  }
}
