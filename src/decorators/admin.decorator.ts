import { IS_ADMIN } from '@/constants/app.constant';
import { SetMetadata } from '@nestjs/common';

export const Admin = () => SetMetadata(IS_ADMIN, true);
