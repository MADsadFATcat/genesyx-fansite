import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Minimized extends Document {

  @Prop()
  hash: string;

  @Prop()
  data: string;
}

export const MinimizedSchema = SchemaFactory.createForClass(Minimized);
