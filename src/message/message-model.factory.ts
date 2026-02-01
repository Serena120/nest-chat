import { Model, Connection, connect } from 'mongoose';
import { MessageSchema } from './schemas/message.schema';

const modelCache: Record<string, Model<any>> = {};

export function getMessageModel(
  chatId: string,
  connection: Connection,
): Model<any> {
  const collectionName = `messages-${chatId}`;

  if (modelCache[collectionName]) {
    return modelCache[collectionName];
  }

  const model = connection.model(collectionName, MessageSchema, collectionName);

  modelCache[collectionName] = model;

  return model;
}
