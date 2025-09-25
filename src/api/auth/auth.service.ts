import { IEmailJob } from '@/common/interfaces/job.interface';
import { JwtClaims, MessageType, UserPayload } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { CacheKey } from '@/constants/cache.constant';
import {
  COUNTRY_NOT_FOUND,
  EXCEEDED_MAXIMUM_FP_REQUEST,
  EXCEEDED_MAXIMUM_SIGNUP_REQUEST,
  EXCEEDED_WAIT_TIME_FOR_FP_REQUEST,
  EXCEEDED_WAIT_TIME_FOR_SIGNUP_REQUEST,
  FORGET_PASSWORD_USERNAME_NOT_FOUND,
  MULTIPLE_FP_REQUEST,
  MULTIPLE_SIGNUP_REQUEST,
  OTP_EXPIRED,
  OTP_MISMATCH,
  PROSPECT_NOT_FOUND,
  REFERRER_CODE_NOT_FOUND,
  USERNAME_ALREADY_EXIST,
  WRONG_SIGNIN_PASSWORD,
  WRONG_SIGNIN_USERNAME,
} from '@/constants/error-code.constant';
import { QueueName } from '@/constants/job.constant';
// import { auth } from '@/libs/auth/auth';
import getIpCountry from '@/libs/ip/get-ip-country';
import { createCacheKey } from '@/utils/cache.util';
import { InjectQueue } from '@nestjs/bullmq';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bullmq';
import { Cache } from 'cache-manager';
import crypto from 'crypto';
import moment from 'moment';
import { EntityManager } from 'typeorm';
import { CountryService } from '../country/country.service';
import { FprService } from '../forget_password_request/fpr.service';
import { PaymentService } from '../payment/payment.service';
import { ProspectService } from '../prospect/prospect.service';
import { RegionService } from '../region/region.service';
import { RoleService } from '../role/role.service';
import { Session } from '../user/entities/session.entity';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { ConfigReaderService } from '../utils/config-reader.service';
import { DataManagerService } from '../utils/data-manager.service';
import { NotificationService } from '../utils/notification-service';
import { UtilityService } from '../utils/utility-service';
import { WalletService } from '../wallet/wallet.service';
import { CompleteForgetPasswordRequestDto } from './dto/complete-forget-password-request.dto';
import { CompleteSignupRequestDto } from './dto/complete-signup-request.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { UserSignupRequestDto } from './dto/signup-request.dto';
import { UpdateProfileDto } from './dto/update-profile';
import { UserSigninDto } from './dto/user-signin.dto';
import { IAuthResponse, ISettings } from './types/auth.response.type';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';

const DEFAULT_USER_EXCLUDED_PROPS = [
  'spotify_access_token',
  'spotify_refresh_token',
  'tiktok_access_token',
  'tiktok_refresh_token',
  'apple_access_token',
  'apple_refresh_token',
  'created_at',
  'created_by',
  'updated_by',
  'deleted_at',
  'password',
  'status',
  'token_created_date',
  'updated_at',
  'active_token',
  'refresh_token',
  'token_expires',
  't_and_c',
];

