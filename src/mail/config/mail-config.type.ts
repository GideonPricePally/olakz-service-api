export type MailConfig = {
  host?: string;
  port: number;
  user?: string;
  password?: string;
  ignoreTLS: boolean;
  secure: boolean;
  requireTLS: boolean;
  defaultEmail?: string;
  defaultName?: string;
  service: string;
  signupCompleteHeader: string;
  signupRequestHeader: string;
  forgetPasswordRequestHeader: string;
  forgetPasswordCompleteHeader: string;
  passwordUpdateHeader: string;
  adminNewPasswordEmailHeader: string;
};
