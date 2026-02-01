import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway({
  namespace: /^\/large-chat\/\w+$/,
  cors: { origin: 'http://localhost:5173', credentials: true },
})
export class LargeChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  nsp: Namespace;

  private logger: Logger = new Logger('LargeChatGateway');

  constructor(
    private jwtService: JwtService,
    private messageService: MessageService,
  ) {}

  afterInit(nsp: Namespace) {
    this.logger.log('Large chat gateway initialized');
  }

  handleConnection(client: Socket) {
    try {
      const chatId = this.extractChatIdFromNamespace(client);
      if (!chatId) {
        client.disconnect();
        return;
      }

      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const userData = this.jwtService.verify(token);
      client.data.user = userData;

      this.logger.log(
        `User: ${userData.username} connected to large-chat ${chatId}`,
      );
    } catch (error) {
      this.logger.error('Authentication failed');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const chatId = this.extractChatIdFromNamespace(client);
    const username = client.data.user.username || 'unknown';
    this.logger.log(`User: ${username} disconnected from largechat`);
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody() data: { chatId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { userId, username } = client.data.user;
      const { chatId, content } = data;

      const messageDto = {
        chatId,
        senderId: userId,
        senderName: username,
        content,
      };

      const message =
        await this.messageService.createLargeChatMessages(messageDto);

      client.nsp.emit('received-message', {
        message,
      });

      this.logger.log('message sent');
    } catch (error) {
      this.logger.error('send-message failed:', error);
    }
  }

  private extractChatIdFromNamespace(socket: Socket): string | null {
    const namespaceName = socket.nsp.name;
    const match = namespaceName.match(/^\/large-chat\/(\w+)$/);
    return match ? match[1] : null;
  }
}
