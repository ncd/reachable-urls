import { Test, TestingModule } from '@nestjs/testing';
import { MainController } from '../controller/main.controller';
import { MainService } from '../service/main.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

describe('MainController', () => {
  let mainController: MainController;
  let httpService: HttpService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule, CacheModule.register()],
      controllers: [MainController],
      providers: [MainService],
    }).compile();

    mainController = app.get<MainController>(MainController);
    httpService = app.get<HttpService>(HttpService);

    const response: AxiosResponse<any> = {
      data: ['test'],
      headers: {},
      status: 200,
      statusText: 'OK',
      config: undefined,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    jest.spyOn(httpService, 'head').mockImplementation((url, _config) => {
      if (
        [
          'https://does-not-work.perfume.new',
          'https://doesnt-work.github.com',
        ].indexOf(url) > -1
      ) {
        throw new Error('DNS not resolved');
      } else if (url === 'https://offline.scentronix.com') {
        return of({
          ...response,
          status: 500,
        });
      } else {
        return of(response);
      }
    });
  });

  describe('main', () => {
    it('should return correct data when get all', async () => {
      const result = await mainController.getUrls();
      expect(result).toEqual(
        expect.arrayContaining([
          {
            url: 'http://app.scnt.me',
            priority: 3,
          },
          {
            url: 'https://gitlab.com',
            priority: 4,
          },
          {
            url: 'https://github.com',
            priority: 4,
          },
        ]),
      );
    });

    it('should return correct data when get with priority', async () => {
      const result = await mainController.getUrls(3);
      expect(result).toEqual(
        expect.arrayContaining([
          {
            url: 'http://app.scnt.me',
            priority: 3,
          },
        ]),
      );

      const result1 = await mainController.getUrls(4);
      expect(result1).toEqual(
        expect.arrayContaining([
          {
            url: 'https://gitlab.com',
            priority: 4,
          },
          {
            url: 'https://github.com',
            priority: 4,
          },
        ]),
      );

      const result2 = await mainController.getUrls(2);
      expect(result2).toEqual([]);
    });
  });
});
