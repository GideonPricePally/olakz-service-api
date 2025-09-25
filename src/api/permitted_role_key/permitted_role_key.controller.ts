import { Uuid } from '@/common/types/common.type';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePermittedRoleKeyDto } from './dto/create-permitted_role_key.dto';
import { UpdatePermittedRoleKeyDto } from './dto/update-permitted_role_key.dto';
import { PermittedRoleKey as PermittedRoleKeyEntity } from './entities/permitted_role_key.entity';
import { PermittedRoleKeysService } from './permitted_role_key.service';

@ApiTags('permitted-role-keys')
@ApiBearerAuth()
@Controller('permitted-role-keys')
export class PermittedRoleKeysController {
  constructor(private readonly permittedRoleKeysService: PermittedRoleKeysService) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new permitted role key' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PermittedRoleKeyEntity })
  create(@Body() createPermittedRoleKeyDto: CreatePermittedRoleKeyDto): Promise<PermittedRoleKeyEntity> {
    return this.permittedRoleKeysService.create(createPermittedRoleKeyDto);
  }

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all permitted role key' })
  @ApiResponse({ status: HttpStatus.OK, type: [PermittedRoleKeyEntity] })
  findAll(): Promise<PermittedRoleKeyEntity[]> {
    return this.permittedRoleKeysService.findAll();
  }

  @Version('1')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a permitted role key by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: PermittedRoleKeyEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Permitted role key not found' })
  findOne(@Param('id') id: Uuid): Promise<PermittedRoleKeyEntity> {
    return this.permittedRoleKeysService.findOne(id);
  }

  @Version('1')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a permitted role key by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: PermittedRoleKeyEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Permitted role key not found' })
  update(@Param('id') id: Uuid, @Body() updatePermittedRoleKeyDto: UpdatePermittedRoleKeyDto): Promise<PermittedRoleKeyEntity> {
    return this.permittedRoleKeysService.update(id, updatePermittedRoleKeyDto);
  }

  @Version('1')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a permitted role key by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Permitted role key successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Permitted role key not found' })
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.permittedRoleKeysService.remove(id);
  }
}
