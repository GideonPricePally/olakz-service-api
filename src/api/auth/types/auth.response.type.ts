import { User } from '@/api/user/entities/user.entity';

export type ISettings = Record<string, string>;

export interface IAuthResponse {
  refreshToken: string;
  accessToken: string;
  tokenExpires: number;
  user: User;
  settings: ISettings;
}
