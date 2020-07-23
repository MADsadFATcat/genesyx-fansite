import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationStatus } from '../core/enums/notication-status.enum';
import { TelegramNotification } from '../db/telegram-notification.schema';
import * as moment from 'moment';
import constants from '../core/constants';

@Injectable()
export class TelegramNotificationService {
  constructor(@InjectModel(TelegramNotification.name) private readonly telegramNotificationModel: Model<TelegramNotification>) {
  }

  public async create(text: string, date: string, status: NotificationStatus): Promise<TelegramNotification> {
    const notification = new this.telegramNotificationModel();
    notification.text = text;
    notification.date = date;
    notification.status = status;
    return notification.save();
  }

  public async getAllForSend(): Promise<TelegramNotification[]> {
    const now = moment.utc().add(3, 'hour').format(constants.isoDateTimeFormat);

    return this.telegramNotificationModel.find({ status: NotificationStatus.new, date: { $lt: now } });
  }

  public async setAsSent(id: string): Promise<TelegramNotification> {
    return this.telegramNotificationModel.updateOne({ _id: id }, { status: NotificationStatus.sent });
  }
}
