import { Body, Controller, Get, Query, Post } from '@nestjs/common';
import { MinimizedService } from '../services/minimized.service';

@Controller('api/minimize')
export class MinimizedController {
  constructor(private minimizedService: MinimizedService) {
  }

  @Get(['', 'get'])
  async get(@Query('hash') hash: string) {
    return await this.minimizedService.get(hash);
  }

  @Post(['min'])
  async create(@Body('hash') hash: string, @Body('data') data: string) {
    return await this.minimizedService.create(hash, data);
  }
}
