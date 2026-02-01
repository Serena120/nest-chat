import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatService } from './chat.service';

@Controller('chat/private')
export class ChatController {
  constructor(private chatService: ChatService) {}

  //temp place -> change later
  @UseGuards(AuthGuard)
  @Get('chat-list')
  async getUserChatList(@Req() req) {
    const { userId } = req.user;
    return this.chatService.getUserChatList(userId);
  }

  //get or create new private chat
  @UseGuards(AuthGuard)
  @Get(':receiverId')
  async getOrCreatePrivateChat(
    @Param('receiverId') receiverId: string,
    @Req() req,
  ) {
    console.log(req.user);
    const { userId, username } = req.user;
    const currentUser = { userId, username };
    return this.chatService.getOrCreatePrivateChat(receiverId, currentUser);
  }
}
