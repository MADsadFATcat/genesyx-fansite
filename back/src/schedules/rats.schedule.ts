import { Injectable } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { Cron } from '@nestjs/schedule';
import { Notification } from '../db/notification.schema';
import { NotificationStatus } from '../core/enums/notication-status.enum';
import { NotificationType } from '../core/enums/notification-type.enum';
import { NotificationService } from '../services/notification.service';
import * as moment from 'moment';
import constants from '../core/constants';
import { TelegramNotificationService } from '../services/telegram-notification.service';

@Injectable()
export class RatsSchedule {
  private ratDetected = false;

  constructor(
    private gameService: GameService,
    private notificationService: NotificationService,
    private telegramNotificationService: TelegramNotificationService,
  ) {
  }

  @Cron('0 * * * * *')
  async checkRats() {
    const ratDetected = await this.gameService.isRatAtJunkyard();
    if (ratDetected) {
      await this.createRatsDetectedNotificationIfNotExists();
    } else {
      if (this.ratDetected) {
        await this.createRatsAttackNotification();
      }
    }

    this.ratDetected = ratDetected;
  }

  private async createRatsDetectedNotificationIfNotExists(): Promise<Notification> {

    if (await this.notificationService.ifExistsRatsDetection())
      return;

    const now = moment.utc().add(3, 'hour');

    await this.notificationService.create(
      now.format(constants.isoDateTimeFormat),
      now.clone().add(50, 'minutes').format(constants.isoDateTimeFormat),
      NotificationType.ratsDetected,
      'Крысы',
      `В ${now.format(constants.shortTimeFormat)} на свалке были обнаружены животные`,
    );
    await this.telegramNotificationService.create(
      `В ${now.format(constants.shortTimeFormat)} на свалке были обнаружены животные`,
      now.format(constants.isoDateTimeFormat),
      NotificationStatus.new);

    await this.notificationService.create(
      now.clone().add(50, 'minutes').format(constants.isoDateTimeFormat),
      now.clone().add(60, 'minutes').format(constants.isoDateTimeFormat),
      NotificationType.ratsReady,
      'Крысы',
      `В ${now.clone().add(60, 'minutes').format(constants.shortTimeFormat)} животные будут готовы атаковать, ждите начала боя`,
    );
    await this.telegramNotificationService.create(
      `В ${now.clone().add(60, 'minutes').format(constants.shortTimeFormat)} животные будут готовы атаковать, ждите начала боя`,
      now.clone().add(50, 'minutes').format(constants.isoDateTimeFormat),
      NotificationStatus.new);
  }

  private async createRatsAttackNotification() {
    const now = moment.utc().add(3, 'hour');

    await this.notificationService.create(
      now.format(constants.isoDateTimeFormat),
      now.clone().add(30, 'minutes').format(constants.isoDateTimeFormat),
      NotificationType.ratsAttack,
      'Крысы',
      `Животные атаковали`,
    );
    await this.telegramNotificationService.create(
      `Животные атаковали`,
      now.format(constants.isoDateTimeFormat),
      NotificationStatus.new);
  }
}
