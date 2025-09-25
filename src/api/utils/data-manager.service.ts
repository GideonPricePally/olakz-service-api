import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { DatabaseRepository } from './helpers/database-repository';

@Injectable()
export class DataManagerService {
  private logger = new Logger(DataManagerService.name);
  private repo!: Repository<unknown>;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private dataSource: DataSource,
  ) {}

  useRepository<T>(repo: Repository<T>): DatabaseRepository<T> {
    this.repo = repo;
    return new DatabaseRepository(this.cacheManager, repo);
  }

  async transaction(func: (manager: EntityManager) => Promise<void>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await func(queryRunner.manager);

      await queryRunner.commitTransaction();
      if (queryRunner.isReleased === false) {
        await queryRunner.release();
      }
    } catch (error) {
      this.logger.error({ MESSAGES: 'transaction wrapper triggering an error', ...error });
      await queryRunner.rollbackTransaction();
      if (queryRunner.isReleased === false) {
        await queryRunner.release();
      }
      throw error;
    }
  }
}
