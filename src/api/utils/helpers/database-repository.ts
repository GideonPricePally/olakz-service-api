import { Cache, Milliseconds } from 'cache-manager';
import * as moment from 'moment';
import { EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectId, Repository, SaveOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { v4 as UUID3 } from 'uuid';

export class DatabaseRepository<T> {
  constructor(
    private cacheManager: Cache,
    private repo: Repository<T>,
  ) {}

  async find(condition?: FindManyOptions<T>) {
    const list = await this.repo.find(condition);
    return list;
  }

  async update(criteria: string | number | FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>, entityManager?: EntityManager) {
    if (entityManager) {
      return await entityManager.update(this.repo.target, criteria, { ...partialEntity, updated_at: moment.utc().format() });
    }
    return await this.repo.update(criteria, { ...partialEntity, updated_at: moment.utc().format() });
  }

  async increment(criteria: FindOptionsWhere<T>, field_name: string, value: number, entityManager?: EntityManager) {
    await this.update(criteria, { updated_at: moment.utc().format() } as unknown as QueryDeepPartialEntity<T>, entityManager);
    return this.repo.increment(criteria, field_name, value);
  }

  async findOne(condition: FindOneOptions<T>) {
    const list = await this.repo.findOne(condition);
    return list;
  }

  async count(options?: FindManyOptions<T>) {
    return await this.repo.count(options);
  }

  async create(data: Partial<T>) {
    // Create an instance of the entity from the provided data
    const instance = await this.repo.create(data as T);
    const date_of_create = moment.utc().format();
    instance['created_date'] = date_of_create;
    instance['updated_at'] = date_of_create;
    if (!instance['id']) {
      instance['id'] = new (this.repo.target as any)()?.get_prefix() + '_' + UUID3();
    }

    return instance;
  }

  async save(data: T | T[], options?: SaveOptions, entityManager?: EntityManager): Promise<T | T[]> {
    if (entityManager) {
      return entityManager.save(data, options);
    }
    if (Array.isArray(data)) {
      // Save array of entities
      const updated_at = moment.utc().format();
      return await this.repo.save(data?.map((_) => ({ ..._, updated_at })) as T[], options);
    } else {
      // Save a single entity
      return await this.repo.save({ ...data, updated_at: moment.utc().format() } as T, options);
    }
  }

  async delete(criteria: string | number | Date | ObjectId | string[] | number[] | Date[] | ObjectId[] | FindOptionsWhere<T>) {
    return this.repo.delete(criteria);
  }

  toObject(data: T, permitted_role_keys: string[] = []): T {
    return Object.fromEntries(Object.entries({ ...data }).filter(([key]) => permitted_role_keys?.includes(key))) as T;
  }

  private async getCacheValue(key: string) {
    const value = await this.cacheManager.get(key);
    return value;
  }

  private async setCacheValue(key: string, value: unknown, ttl: Milliseconds = 0) {
    return await this.cacheManager.set(key, value, ttl);
  }

  private async removeCacheItem(key: string) {
    return await this.cacheManager.del(key);
  }

  private async resetCache() {
    return await this.cacheManager.reset();
  }
}
