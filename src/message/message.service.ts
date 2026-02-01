import { Injectable } from '@nestjs/common';
import { MessageDto } from './dtos/create-message.dto';
import { getModelToken, InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { Connection, Model } from 'mongoose';
import { getMessageModel } from './message-model.factory';

@Injectable()
export class MessageService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createMessage(messageDto: MessageDto) {
    const { chatId, senderId, senderName, content } = messageDto;

    const message = await this.messageModel.create({
      chatId,
      senderId,
      senderUsername: senderName,
      content,
    });

    return { message: 'message created!', data: message };
  }

  async createLargeChatMessages(messageDto: MessageDto) {
    const { chatId, senderId, senderName, content } = messageDto;
    const Message = getMessageModel(chatId, this.connection);
    const message = await Message.create({
      chatId,
      senderId,
      senderUsername: senderName,
      content,
    });

    return { message: 'message created!', data: message };
  }

  async getMessagesByChatId(chatId: string) {
    const messages = await this.messageModel.find({ chatId: chatId });
    if (messages.length <= 0) return { message: 'No messages found' };
    return { messages };
  }

  async getLargeChatMessages(chatId: string) {
    const Message = getMessageModel(chatId, this.connection);
    const messages = await Message.find({ chatId: chatId });
    if (messages.length <= 0) return { message: 'No messages found' };
    return { messages };
  }
}
