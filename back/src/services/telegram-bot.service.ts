import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { ConfigService } from '@nestjs/config';
import { TelegramNotificationService } from './telegram-notification.service';
import { NotificationStatus } from '../core/enums/notication-status.enum';
import * as moment from 'moment';
import constants from '../core/constants';
import { NotificationService } from './notification.service';
import { NotificationType } from '../core/enums/notification-type.enum';
import { ConversationService } from './conversation.service';

@Injectable()
export class TelegramBotService {
  private bot: TelegramBot;

  constructor(
    private configService: ConfigService,
    private telegramNotificationService: TelegramNotificationService,
    private notificationService: NotificationService,
    private conversationService: ConversationService) {

    const isEnabled = this.configService.get('ENABLE_TELEGRAM_BOT') === '1';
    if (!isEnabled)
      return;

    const token = this.configService.get('TELEGRAM_BOT_TOKEN');
    const adminId = this.configService.get('TELEGRAM_ADMIN_ID');

    this.bot = new TelegramBot(token, { polling: true });

    this.bot.onText(/telegram:(.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      if (chatId != adminId)
        return;

      const now = moment.utc().add(3, 'hours').format(constants.isoDateTimeFormat);
      await this.telegramNotificationService.create(match[1], now, NotificationStatus.new);
    });

    this.bot.onText(/extension:(.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      if (chatId != adminId)
        return;

      const now = moment.utc().add(3, 'hours');
      const from = now.format(constants.isoDateTimeFormat);
      const to = now.clone().add(1, 'hours').format(constants.isoDateTimeFormat);
      await this.notificationService.create(from, to, NotificationType.news, 'Новость', match[1]);
    });

    this.bot.onText(/users/, async (msg) => {
      const chatId = msg.chat.id;
      if (chatId != adminId)
        return;

      const conversions = await this.conversationService.getAll();
      const response = conversions.map(c => c.name).join('\n');

      if (response)
        await this.bot.sendMessage(chatId, response);
    });

    this.bot.onText(/\/rats|\/крысы/, async (msg) => {
      const lastRats = await this.notificationService.getLastRats();

      const response = lastRats.map(c => `${c.dateFrom} ${c.text}`).join('\n');
      if (response)
        await this.bot.sendMessage(msg.chat.id, response);
    });

    this.bot.onText(/\/download|\/скачать/, async (msg) => {
      await this.bot.sendMessage(msg.chat.id, 'Скачать расширение для браузера можно тут:\n' +
        'Chrome https://chrome.google.com/webstore/detail/genesyx-game-helper/iclnmbgdedngcclmfjpkfjljakllneij \n' +
        'Firefox https://addons.mozilla.org/ru/firefox/addon/genesyx-game-helper/');
    });

    this.bot.onText(/\/website|\/сайт/, async (msg) => {
      await this.bot.sendMessage(msg.chat.id, 'Сайт тут https://helper.evolution-genesyx.ru/');
    });

    this.bot.onText(/\/email|\/почта/, async (msg) => {
      await this.bot.sendMessage(msg.chat.id, 'Писать сюда genesyxhelper@gmail.com');
    });

    this.bot.on('message', async (msg) => {
      await this.conversationService.createIfNotExists(msg.chat.id.toString(), `${msg.from.username}|${msg.from.first_name}|${msg.from.last_name}`);
    });
  }

  public async sendToAll(text: string): Promise<any> {
    const isEnabled = this.configService.get('ENABLE_TELEGRAM_BOT') === '1';
    if (!isEnabled)
      return;

    const conversations = await this.conversationService.getAll();
    for (const conversation of conversations) {
      try {
        await this.bot.sendMessage(conversation.chatId, text);
      } catch (e) {
        if (e.message.indexOf('bot was blocked') !== -1)
          await this.conversationService.delete(conversation._id);
      }
    }
  }
}
