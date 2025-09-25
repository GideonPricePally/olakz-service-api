import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { Prospect } from './entities/prospect.entity';
import { ProspectService } from './prospect.service';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([Prospect])],
  providers: [ProspectService],
  exports: [ProspectService],
})
export class ProspectModule {}
