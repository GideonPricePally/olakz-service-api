import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  // Common Validation
  V000 = 'common.validation.error',

  // Validation
  V001 = 'user.validation.is_empty',
  V002 = 'user.validation.is_invalid',

  // Error
  E001 = 'user.error.username_or_email_exists',
  E002 = 'user.error.not_found',
  E003 = 'user.error.email_exists',
}

export const WRONG_SIGNIN_PASSWORD = { MESSAGES: 'wrong username or password', status_code: HttpStatus.UNAUTHORIZED, WRONG_INPUT: 'password' };
export const WRONG_SIGNIN_USERNAME = { MESSAGES: 'wrong username or password', status_code: HttpStatus.UNAUTHORIZED, WRONG_INPUT: 'username' };
export const DELETED_ACCOUNT_MESSAGE = {
  MESSAGES: 'queued deleted account, account already exist',
  status_code: HttpStatus.UNAUTHORIZED,
  WRONG_INPUT: 'username',
};
export const FORGET_PASSWORD_USERNAME_NOT_FOUND = { MESSAGES: ' username not found', status_code: HttpStatus.UNAUTHORIZED, WRONG_INPUT: 'username' };
export const USERNAME_ALREADY_EXIST = { MESSAGES: 'username already exist', status_code: HttpStatus.CONFLICT };
export const REFERRER_CODE_NOT_FOUND = { MESSAGES: 'referrer code does not exist', status_code: HttpStatus.NOT_FOUND };
export const PROSPECT_NOT_FOUND = { MESSAGES: 'signup request not found, kindly start with signup', status_code: HttpStatus.NOT_FOUND };
export const COUNTRY_NOT_FOUND = { MESSAGES: 'country not found', status_code: HttpStatus.NOT_FOUND };
export const OTP_MISMATCH = { MESSAGES: 'invalid otp', status_code: HttpStatus.BAD_REQUEST };
export const OTP_EXPIRED = { MESSAGES: 'OTP has expired', status_code: HttpStatus.BAD_REQUEST };
export const TOKEN_USER_ID_NOT_FOUND = {
  MESSAGES: 'account not found',
  status_code: HttpStatus.UNAUTHORIZED,
  WRONG_INPUT: 'token user not found on the database',
};
export const TOKEN_UNDEFINED = { MESSAGES: 'unauthorized', status_code: HttpStatus.UNAUTHORIZED, WRONG_INPUT: 'token not provided in header' };
export const NON_ADMIN_USER_ACCESSING_ENDPOINT = {
  MESSAGES: 'unauthorized',
  status_code: HttpStatus.UNAUTHORIZED,
  WRONG_INPUT: 'non admin user trying to access an admin endpoint',
};
export const NON_ACTIVE_TOKEN = {
  MESSAGES: 'unauthorized: kindly login',
  status_code: HttpStatus.UNAUTHORIZED,
  WRONG_INPUT: 'non active token provided',
};
export const MULTIPLE_SIGNUP_REQUEST = {
  MESSAGES: 'signup request re-applied',
  status_code: HttpStatus.UNAUTHORIZED,
  WRONG_INPUT: 'anonymous re-applied signup request',
};
export const MULTIPLE_FP_REQUEST = {
  MESSAGES: 'forget password request re-applied',
  status_code: HttpStatus.UNAUTHORIZED,
  WRONG_INPUT: 'anonymous re-applied forget password request',
};
export const EXCEEDED_MAXIMUM_SIGNUP_REQUEST = {
  MESSAGES: 'exceeded maximum signup requests within 24 hours: 3',
  status_code: HttpStatus.BAD_REQUEST,
};
export const EXCEEDED_MAXIMUM_FP_REQUEST = {
  MESSAGES: 'exceeded maximum forget password requests within 24 hours: 3',
  status_code: HttpStatus.BAD_REQUEST,
};
export const EXCEEDED_WAIT_TIME_FOR_SIGNUP_REQUEST = {
  MESSAGES: 'exceeded maximum wait time for maximum signup requests: 3',
  status_code: HttpStatus.BAD_REQUEST,
};
export const EXCEEDED_WAIT_TIME_FOR_FP_REQUEST = {
  MESSAGES: 'exceeded maximum wait time for maximum forget password requests: 3',
  status_code: HttpStatus.BAD_REQUEST,
};
