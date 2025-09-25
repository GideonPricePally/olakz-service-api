import { QueueName, QueuePrefix } from '@/constants/job.constant';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ApiHelper } from './api-helper';
import { ConfigReaderService } from './config-reader.service';
import { CsvService } from './csv.reader';
import { DataManagerService } from './data-manager.service';
import { LoggerService } from './logger-service';
import { NotificationService } from './notification-service';
import { RemoteService } from './remote-service';
import { UtilityService } from './utility-service';
@Module({
  imports: [
    JwtModule.register({}),
    BullModule.registerQueue({
      name: QueueName.EMAIL,
      prefix: QueuePrefix.AUTH,
      streams: {
        events: {
          maxLen: 1000,
        },
      },
    }),
    HttpModule,
  ],
  providers: [ApiHelper, DataManagerService, UtilityService, LoggerService, NotificationService, CsvService, ConfigReaderService, RemoteService],
  exports: [ApiHelper, DataManagerService, UtilityService, LoggerService, NotificationService, CsvService, ConfigReaderService, RemoteService],
})
export class UtilsModule {}
