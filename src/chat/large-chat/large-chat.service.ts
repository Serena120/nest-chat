import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { Chat, ChatDocument } from '../schemas/chat.schema';
import { Model, Types } from 'mongoose';
import { ChatDto } from '../dtos/create-chat.dto';

@Injectable()
export class LargeChatService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
  ) {}

  async CreateLargeChat(
    chatDto: ChatDto,
    currUser: { userId: string; username: string },
  ) {
    const { userId, username } = currUser;

    const { chatName } = chatDto;

    const largeChat = await this.chatModel.create({
      chatName,
      chatType: 'large-chat',
      users: [{ userId, username }],
      admin: { userId, username },
    });

    return { message: 'large-chat created', data: largeChat };
  }

  async getAllLargeChats() {
    const largeChats = await this.chatModel.find({ chatType: 'large-chat' });
    return { largeChats };
  }

  async getLargeChatById(chatId: string) {
    const largeChat = await this.chatModel.findOne({ _id: chatId });
    if (!largeChat) throw new BadRequestException("largechat doesn't exist");
    return { message: 'chat found!', data: largeChat };
  }

  async joinLargeChat(
    chatId: string,
    currUser: { userId: string; username: string },
  ) {
    const { userId, username } = currUser;
    console.log(chatId);
    const largeChat = await this.chatModel.findOne({ _id: chatId });

    if (!largeChat) throw new BadRequestException("Largechat doesn't exist");

    const alreadyJoined = largeChat.users.find(
      (u) => u.userId.toString() === userId,
    );

    if (alreadyJoined) {
      return { message: 'user is already a member of this chat', joined: true };
    }
    largeChat.users.push({ userId, username });
    await largeChat.save();

    return { message: 'largeChat joined!', data: largeChat };
  }

  async leaveLargeChat(
    chatId: string,
    currUser: { userId: string; username: string },
  ) {
    const { userId } = currUser;

    const largechat = await this.chatModel.findOne({ _id: chatId });

    if (!largechat) throw new BadRequestException("largechat doesn't exist");

    largechat.users = largechat.users.filter(
      (u) => u.userId.toString() !== userId,
    );

    await largechat.save();

    return { message: 'largechat left', data: largechat };
  }
}
