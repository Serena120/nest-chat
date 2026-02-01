import { IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  chatId: string;

  @IsString()
  senderId: string;

  @IsString()
  senderName: string;

  @IsString()
  content: string;
}
