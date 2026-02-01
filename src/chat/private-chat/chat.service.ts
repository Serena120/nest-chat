import { BadRequestException, ConsoleLogger, Injectable } from '@nestjs/common';
import { Chat, ChatDocument } from '../schemas/chat.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  //chatlist
  async getUserChatList(userId: string) {
    const chats = await this.chatModel.find({
      'users.userId': userId,
    });
    return { chats, currUserId: userId };
  }

  //get or create a private chat
  async getOrCreatePrivateChat(
    rId: string,
    currUser: { userId: string; username: string },
  ) {
    const receiverId = rId;

    const receiver = await this.userModel.findOne({ _id: receiverId });

    if (!receiver)
      throw new BadRequestException(
        "invalid receiver id/receiver doesn't exist",
      );

    const chat = await this.chatModel.findOne({
      chatType: 'private',
      $and: [
        { 'users.userId': currUser.userId },
        { 'users.userId': receiverId },
      ],
    });

    if (chat) {
      return chat;
    }

    const newChat = await this.chatModel.create({
      chatType: 'private',
      users: [
        { userId: currUser.userId, username: currUser.username },
        { userId: receiverId, username: receiver.username },
      ],
    });

    return newChat;
  }
}
