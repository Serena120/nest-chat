import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { ChatDto } from '../dtos/create-chat.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('chat/group')
export class GroupChatController {
  constructor(private groupChatService: GroupChatService) {}

  // create group
  @UseGuards(AuthGuard)
  @Post('create')
  async createGroup(@Body() chatDto: ChatDto, @Req() req) {
    const { userId, username } = req.user;
    const currentUser = { userId, username };
    return this.groupChatService.createGroup(chatDto, currentUser);
  }

  // get group
  @UseGuards(AuthGuard)
  @Get(':chatId')
  async getGroupChat(@Param('chatId') chatId: string) {
    return this.groupChatService.getGroupById(chatId);
  }
}
