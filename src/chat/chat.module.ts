import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './private-chat/chat.service';
import { ChatController } from './private-chat/chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { GroupChatController } from './group-chat/group-chat.controller';
import { GroupChatService } from './group-chat/group-chat.service';
import { LargeChatController } from './large-chat/large-chat.controller';
import { LargeChatService } from './large-chat/large-chat.service';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from 'src/message/message.module';
import { LargeChatGateway } from './largechat.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    AuthModule,
    UserModule,
    MessageModule,
  ],
  providers: [
    ChatService,
    GroupChatService,
    LargeChatService,
    ChatGateway,
    LargeChatGateway,
  ],
  controllers: [ChatController, GroupChatController, LargeChatController],
  exports: [MongooseModule, ChatService, ChatGateway],
})
export class ChatModule {}
