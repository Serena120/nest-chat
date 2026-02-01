import { IsMongoId, IsString } from 'class-validator';

export class UserInChatDto {
  @IsMongoId()
  userId: string;

  @IsString()
  username: string;
}
