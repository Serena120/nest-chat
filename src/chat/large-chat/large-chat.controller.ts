import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LargeChatService } from './large-chat.service';
import { ChatDto } from '../dtos/create-chat.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('chat/large-chat')
export class LargeChatController {
  constructor(private largeChatService: LargeChatService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createLargeChat(@Body() chatDto: ChatDto, @Req() req) {
    const { userId, username } = req.user;
    const currentUser = { userId, username };
    return this.largeChatService.CreateLargeChat(chatDto, currentUser);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  async getAllLargeChat() {
    return this.largeChatService.getAllLargeChats();
  }

  @UseGuards(AuthGuard)
  @Post(':chatId/join')
  async joinLargeChat(@Param('chatId') chatId: string, @Req() req) {
    const { userId, username } = req.user;
    const currentUser = { userId, username };
    return this.largeChatService.joinLargeChat(chatId, currentUser);
  }

  @UseGuards(AuthGuard)
  @Post(':chatId/leave')
  async leaveLargeChat(@Param('chatId') chatId: string, @Req() req) {
    const { userId, username } = req.user;
    const currentUser = { userId, username };
    return this.largeChatService.leaveLargeChat(chatId, currentUser);
  }

  // get group
  @UseGuards(AuthGuard)
  @Get(':chatId')
  async getLargeChat(@Param('chatId') chatId: string) {
    return this.largeChatService.getLargeChatById(chatId);
  }
}
