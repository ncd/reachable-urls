import { Inject, Injectable } from '@nestjs/common';
import { Url } from '../interface/main.interface';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class MainService {
  private readonly urls: Url[] = [
    {
      url: 'https://does-not-work.perfume.new',
      priority: 1,
    },
    {
      url: 'https://gitlab.com',
      priority: 4,
    },
    {
      url: 'https://github.com',
      priority: 4,
    },
    {
      url: 'https://doesnt-work.github.com',
      priority: 4,
    },
    {
      url: 'http://app.scnt.me',
      priority: 3,
    },
    {
      url: 'https://offline.scentronix.com',
      priority: 2,
    },
  ];
  private useCache: boolean;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.useCache = this.configService.get<boolean>('USECACHE', false);
  }

  async getUrls(priority?: number): Promise<Url[]> {
    const result = await Promise.all(
      this.urls.map(async (url) => {
        return this.getOnlineWithCache(url);
      }),
    );
    return result
      .filter((url) => url !== null)
      .filter((url) => {
        return priority ? url.priority === priority : true;
      })
      .sort((a, b) => a.priority - b.priority);
  }

  private async getOnlineWithCache(url: Url): Promise<Url | null> {
    let response = null;
    try {
      if (this.useCache === true) {
        console.log('Read from cache for key ' + url.url);
        response = await this.cacheManager.get(url.url);
        if (response) {
          console.log('Cache found for key' + url.url);
        }
      }
      if (!response) {
        response = await lastValueFrom(this.httpService.head(url.url));
        if (this.useCache === true) {
          await this.cacheManager.set(url.url, response);
        }
      }
      if (response.status >= 200 && response.status < 300) {
        return url;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
}
