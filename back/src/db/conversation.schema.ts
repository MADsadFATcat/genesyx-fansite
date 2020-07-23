import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Conversation extends Document {

  @Prop({ index: { unique: true } })
  chatId: string;

  @Prop()
  name: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
