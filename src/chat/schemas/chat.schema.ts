import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

//enum for chatType
export enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group',
  LARGECHAT = 'large-chat',
}

//sub schema
@Schema({ _id: false }) // will prevent creation of ids for each entry
class UserInChat {
  @Prop()
  userId: string;

  @Prop()
  username: string;
}

const UserInChatSchema = SchemaFactory.createForClass(UserInChat);

//main schema for chats
@Schema({ timestamps: true })
export class Chat {
  @Prop()
  chatName: string;

  @Prop({ type: String, enum: ChatType })
  chatType: ChatType;

  @Prop({ type: [UserInChatSchema] })
  users: UserInChat[];

  @Prop({ type: UserInChatSchema })
  admin: UserInChat;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
