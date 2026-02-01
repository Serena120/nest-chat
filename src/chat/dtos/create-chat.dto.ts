import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ChatType } from '../schemas/chat.schema';
import { UserInChatDto } from './user-in-chat.dto';
import { Type } from 'class-transformer';

export class ChatDto {
  @IsOptional()
  @IsString()
  chatName: string; // this had a question mark before

  // @IsArray()
  @IsOptional()
  @ValidateNested({ each: true }) // to check if both are following the userInchat dto rules
  @Type(() => UserInChatDto) // to transform nested objects
  users: UserInChatDto[];

  // @ValidateNested()
  // @Type(() => UserInChatDto)
  // admin: UserInChatDto;
}
