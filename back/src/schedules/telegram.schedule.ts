import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TelegramBotService } from '../services/telegram-bot.service';
import { TelegramNotificationService } from '../services/telegram-notification.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramSchedule {

  constructor(
    private configService: ConfigService,
    private telegramNotificationService: TelegramNotificationService,
    private telegramBotService: TelegramBotService,
  ) {
  }

  @Cron('0 * * * * *')
  async checkNotifications() {
    const isEnabled = this.configService.get('ENABLE_TELEGRAM_BOT') === '1';
    if (!isEnabled)
      return;

    const newNotifications = await this.telegramNotificationService.getAllForSend();
    if (!newNotifications.length)
      return;

    for (const notification of newNotifications) {
      await this.telegramBotService.sendToAll(notification.text);
      await this.telegramNotificationService.setAsSent(notification._id);
    }
  }
}
