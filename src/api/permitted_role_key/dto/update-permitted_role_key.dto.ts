import { PartialType } from '@nestjs/mapped-types';
import { CreatePermittedRoleKeyDto } from './create-permitted_role_key.dto';

export class UpdatePermittedRoleKeyDto extends PartialType(CreatePermittedRoleKeyDto) {}
