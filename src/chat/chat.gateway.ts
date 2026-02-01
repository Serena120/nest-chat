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
import { Socket, Server } from 'socket.io';
import { JwtGuard } from 'src/auth/jwt.guard';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173', credentials: true },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private jwtService: JwtService,
    private messageService: MessageService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Websocket gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
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
        `Client connected ${userData.username}, ${client.data.user.username}`,
      );
    } catch (error) {
      this.logger.error('invalid token, disconnecting client');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`socket disconnected:${client.data.user.username}`);
  }

  @SubscribeMessage('join-room')
  handleRoomJoin(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.chatId);
    this.server
      .to(data.chatId)
      .emit('user-joined', `user joined the room ${data.chatId}`);
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody()
    data: {
      chatId: string;
      content: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, username } = client.data.user;
    const { chatId, content } = data;

    const messageDto = {
      chatId,
      senderId: userId,
      senderName: username,
      content,
    };

    const message = await this.messageService.createMessage(messageDto);

    this.server.to(chatId).emit('received-message', {
      message,
    });
  }
}
