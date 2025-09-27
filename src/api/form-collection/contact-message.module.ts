import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormCollectionController } from './contact-message.controller';
import { ContactMessageService } from './contact-message.service';
import { ContactMessage } from './entities/contact-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessage])],
  controllers: [FormCollectionController],
  providers: [ContactMessageService],
  exports: [ContactMessageService],
})
export class FormCollectionModule {}
