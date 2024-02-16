import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { MainService } from '../service/main.service';
import { Url } from '../interface/main.interface';
import { ParseIntPipe } from '@nestjs/common';

@Controller('urls')
export class MainController {
  constructor(private readonly appService: MainService) {}

  @ApiQuery({
    name: 'priority',
    description:
      'Priority to filter the urls, if not provided, all online urls will be returned.',
    required: false,
    type: Number,
  })
  @Get()
  async getUrls(
    @Query('priority', new ParseIntPipe({ optional: true })) priority?: number,
  ): Promise<Url[]> {
    return await this.appService.getUrls(priority);
  }
}
