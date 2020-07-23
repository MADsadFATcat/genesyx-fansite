import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { NotificationType } from '../core/enums/notification-type.enum';

@Schema()
export class Notification extends Document {
  @Prop()
  type: NotificationType;

  @Prop()
  dateFrom: string;

  @Prop()
  dateTo: string;

  @Prop()
  title: string;

  @Prop()
  text: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
