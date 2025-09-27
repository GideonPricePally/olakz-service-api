import { StringField } from '@/decorators/field.decorators';

export class CompleteSignupRequestDto {
  @StringField()
  prospect_id: string;

  @StringField()
  otp: string;
}
