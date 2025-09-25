import { UserPayload } from '@/common/types/common.type';
import { CacheKey } from '@/constants/cache.constant';
import { createCacheKey } from '@/utils/cache.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import argon2 from 'argon2';
import { Cache, Milliseconds } from 'cache-manager';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import * as moment from 'moment';
import ms from 'ms';
import { promisify } from 'util';
import { v4 as UUID3 } from 'uuid';
import { ConfigReaderService } from './config-reader.service';

@Injectable()
export class UtilityService {
  constructor(
    private readonly configService: ConfigReaderService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  static generateEntityId(id: string, prefix: string) {
    return prefix + '_' + UUID3();
  }

  async hashPassword(value: string) {
    try {
      return await argon2.hash(value);
    } catch (err) {
      console.error(err);
      throw new Error('Can not hash password.');
    }
  }

  async verifyPassword(password: string, hash: string) {
    try {
      return await argon2.verify(hash, password);
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  generateReferralCode() {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRST';
    let refferal = '';
    for (let i = 0; i < 10; i++) {
      refferal += characters[Math.floor(Math.random() * characters.length)];
    }
    return `MT${refferal}`;
  }

  isEmail(username: string) {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(username);
  }

  isIntlNumber(username: string) {
    return /^\+\d{1,3}\d{7,14}$/g.test(username);
  }

  generateAvatar() {
    const seed_list = ['easton', 'emery', 'sarah', 'oliver', 'maria', 'nolan', 'sara', 'luis', 'ryan'];
    return seed_list[Math.round(Math.random() * seed_list.length)];
  }

  generateAltName(prev_count: number) {
    return `player${(prev_count + 1).toString().padStart(6, '0')}`;
  }

  async encrypt(textToEncrypt: string) {
    const iv = randomBytes(16);
    const password = 'Password used to generate key';

    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ccm', key, iv);

    const encryptedText = Buffer.concat([cipher.update(textToEncrypt), cipher.final()]);

    return encryptedText;
  }

  async decrypt(encryptedText: NodeJS.ArrayBufferView) {
    const iv = randomBytes(16);
    const password = 'Password used to generate key';

    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;

    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decryptedText = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

    return decryptedText;
  }

  async generateUserToken(user: UserPayload) {
    const secret = this.configService.auth.secret;
    const tokenExpiresIn = this.configService.auth.expires;
    const refreshSecret = this.configService.auth.refreshSecret;
    const refreshExpires = this.configService.auth.refreshExpires;
    let tokenExpires: number;

    const options = { secret } as JwtSignOptions;
    if (tokenExpiresIn !== undefined) {
      options.expiresIn = tokenExpiresIn;
      tokenExpires = Date.now() + ms(tokenExpiresIn);
    }

    const refreshOptions = { secret: refreshSecret } as JwtSignOptions;
    if (tokenExpiresIn !== undefined) {
      options.expiresIn = refreshExpires;
    }

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(user, options),
      await this.jwtService.signAsync(
        {
          sessionId: user.sessionId,
          hash: user.hash,
        },
        refreshOptions,
      ),
    ]);

    await this.cacheManager.set(createCacheKey(CacheKey.EMAIL_VERIFICATION, user.sub), accessToken, tokenExpires);

    return {
      accessToken,
      refreshToken,
      tokenExpires,
    };
  }

  decodeToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.auth.confirmEmailSecret,
    });
  }

  async createVerificationToken(data: { id: string }) {
    return await this.jwtService.signAsync(
      {
        id: data.id,
      },
      {
        secret: this.configService.auth.confirmEmailSecret,
        expiresIn: this.configService.auth.confirmEmailExpires,
      },
    );
  }

  generateOtp(length: number = 4, otp_ttl: Milliseconds = this.configService.auth.otp_ttl) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return { otp, otp_ttl, otp_created_at: moment.utc().format() };
  }

  select_object<T>(object_item: T, excluded: string[] | string = []): T {
    if (typeof object_item === 'object' && typeof excluded === 'string') {
      const keyValueArray = Object.entries(object_item);
      const removeExcluded = keyValueArray.filter((item) => excluded !== item[0]);
      return Object.fromEntries(removeExcluded) as T;
    }
    if (typeof object_item === 'object' && Array.isArray(excluded)) {
      const keyValueArray = Object.entries(object_item);
      const removeExcluded = keyValueArray.filter((item) => !excluded.includes(item[0]));
      return Object.fromEntries(removeExcluded) as T;
    }
    return {} as T;
  }

  select_list(list: string[] | object[], excluded: string[] | string = []) {
    const selected: any[] = [];

    list.forEach((item) => {
      if (typeof item === 'string' && typeof excluded === 'string') {
        if (item !== excluded) selected.push(item);
      }
      if (typeof item === 'string' && Array.isArray(excluded)) {
        if (!excluded.includes(item)) selected.push(item);
      }
      if (typeof item === 'object' && typeof excluded === 'string') {
        const keyValueArray = Object.entries(item);
        const removeExcluded = keyValueArray.filter((item) => excluded !== item[0]);
        selected.push(Object.fromEntries(removeExcluded));
      }
      if (typeof item === 'object' && Array.isArray(excluded)) {
        const keyValueArray = Object.entries(item);
        const removeExcluded = keyValueArray.filter((item) => !excluded.includes(item[0]));
        selected.push(Object.fromEntries(removeExcluded));
      }
    });

    return selected;
  }
}
