import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type MessageDocument = HydratedDocument<Message>;

@Schema({timestamps: true})
export class Message {
    @Prop()
    chatId: mongoose.Types.ObjectId
    
    @Prop()
    senderId: mongoose.Types.ObjectId

    @Prop()
    senderUsername: string

    @Prop()
    content: string
}

export const MessageSchema = SchemaFactory.createForClass(Message)