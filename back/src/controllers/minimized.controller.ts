import { Body, Controller, Get, Query, Post } from '@nestjs/common';
import { MinimizedService } from '../services/minimized.service';
import * as _ from 'lodash';

@Controller('api/minimize')
export class MinimizedController {
  constructor(private minimizedService: MinimizedService) {
  }

  @Get(['', 'get'])
  async get(@Query('hash') hash: string) {
    const minimized = await this.minimizedService.get(hash);
    return _.get(minimized, 'data', '');
  }

  @Post(['min'])
  async create(@Body('hash') hash: string, @Body('data') data: string) {
    return await this.minimizedService.create(hash, data);
  }
}
