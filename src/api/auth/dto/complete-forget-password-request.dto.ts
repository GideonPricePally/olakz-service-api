import { StringField } from '@/decorators/field.decorators';

export class CompleteForgetPasswordRequestDto {
  @StringField({ description: 'user fpr_id' })
  fpr_id: string;

  @StringField({ description: 'otp' })
  otp: string;

  @StringField({ description: 'user password' })
  password: string;
}
