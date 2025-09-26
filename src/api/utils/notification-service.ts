import { IEmailJob } from '@/common/interfaces/job.interface';
import { MessageData, MessageType } from '@/common/types/common.type';
import { QueueName } from '@/constants/job.constant';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { Queue } from 'bullmq';
import * as Nodemailer from 'nodemailer';
import SMTPPool from 'nodemailer/lib/smtp-pool';
import { ConfigReaderService } from './config-reader.service';
import {
  adminNewPasswordHTML,
  forgetPasswordRequestEmail,
  newPasswordEmail,
  signOffEmail,
  signupCompleteEmail,
  signupRequestOTPEmail,
  updatePasswordConfirmationEmail,
} from './helpers/emailContent';
import { RemoteService } from './remote-service';
import { UtilityService } from './utility-service';

@Injectable()
export class NotificationService {
  private logger = new Logger(NotificationService.name);
  private email_transporter: Nodemailer.Transporter<Nodemailer.SendMailOptions>;
  private smsRemoteService: AxiosInstance;

  constructor(
    private readonly utilityService: UtilityService,
    private readonly configService: ConfigReaderService,
    private readonly remoteService: RemoteService,
    @InjectQueue(QueueName.EMAIL) private readonly emailQueue: Queue<IEmailJob, any, string>,
  ) {
    this.email_transporter = Nodemailer.createTransport({
      host: configService.mail.host,
      port: configService.mail.port,
      secure: true,
      auth: {
        user: configService.mail.user,
        pass: configService.mail.password,
      },
    } as SMTPPool.MailOptions);
  }

  private async send_email(target: string, header: string, htmlBody: string, data?: any) {
    // if (this.configService.app.isDevelopment) return this.logger.log({ target, header, data });
    // await this.emailQueue.add(
    //   JobName.EMAIL_VERIFICATION,
    //   {
    //     email: dto.email,
    //     token,
    //   } as IVerifyEmailJob,
    //   { attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
    // );
    this.logger.log({ data });
    try {
      const res = await this.email_transporter.sendMail({
        from: 'Microtask',
        to: target,
        subject: header,
        html: htmlBody,
      });
      this.logger.log({ message: 'email response', res });
    } catch (error) {
      this.logger.error({ message: 'email error', error });
    }
  }

  private async send_sms(target: string, header: string, content: string) {
    try {
      if (this.configService.app.isDevelopment) return this.logger.log({ username: target, header, content });
      // const res = await this.smsRemoteService.post('/bulk', {
      //   username: this.configService.AFRICA_TALKING_USERNAME,
      //   message: content,
      //   phoneNumbers: [target],
      // });
      this.logger.log({ message: 'sms response' });
    } catch (error) {
      this.logger.error({ message: 'sms error', error });
    }
  }

  private async send_push_notification() {}

  send(target: string, messageType: MessageType, fields: MessageData = {}) {
    try {
      switch (messageType) {
        case MessageType.SIGNUP_REQUEST:
          if (this.utilityService.isEmail(target))
            return this.send_email(target, this.configService.mail.signupRequestHeader, signupRequestOTPEmail(fields.otp), fields);
          else if (this.utilityService.isIntlNumber(target))
            return this.send_sms(target, '', `Hello Microtasker,\nThis is your verification OTP, ${fields.otp}`);
          break;
        case MessageType.COMPLETE_SIGNUP_REQUEST:
          if (this.utilityService.isEmail(target))
            return this.send_email(target, this.configService.mail.signupCompleteHeader, signupCompleteEmail(fields?.username || 'Microtasker'));
          else if (this.utilityService.isIntlNumber(target))
            return this.send_sms(target, '', `Hello ${fields.username || 'Microtasker'},\nWelcome to Microtask, let's go gaming`);
          break;
        case MessageType.SIGNIN:
          if (this.utilityService.isEmail(target))
            return this.send_email(target, 'New Login Alert', signupCompleteEmail(fields?.username || 'Microtasker'));
          else if (this.utilityService.isIntlNumber(target))
            return this.send_sms(target, '', `Hello ${fields.username || 'Microtasker'},\nWelcome to Microtask, let's go gaming`);
          break;
        case MessageType.FORGET_PASSWORD_REQUEST:
          if (this.utilityService.isEmail(target))
            return this.send_email(target, this.configService.mail.forgetPasswordRequestHeader, forgetPasswordRequestEmail(fields?.otp));
          else if (this.utilityService.isIntlNumber(target))
            return this.send_sms(target, '', `Hello Microtasker,\nThis is your verification OTP,\n ${fields.otp}`);
          break;
        case MessageType.FORGET_PASSWORD_COMPLETE:
          if (this.utilityService.isEmail(target))
            return this.send_email(target, this.configService.mail.forgetPasswordCompleteHeader, newPasswordEmail());
          else if (this.utilityService.isIntlNumber(target))
            return this.send_sms(target, '', `Hello Microtasker,\nKindly be informed that your password has been updated successfully`);
          break;
        case MessageType.RESEND_SIGNUP_OTP_REQUEST:
          if (this.utilityService.isEmail(target))
            return this.send_email(target, this.configService.mail.signupRequestHeader, signupRequestOTPEmail(fields.otp));
          else if (this.utilityService.isIntlNumber(target))
            return this.send_sms(target, '', `Hello Microtasker,\nThis is your verification OTP, ${fields.otp}`);
          break;
        case MessageType.RESEND_FP_OTP_REQUEST:
          if (this.utilityService.isEmail(target))
            return this.send_email(target, this.configService.mail.signupRequestHeader, signupRequestOTPEmail(fields.otp));
          else if (this.utilityService.isIntlNumber(target))
            return this.send_sms(target, '', `Hello Microtasker,\nThis is your verification OTP, ${fields.otp}`);
          break;
        case MessageType.NEW_ADMIN_PASSWORD:
          if (this.utilityService.isEmail(target))
            return this.send_email(target, this.configService.mail.adminNewPasswordEmailHeader, adminNewPasswordHTML(fields.otp));
          // if (this.configService.").isDevelopment) return this.mattermostService.send(target, "", `Hello Microtasker,\nThis is your verification OTP, ${fields.otp}`);
          else if (this.utilityService.isIntlNumber(target))
            return this.send_sms(target, '', `Hello Microtasker,\nThis is your verification OTP, ${fields.otp}`);
          break;
        case MessageType.PASSWORD_UPDATED:
          if (this.utilityService.isEmail(target))
            return this.send_email(target, this.configService.mail.passwordUpdateHeader, updatePasswordConfirmationEmail(fields.username));
          // if (this.configService.").isDevelopment) return this.mattermostService.send(target, "", `Hello Microtasker,\nYour password was updated successfully.`);
          else if (this.utilityService.isIntlNumber(target))
            return this.send_sms(target, '', `Hello Microtasker,\nYour password was updated successfully.`);
          break;
        case MessageType.SIGN_OFF:
          if (this.utilityService.isEmail(target))
            return this.send_email(target, this.configService.mail.passwordUpdateHeader, signOffEmail(fields.username || 'Microtasker'));
          // if (this.configService.").isDevelopment) return this.mattermostService.send(target, "", `Hello ${fields.MicrotaskerName},\nYour account had been deleted successfully.`);
          else if (this.utilityService.isIntlNumber(target))
            return this.send_sms(target, '', `Hello ${fields.username || 'Microtasker'},\nYour account had been deleted successfully.`);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
