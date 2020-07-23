import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { NotificationStatus } from '../core/enums/notication-status.enum';

@Schema()
export class TelegramNotification extends Document {
  @Prop()
  status: NotificationStatus;

  @Prop()
  text: string;

  @Prop()
  date: string;
}

export const TelegramNotificationSchema = SchemaFactory.createForClass(TelegramNotification);
