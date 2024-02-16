import { Module } from '@nestjs/common';
import { MainController } from './main/controller/main.controller';
import { MainService } from './main/service/main.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    HttpModule.register({
      timeout: 300000, // Cache in 5 minutes
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [MainController],
  providers: [MainService],
})
export class AppModule {}
