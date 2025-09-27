import { StringField, StringFieldOptional } from '@/decorators/field.decorators';

export class CreateContactMessageDto {
  @StringField()
  first_name: string;

  @StringField()
  last_name: string;

  @StringField()
  email: string;

  @StringFieldOptional()
  mobile: string;

  @StringField()
  message: string;
}
