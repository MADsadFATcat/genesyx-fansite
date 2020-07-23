import { Module, HttpModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { HealthController } from './controllers/health.controller';
import { NotificationController } from './controllers/notification.controller';
import { MinimizedController } from './controllers/minimized.controller';

import { Notification, NotificationSchema } from './db/notification.schema';
import { Minimized, MinimizedSchema } from './db/minimized.schema';
import { TelegramNotification, TelegramNotificationSchema } from './db/telegram-notification.schema';
import { Conversation, ConversationSchema } from './db/conversation.schema';

import { RatsSchedule } from './schedules/rats.schedule';
import { TelegramSchedule } from './schedules/telegram.schedule';

import { GameService } from './services/game.service';
import { NotificationService } from './services/notification.service';
import { MinimizedService } from './services/minimized.service';
import { TelegramNotificationService } from './services/telegram-notification.service';
import { ConversationService } from './services/conversation.service';
import { TelegramBotService } from './services/telegram-bot.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
      {
        name: Minimized.name,
        schema: MinimizedSchema,
      },
      {
        name: TelegramNotification.name,
        schema: TelegramNotificationSchema,
      },
      {
        name: Conversation.name,
        schema: ConversationSchema,
      },
    ]),
    HttpModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'front'),
    }),
  ],
  controllers: [
    HealthController,
    NotificationController,
    MinimizedController,
  ],
  providers: [
    RatsSchedule,
    TelegramSchedule,
    GameService,
    NotificationService,
    MinimizedService,
    TelegramNotificationService,
    ConversationService,
    TelegramBotService,
  ],
})
export class AppModule {
}
