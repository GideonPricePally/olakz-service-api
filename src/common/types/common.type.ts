import { Branded } from './types';

export type Uuid = Branded<string, 'Uuid'> | string;

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
export enum EngagedCampaignStatus {}
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
export enum MessageType {
  SIGNIN = 'signin',
  SIGNUP_REQUEST = 'signup_request',
  COMPLETE_SIGNUP_REQUEST = 'complete_signup_request',
  FORGET_PASSWORD_REQUEST = 'forget_password_request',

  FORGET_PASSWORD_COMPLETE = 'forget_password_complete',
  RESEND_SIGNUP_OTP_REQUEST = 'resend_signup_otp_request',
  RESEND_FP_OTP_REQUEST = 'resend_otp_request',
  NEW_ADMIN_PASSWORD = 'create_new_admin_password',
  PASSWORD_UPDATED = 'password_updated',
  SIGN_OFF = 'sign_off_notification',
}

export interface MessageData {
  otp?: string;
  username?: string;
}

export class UserPayload {
  sub: string;
  username: string;
  adminId: string;
  sessionId: string;
  hash: string;
  regionId: string;
  countryId: string;
  walletId: string;
}

export class JwtClaims {
  iat!: number;
  exp!: number;
}

export enum EPlatformStatus {
  DRAFT = 'draft',
  LIVE = 'live',
  DISABLED = 'disabled',
}

export enum EPaymentStatus {
  /**
   * The order's payment is not paid.
   */
  NOT_PAID = 'not_paid',
  /**
   * The order's payment is awaiting capturing.
   */
  AWAITING = 'awaiting',
  /**
   * The order's payment is captured.
   */
  CAPTURED = 'captured',
  /**
   * Some of the order's payment amount is refunded.
   */
  PARTIALLY_REFUNDED = 'partially_refunded',
  /**
   * The order's payment amount is refunded.
   */
  REFUNDED = 'refunded',
  /**
   * The order's payment is canceled.
   */
  CANCELED = 'canceled',
  /**
   * The order's payment requires action.
   */
  REQUIRES_ACTION = 'requires_action',
  /**
   * The order's payment requires action.
   */
  IN_COMPLETE = 'in_complete',
}

export enum EIdempotencyKeyStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
}