const AUTH_USER_RELATIONS = [
  'country',
  'role',
  'country',
  'referrals',
  'wallet',
  'wallet.transactions',
  'wallet.transactions.currency',
  'wallet.default_bank_detail',
  'wallet.bank_details',
  'wallet.currency',
  'referrer',
  'admin',
  'admin.roles',
];

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigReaderService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prospectService: ProspectService,
    private readonly utilityService: UtilityService,
    private readonly notificationService: NotificationService,
    private readonly countryService: CountryService,
    private readonly roleService: RoleService,
    private readonly regionService: RegionService,
    private readonly dataManagerService: DataManagerService,
    private readonly fprService: FprService,
    private readonly userRepository: UserRepository,
    private readonly walletService: WalletService,
    private readonly paymentService: PaymentService,
    @InjectQueue(QueueName.EMAIL) private readonly emailQueue: Queue<IEmailJob, any, string>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async signup_request(ip: string, userSignupRequestDto: UserSignupRequestDto) {
    try {
      const { country: country_code } = await getIpCountry(ip);
      const { first_name, last_name, username, password, t_and_c, referral_code } = userSignupRequestDto;

      const usernameExist = await this.userService.checkIfUsernameExist(username);

      if (usernameExist) {
        this.logger.error({ ...USERNAME_ALREADY_EXIST, ...userSignupRequestDto });
        throw new ForbiddenException(USERNAME_ALREADY_EXIST.MESSAGES);
      }
      const prospectExist = await this.prospectService.getOpenProspectByUsername(username);

      if (prospectExist && !prospectExist.signup_completed_at) {
        const otpTimeDifference = ((new Date() as unknown as number) - (new Date(prospectExist.updated_at) as unknown as number)) / 1000;

        if (prospectExist.no_of_request_tries === 3 && otpTimeDifference < 24 * 60 * 60) {
          this.logger.error({ ...EXCEEDED_MAXIMUM_SIGNUP_REQUEST, ...userSignupRequestDto, no_of_request_tries: prospectExist.no_of_request_tries });
          throw new ForbiddenException(EXCEEDED_MAXIMUM_SIGNUP_REQUEST.MESSAGES);
        }
        if (prospectExist.no_of_request_tries <= 3 && otpTimeDifference >= 24 * 60 * 60) {
          this.logger.log({
            ...EXCEEDED_WAIT_TIME_FOR_SIGNUP_REQUEST,
            ...userSignupRequestDto,
            no_of_request_tries: prospectExist.no_of_request_tries,
          });
          await this.prospectService.resetNoOfRequestTries({ id: prospectExist.id });
        }
        this.logger.log({ ...MULTIPLE_SIGNUP_REQUEST, ...userSignupRequestDto });
        const { otp, otp_ttl, otp_created_at } = this.utilityService.generateOtp();
        await this.prospectService.updateProspectOtp(prospectExist.id, otp);
        await this.prospectService.increaseNoOfRequestTries({ id: prospectExist.id });
        const updated_prospect = await this.prospectService.getProspectByUsername(username);
        await this.notificationService.send(username, MessageType.SIGNUP_REQUEST, { otp });
        return { prospect_id: updated_prospect.id, otp_ttl, otp_created_at };
      }

      let referrer: User;
      if (referral_code) {
        referrer = await this.userService.getUserByReferralCode(referral_code);
        if (!referrer) {
          this.logger.error({ ...REFERRER_CODE_NOT_FOUND, ...userSignupRequestDto });
          throw new NotFoundException(REFERRER_CODE_NOT_FOUND.MESSAGES);
        }
      }

      const country = await this.countryService.findCountryByCode(country_code);
      if (!country) {
        this.logger.error({ ...COUNTRY_NOT_FOUND, ...userSignupRequestDto });
        throw new NotFoundException(COUNTRY_NOT_FOUND.MESSAGES);
      }

      const { otp, otp_ttl, otp_created_at } = this.utilityService.generateOtp();
      const password_hash = await this.utilityService.hashPassword(password);
      const prospect = await this.prospectService.save({
        username,
        password: password_hash,
        first_name,
        last_name,
        t_and_c,
        country,
        otps: [otp],
        otp_ttl,
        otp_created_at,
        referrer,
        no_of_request_tries: 1,
        created_by: SYSTEM_USER_ID,
        updated_by: SYSTEM_USER_ID,
      });
      await this.notificationService.send(username, MessageType.SIGNUP_REQUEST, { otp });

      return { prospect_id: prospect.id, otp_ttl, otp_created_at };
    } catch (error) {
      this.logger.error({ ...error });
      throw error;
    }
  }

  async resend_signup_request_otp(prospect_id: string) {
    try {
      const prospectExist = await this.prospectService.getProspectById(prospect_id);

      if (!prospectExist) {
        throw new NotFoundException('prospect not found');
      }
      if (prospectExist && prospectExist.signup_completed_at) {
        throw new BadRequestException('Signup already completed successfully, Kindly login');
      }

      const otpTimeDifference = moment.utc().diff(moment.utc(prospectExist.updated_at)) / 1000;

      if (prospectExist.no_of_request_tries === 3 && otpTimeDifference <= 24 * 60 * 60) {
        this.logger.error({ ...EXCEEDED_MAXIMUM_SIGNUP_REQUEST, prospect_id, no_of_request_tries: prospectExist.no_of_request_tries });
        throw new ForbiddenException(EXCEEDED_MAXIMUM_SIGNUP_REQUEST.MESSAGES);
      }
      if (prospectExist.no_of_request_tries <= 3 && otpTimeDifference > 24 * 60 * 60) {
        this.logger.log({ ...EXCEEDED_WAIT_TIME_FOR_SIGNUP_REQUEST, prospect_id, no_of_request_tries: prospectExist.no_of_request_tries });
        await this.prospectService.resetNoOfRequestTries({ id: prospectExist.id });
      }
      this.logger.log({ ...MULTIPLE_SIGNUP_REQUEST, prospect_id });
      const { otp, otp_ttl, otp_created_at } = this.utilityService.generateOtp();
      await this.prospectService.updateProspectOtp(prospect_id, otp);
      await this.prospectService.increaseNoOfRequestTries({ id: prospectExist.id });
      await this.notificationService.send(prospectExist.username, MessageType.RESEND_SIGNUP_OTP_REQUEST, { otp });
      return { prospect_id: prospectExist.id, otp_ttl, otp_created_at };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async complete_signup_request(completeSignupDto: CompleteSignupRequestDto): Promise<IAuthResponse> {
    try {
      const { otp, prospect_id } = completeSignupDto;

      const prospect = await this.prospectService.getProspectById(prospect_id);
      if (!prospect) {
        this.logger.error({ ...PROSPECT_NOT_FOUND, ...completeSignupDto });
        throw new NotFoundException(PROSPECT_NOT_FOUND.MESSAGES);
      }
      if (prospect && prospect.signup_completed_at) {
        throw new BadRequestException('Signup already completed successfully, Kindly login');
      }

      if (!prospect.otps?.includes?.(otp)) {
        this.logger.error({ ...OTP_MISMATCH, ...completeSignupDto });
        throw new ForbiddenException(OTP_MISMATCH.MESSAGES);
      }

      const otpTimeDifference = moment.utc().diff(moment.utc(prospect.otp_created_at)) / 1000;
      if (otpTimeDifference > this.configService.auth.otp_ttl) {
        this.logger.error({ ...OTP_EXPIRED, ...completeSignupDto });
        throw new ForbiddenException(OTP_EXPIRED.MESSAGES);
      }

      const base_role = await this.roleService.getBaseRoleByName(prospect.type_of_user);

      const isEmail = this.utilityService.isEmail(prospect.username);
      const isIntlNumber = this.utilityService.isIntlNumber(prospect.username);
      const countryId = prospect.country.id;
      await this.dataManagerService.transaction(async (manager) => {
        const userData: Partial<User> = {
          username: prospect.username,
          name: prospect.username,
          referral_code: this.utilityService.generateReferralCode(),
          password: prospect.password,
          role: base_role,
          role_id: base_role?.id,
          country: prospect.country,
          first_name: prospect.first_name,
          last_name: prospect.last_name,
          referrer: prospect.referrer,
          created_by: prospect.created_by,
          updated_by: prospect.updated_by,
          t_and_c: prospect.t_and_c,
          email: isEmail ? prospect.username : null,
          email_verified: isEmail ? true : null,
          mobile: isIntlNumber ? prospect.username : null,
          whatsapp_verified: isIntlNumber ? true : null,
          updated_username: prospect.username,
        };
        const userInstance = await this.userService.create(userData);
        // create user type
        const wallet = await this.walletService.create(userInstance.id, prospect.country.id, manager);
        userInstance.wallet = wallet;
        const user = await this.userService.save(userInstance, manager);
        const { sessionId, hash } = await this.createSession(user.id, manager);

        const region = await this.regionService.findOneByCountryId(countryId);
        if (!region) throw new NotFoundException('region not found');

        const { accessToken, refreshToken, tokenExpires } = await this.utilityService.generateUserToken({
          sub: user.id,
          username: user.username,
          adminId: user?.admin?.id,
          sessionId,
          hash,
          regionId: region.id,
          countryId,
          walletId: wallet.id,
        });
        await this.userService.update_active_token(
          user.id,
          { active_token: accessToken, refresh_token: refreshToken, token_expires: tokenExpires },
          manager,
        );
        await this.prospectService.delete(prospect.id, manager);
      });

      const user = await this.userService.getUserByUsername(prospect.username, AUTH_USER_RELATIONS);
      const accessToken = user.active_token;
      const refreshToken = user.refresh_token;
      const tokenExpires = user.token_expires;

      await this.notificationService.send(prospect.username, MessageType.COMPLETE_SIGNUP_REQUEST, {});

      return {
        settings: this.getAppSetting(),
        refreshToken,
        accessToken,
        tokenExpires,
        user: this.utilityService.select_object(user, DEFAULT_USER_EXCLUDED_PROPS),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async signin(signinDto: UserSigninDto): Promise<IAuthResponse> {
    try {
      const user = await this.userService.getUserByUsername(signinDto.username, ['wallet', 'admin']);
      if (!user) {
        this.logger.error({ ...WRONG_SIGNIN_USERNAME, ...signinDto });
        throw new UnauthorizedException(WRONG_SIGNIN_USERNAME.MESSAGES);
      }

      const { hash, sessionId } = await this.createSession(user.id);

      if (!(await this.utilityService.verifyPassword(signinDto.password, user.password))) {
        this.logger.error({ ...WRONG_SIGNIN_PASSWORD, ...signinDto });
        throw new UnauthorizedException(WRONG_SIGNIN_PASSWORD.MESSAGES);
      }

      const countryId = user.country_id;
      const region = await this.regionService.findOneByCountryId(countryId);
      if (!region) throw new NotFoundException('region not found');

      const { accessToken, refreshToken, tokenExpires } = await this.utilityService.generateUserToken({
        sub: user.id,
        username: user.username,
        adminId: user?.admin?.id,
        sessionId,
        hash,
        regionId: region.id,
        countryId,
        walletId: user?.wallet.id,
      });

      await this.userService.update_active_token(
        { id: user.id },
        { active_token: accessToken, refresh_token: refreshToken, token_expires: tokenExpires },
      );

      const updated_user = await this.userService.getUserByUsername(user.username, AUTH_USER_RELATIONS);

      await this.notificationService.send(updated_user.username, MessageType.SIGNIN);

      return {
        settings: this.getAppSetting(),
        accessToken,
        refreshToken,
        tokenExpires,
        user: this.utilityService.select_object(updated_user, DEFAULT_USER_EXCLUDED_PROPS),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async signout(user: UserPayload & JwtClaims) {
    try {
      if (!user) {
        throw new UnauthorizedException(WRONG_SIGNIN_USERNAME.MESSAGES);
      }
      await this.userService.delete_active_token({ id: user.sub });
      await this.cacheManager.store.set<boolean>(createCacheKey(CacheKey.SESSION_BLACKLIST, user.sessionId), true, user.exp * 1000 - Date.now());
      await Session.delete(user.sessionId);

      return {
        user: this.utilityService.select_object(await this.userService.getUserByUsername(user.username), DEFAULT_USER_EXCLUDED_PROPS),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async delete_account(user: UserPayload & JwtClaims) {
    try {
      if (!user) {
        throw new UnauthorizedException(WRONG_SIGNIN_USERNAME.MESSAGES);
      }
      await this.userService.delete_active_token({ id: user.sub });
      await this.cacheManager.store.set<boolean>(createCacheKey(CacheKey.SESSION_BLACKLIST, user.sessionId), true, user.exp * 1000 - Date.now());
      await Session.delete(user.sessionId);
      await this.userService.delete_account(user.sub);
      await this.notificationService.send(user.username, MessageType.SIGN_OFF, {});

      return {
        user: this.utilityService.select_object({}, DEFAULT_USER_EXCLUDED_PROPS),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async update_profile(user: UserPayload, data: UpdateProfileDto) {
    try {
      if (!user) {
        throw new UnauthorizedException(WRONG_SIGNIN_USERNAME.MESSAGES);
      }
      await this.userService.update_profile(
        { id: user.sub },
        {
          first_name: data.first_name,
          last_name: data.last_name,
          updated_username: data.updated_username,
        },
      );
      // await this.notificationService.send(user.username, MessageType.PASSWORD_UPDATED, {});
      const updated_user = await this.userService.getUserByUsername(user.username, AUTH_USER_RELATIONS);
      return {
        user: this.utilityService.select_object(updated_user, DEFAULT_USER_EXCLUDED_PROPS),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async forget_password_request(data: ForgetPasswordDto) {
    try {
      const { username } = data;
      const user = await this.userService.getUserByUsername(username);
      if (!user) {
        this.logger.error({ ...FORGET_PASSWORD_USERNAME_NOT_FOUND, ...data });
        throw new UnauthorizedException(FORGET_PASSWORD_USERNAME_NOT_FOUND.MESSAGES);
      }

      const fprExist = await this.fprService.getOpenFprByUsername(username);

      if (fprExist && !fprExist.request_completed_at) {
        const otpTimeDifference = ((new Date() as unknown as number) - (new Date(fprExist.updated_at) as unknown as number)) / 1000;

        if (fprExist.no_of_request_tries === 3 && otpTimeDifference < 24 * 60 * 60) {
          this.logger.error({ ...EXCEEDED_MAXIMUM_FP_REQUEST, ...data, no_of_request_tries: fprExist.no_of_request_tries });
          throw new ForbiddenException(EXCEEDED_MAXIMUM_FP_REQUEST.MESSAGES);
        }
        if (fprExist.no_of_request_tries <= 3 && otpTimeDifference >= 24 * 60 * 60) {
          this.logger.error({ ...EXCEEDED_WAIT_TIME_FOR_FP_REQUEST, ...data, no_of_request_tries: fprExist.no_of_request_tries });
          await this.fprService.resetNoOfRequestTries({ id: fprExist.id });
        }
        this.logger.log({ ...MULTIPLE_FP_REQUEST, ...data });
        const { otp, otp_ttl, otp_created_at } = this.utilityService.generateOtp();
        await this.fprService.updateFprOtp(fprExist.id, otp);
        await this.fprService.increaseNoOfRequestTries({ id: fprExist.id });
        const updated_fpr = await this.fprService.getFprByUsername(username);
        await this.notificationService.send(updated_fpr.username, MessageType.FORGET_PASSWORD_REQUEST, { otp });
        return { fpr_id: fprExist.id, otp_ttl, otp_created_at };
      }

      const { otp, otp_ttl, otp_created_at } = this.utilityService.generateOtp();
      const fpr = await this.fprService.create_save({
        username,
        otps: [otp],
        otp_ttl,
        otp_created_at,
        no_of_request_tries: 1,
        created_by: SYSTEM_USER_ID,
        updated_by: SYSTEM_USER_ID,
      });
      await this.notificationService.send(fpr.username, MessageType.FORGET_PASSWORD_REQUEST, { otp });
      return { fpr_id: fpr.id, otp_ttl, otp_created_at };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async resend_fpr_otp(fpr_id: string) {
    try {
      const fprExist = await this.fprService.getFprById(fpr_id);

      if (!fprExist) {
        throw new NotFoundException('request not found');
      }
      if (fprExist && fprExist.request_completed_at) {
        throw new BadRequestException('request already completed successfully');
      }

      const otpTimeDifference = moment.utc().diff(moment.utc(fprExist.updated_at)) / 1000;

      if (fprExist.no_of_request_tries === 3 && otpTimeDifference <= 24 * 60 * 60) {
        this.logger.error({ ...EXCEEDED_MAXIMUM_FP_REQUEST, fpr_id, no_of_request_tries: fprExist.no_of_request_tries });
        throw new ForbiddenException(EXCEEDED_MAXIMUM_FP_REQUEST.MESSAGES);
      }
      if (fprExist.no_of_request_tries === 3 && otpTimeDifference > 24 * 60 * 60) {
        this.logger.error({ ...EXCEEDED_WAIT_TIME_FOR_FP_REQUEST, fpr_id, no_of_request_tries: fprExist.no_of_request_tries });
        await this.fprService.resetNoOfRequestTries({ id: fprExist.id });
      }
      this.logger.log({ ...MULTIPLE_FP_REQUEST, fpr_id });
      const { otp, otp_ttl, otp_created_at } = this.utilityService.generateOtp();
      await this.fprService.updateFprOtp(fprExist.id, otp);
      await this.fprService.increaseNoOfRequestTries({ id: fprExist.id });
      const updated_fpr = await this.fprService.getFprById(fpr_id);
      await this.notificationService.send(updated_fpr.username, MessageType.FORGET_PASSWORD_REQUEST, { otp });
      return { fpr_id: fprExist.id, otp_ttl, otp_created_at };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async complete_fpr(complete_fpr_dto: CompleteForgetPasswordRequestDto): Promise<IAuthResponse> {
    try {
      const { otp, fpr_id, password } = complete_fpr_dto;

      const fpr = await this.fprService.getFprById(fpr_id);
      if (!fpr) {
        throw new NotFoundException('request not found');
      }
      if (!fpr.otps.includes(otp)) {
        throw new ForbiddenException(OTP_MISMATCH.MESSAGES);
      }

      const otpTimeDifference = moment.utc().diff(moment.utc(fpr.otp_created_at)) / 1000;
      if (otpTimeDifference > this.configService.auth.otp_ttl) {
        this.logger.error({ ...OTP_EXPIRED, ...complete_fpr_dto });
        throw new ForbiddenException(OTP_EXPIRED.MESSAGES);
      }

      const user = await this.userService.getUserByUsername(fpr.username, ['wallet', 'admin']);
      if (!user) throw new NotFoundException('account not found');
      const countryId = user.country_id;
      const region = await this.regionService.findOneByCountryId(countryId);
      if (!region) throw new NotFoundException('region not found');

      await this.dataManagerService.transaction(async (manager) => {
        const { sessionId, hash } = await this.createSession(user.id, manager);
        const password_hash = await this.utilityService.hashPassword(password);
        await this.userService.update_password_hash({ id: user.id }, password_hash, manager);
        const { accessToken, refreshToken, tokenExpires } = await this.utilityService.generateUserToken({
          sub: user.id,
          username: user.username,
          adminId: user?.admin?.id,
          sessionId,
          hash,
          regionId: region.id,
          countryId,
          walletId: user?.wallet.id,
        });
        await this.userService.update_active_token(
          user.id,
          { active_token: accessToken, refresh_token: refreshToken, token_expires: tokenExpires },
          manager,
        );
        await this.fprService.delete(fpr.id, manager);
      });
      const updated_user = await this.userService.getUserByUsername(fpr.username, AUTH_USER_RELATIONS);
      const accessToken = updated_user.active_token;
      const refreshToken = updated_user.refresh_token;
      const tokenExpires = updated_user.token_expires;

      await this.notificationService.send(updated_user.username, MessageType.FORGET_PASSWORD_COMPLETE, {});

      return {
        settings: this.getAppSetting(),
        accessToken,
        refreshToken,
        tokenExpires,
        user: this.utilityService.select_object(updated_user, DEFAULT_USER_EXCLUDED_PROPS),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async refreshToken(prevRefreshToken: string): Promise<RefreshResDto> {
    const { sessionId, hash } = await this.verifyRefreshToken(prevRefreshToken);
    const session = await Session.findOneBy({ id: sessionId });

    if (!session || session.hash !== hash) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne({
      where: { id: session.user_id },
      select: ['id'],
      relations: ['admin'],
    });
    if (!user) throw new NotFoundException('account not found');

    const newHash = crypto.createHash('sha256').update(randomStringGenerator()).digest('hex');

    Session.update(session.id, { hash: newHash });

    const countryId = user.country_id;
    const region = await this.regionService.findOneByCountryId(countryId);
    if (!region) throw new NotFoundException('region not found');

    const { refreshToken, accessToken, tokenExpires } = await this.utilityService.generateUserToken({
      sub: user.id,
      sessionId: session.id,
      hash: newHash,
      adminId: user?.admin?.id,
      username: user.username,
      regionId: region.id,
      countryId,
      walletId: user?.wallet_id,
    });
    await this.userService.update_active_token(user.id, { active_token: accessToken, refresh_token: refreshToken, token_expires: tokenExpires });

    return { refreshToken, accessToken, tokenExpires };
  }

  private async createSession(userId: string, entityManager?: EntityManager) {
    const hash = crypto.createHash('sha256').update(randomStringGenerator()).digest('hex');

    const session = new Session({
      hash,
      user: { id: userId } as User,
      created_by: SYSTEM_USER_ID,
      updated_by: SYSTEM_USER_ID,
    });
    if (entityManager) {
      await entityManager.save(session);
    } else await session.save();

    return { sessionId: session.id, hash };
  }

  async verifyAccessToken(token: string): Promise<UserPayload> {
    let payload: UserPayload;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.auth.secret,
      });
    } catch {
      throw new UnauthorizedException();
    }

    // Force logout if the session is in the blacklist
    const isSessionBlacklisted = await this.cacheManager.store.get<boolean>(createCacheKey(CacheKey.SESSION_BLACKLIST, payload.sessionId));

    if (isSessionBlacklisted) {
      throw new UnauthorizedException();
    }

    return payload;
  }

  async verifyRefreshToken(token: string): Promise<JwtRefreshPayloadType> {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.auth.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  private getAppSetting(): ISettings {
    return {};
  }

  // async spotify_auth(data: SocialAuthDto) {
  //   const spotify = new BetterAuth.Spotify({
  //     clientId: this.configService.auth.spotify_client_id,
  //     clientSecret: this.configService.auth.spotify_client_secret,
  //     redirectUri: this.configService.auth.spotify_redirect_uri,
  //   });

  //   const user = await spotify.getUser(data.code);

  //   // save user to database
  //   return user;
  // }

  // async tiktok_auth(data: SocialAuthDto) {
  //   const tiktok = new BetterAuth.TikTok({
  //     clientId: this.configService.auth.tiktok_client_id,
  //     clientSecret: this.configService.auth.tiktok_client_secret,
  //     redirectUri: this.configService.auth.tiktok_redirect_uri,
  //   });

  //   const user = await tiktok.getUser(data.code);

  //   // save user to database
  //   return user;
  // }

  // async apple_auth(data: SocialAuthDto) {
  //   const apple = new BetterAuth.Apple({
  //     clientId: this.configService.auth.apple_client_id,
  //     clientSecret: this.configService.auth.apple_client_secret,
  //     redirectUri: this.configService.auth.apple_redirect_uri,
  //   });

  //   const user = await apple.getUser(data.code);

  //   // save user to database
  //   return user;
  // }
}
