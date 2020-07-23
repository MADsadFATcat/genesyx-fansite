import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TelegramBotService } from '../services/telegram-bot.service';
import { TelegramNotificationService } from '../services/telegram-notification.service';

@Injectable()
export class TelegramSchedule {

  constructor(
    private telegramNotificationService: TelegramNotificationService,
    private telegramBotService: TelegramBotService,
  ) {
  }

  @Cron('0 * * * * *')
  async checkNotifications() {
    const newNotifications = await this.telegramNotificationService.getAllForSend();
    if (!newNotifications.length)
      return;

    for (const notification of newNotifications) {
      await this.telegramBotService.sendToAll(notification.text);
      await this.telegramNotificationService.setAsSent(notification._id);
    }
  }
}
