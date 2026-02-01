import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatDto } from '../dtos/create-chat.dto';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from '../schemas/chat.schema';

@Injectable()
export class GroupChatService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
  ) {}

  // create group
  async createGroup(
    chatDto: ChatDto,
    currUser: { userId: string; username: string },
  ) {
    const { userId, username } = currUser;
    const { chatName, users } = chatDto;
    const participantIds = [...chatDto.users.map((user) => user.userId)];

    const allParticipantsExist = await this.userModel.find({
      _id: { $in: participantIds },
    });

    if (
      !allParticipantsExist ||
      allParticipantsExist.length !== participantIds.length
    ) {
      throw new BadRequestException('one or more users do not exist');
    }

    const group = await this.chatModel.create({
      chatName,
      chatType: 'group',
      users: [...users, { userId, username }],
      admin: { userId, username },
    });

    return { group };
  }

  // get group
  async getGroupById(chatId: string) {
    const group = await this.chatModel.findOne({ _id: chatId });
    if (!group) throw new BadRequestException("group doesn't exist");
    return { group };
  }
}
