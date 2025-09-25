import { IS_AUTH } from '@/constants/app.constant';
import { SetMetadata } from '@nestjs/common';

export const AuthUser = () => SetMetadata(IS_AUTH, true);
