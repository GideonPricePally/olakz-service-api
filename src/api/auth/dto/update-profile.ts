import { StringFieldOptional } from '@/decorators/field.decorators';

export class UpdateProfileDto {
  @StringFieldOptional()
  first_name: string;

  @StringFieldOptional()
  updated_username: string;

  @StringFieldOptional()
  last_name: string;
}
