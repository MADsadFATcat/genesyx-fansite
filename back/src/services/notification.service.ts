import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from '../db/notification.schema';
import { Model } from 'mongoose';
import { NotificationType } from '../core/enums/notification-type.enum';
import * as moment from 'moment';
import constants from '../core/constants';

@Injectable()
export class NotificationService {
  constructor(@InjectModel(Notification.name) private readonly notificationModel: Model<Notification>) {
  }

  public async create(
    dateFrom: string,
    dateTo: string,
    type: NotificationType,
    title: string,
    text: string): Promise<Notification> {
    const notification = new this.notificationModel();
    notification.dateFrom = dateFrom;
    notification.dateTo = dateTo;
    notification.type = type;
    notification.title = title;
    notification.text = text;
    return notification.save();
  }

  public async ifExistsRatsDetection(): Promise<boolean> {
    return this.notificationModel
      .exists({
        type: NotificationType.ratsDetected,
        dateFrom: {
          $gt: moment.utc().subtract(3, 'hours').format(constants.isoDateTimeFormat),
        },
      });
  }

  public async get(): Promise<Notification[]> {
    const now = moment.utc().add(3, 'hour').format(constants.isoDateTimeFormat);

    return this.notificationModel
      .find({ dateFrom: { $lt: now }, dateTo: { $gt: now } })
      .sort({ dateTo: 'desc', dateFrom: 'desc' });
  }

  public async getLastRats(): Promise<Notification[]> {
    return this.notificationModel
      .find({ type: NotificationType.ratsAttack })
      .sort({ dateTo: 'desc', dateFrom: 'desc' })
      .limit(10);
  }
}
