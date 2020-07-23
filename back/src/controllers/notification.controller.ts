import { Controller, Get } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';

@Controller('api/notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {
  }

  @Get(['', 'get'])
  async get() {
    return await this.notificationService.get();
  }
}
