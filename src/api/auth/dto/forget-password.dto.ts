import { StringField } from '@/decorators/field.decorators';

export class ForgetPasswordDto {
  @StringField()
  username: string;
}
