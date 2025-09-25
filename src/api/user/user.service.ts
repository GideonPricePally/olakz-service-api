import { CursorPaginationDto } from '@/common/dto/cursor-pagination/cursor-pagination.dto';
import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { AccountStatus } from '@/common/types/account.type';
import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { buildPaginator } from '@/utils/cursor-pagination';
import { paginate } from '@/utils/offset-pagination';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { plainToInstance } from 'class-transformer';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { UtilityService } from '../utils/utility-service';
import { ListUserReqDto } from './dto/list-user.req.dto';
import { LoadMoreUsersReqDto } from './dto/load-more-users.req.dto';
import { UpdateUserReqDto } from './dto/update-user.req.dto';
import { UserResDto } from './dto/user.res.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly utilityService: UtilityService,
  ) {}

  async getUserByReferralCode(referral_code: string) {
    return this.userRepository.findOne({ where: { referral_code, status: AccountStatus.ACTIVE } });
  }

  async checkIfUsernameExist(username: string) {
    return !!(await this.userRepository.count({ where: { username } }));
  }

  async create(data: Partial<User>): Promise<User> {
    return await this.userRepository.create(data);
  }

  async save(user_instance: User, entityManager?: EntityManager): Promise<User> {
    if (entityManager) {
      return (await entityManager.save(user_instance)) as User;
    }
    return (await this.userRepository.save(user_instance)) as User;
  }

  async update_password_hash(criteria: string | number | FindOptionsWhere<User>, hash: string, entityManager?: EntityManager) {
    if (entityManager) {
      return entityManager.update(User, criteria, { password: hash });
    }
    return await this.userRepository.update(criteria, { password: hash });
  }

  async update_active_token(criteria: string | number | FindOptionsWhere<User>, data: Partial<User>, entityManager?: EntityManager) {
    if (entityManager) {
      return entityManager.update(User, criteria, data);
    }
    return await this.userRepository.update(criteria, data);
  }

  async update_profile(criteria: string | number | FindOptionsWhere<User>, data: Partial<User>, entityManager?: EntityManager) {
    if (entityManager) return entityManager.update(User, criteria, data);
    return await this.userRepository.update(criteria, data);
  }

  async delete_active_token(criteria: string | number | FindOptionsWhere<User>, entityManager?: EntityManager) {
    return await this.userRepository.update(criteria, { active_token: '', refresh_token: '', token_expires: null });
  }

  async delete_account(userId: string, entityManager?: EntityManager) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    await this.userRepository.update(
      { id: userId },
      {
        active_token: '',
        refresh_token: '',
        status: AccountStatus.DELETED,
        username: `${user.username}-deleted-${user.id}`,
        email: `${user.email}-deleted-${user.id}`,
        mobile: `${user.mobile}-deleted-${user.id}`,
        referral_code: `${user.referral_code}-deleted-${user.id}`,
      },
    );
    if (entityManager) return await entityManager.softDelete(User, { id: userId });
    return await this.userRepository.softDelete({ id: userId });
  }

  async getUserByUsername(username: string, relations?: string[]) {
    return await this.userRepository.findOne({ where: { username, status: AccountStatus.ACTIVE }, relations });
  }

  async multiple_create_save(data: Partial<User>[], entityManager?: EntityManager): Promise<User[]> {
    const user_instances = [];
    for (let index = 0; index < data.length; index++) {
      const instance = await this.userRepository.create(data[index]);
      user_instances.push(instance);
    }
    return (await this.userRepository.save(user_instances, {})) as User[];
  }

  async findAll(reqDto: ListUserReqDto): Promise<OffsetPaginatedDto<UserResDto>> {
    const query = this.userRepository.createQueryBuilder('user').orderBy('user.createdAt', 'DESC');
    const [users, metaDto] = await paginate<User>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });
    return new OffsetPaginatedDto(plainToInstance(UserResDto, users), metaDto);
  }

  async loadMoreUsers(reqDto: LoadMoreUsersReqDto): Promise<CursorPaginatedDto<UserResDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const paginator = buildPaginator({
      entity: User,
      alias: 'user',
      paginationKeys: ['created_at'],
      query: {
        limit: reqDto.limit,
        order: 'DESC',
        afterCursor: reqDto.afterCursor,
        beforeCursor: reqDto.beforeCursor,
      },
    });

    const { data, cursor } = await paginator.paginate(queryBuilder);

    const metaDto = new CursorPaginationDto(data.length, cursor.afterCursor, cursor.beforeCursor, reqDto);

    return new CursorPaginatedDto(plainToInstance(UserResDto, data), metaDto);
  }

  async findOne(id: Uuid): Promise<UserResDto> {
    assert(id, 'id is required');
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Account not found');

    return user.toDto(UserResDto);
  }

  async update(id: Uuid, updateUserDto: UpdateUserReqDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    user.bio = updateUserDto.bio;
    user.updated_by = SYSTEM_USER_ID;

    await this.userRepository.save(user);
  }

  async remove(id: Uuid) {
    await this.userRepository.findOne({ where: { id } });
    await this.userRepository.softDelete(id);
  }
}
