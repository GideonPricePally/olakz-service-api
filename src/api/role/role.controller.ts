import { Uuid } from '@/common/types/common.type';
import { Public } from '@/decorators/public.decorator';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role as RoleEntity } from './entities/user-role.entity';
import { RoleService } from './role.service';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: HttpStatus.CREATED, type: RoleEntity })
  create(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.roleService.create(createRoleDto);
  }

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all role' })
  @ApiResponse({ status: HttpStatus.OK, type: [RoleEntity] })
  findAll(): Promise<RoleEntity[]> {
    return this.roleService.findAll();
  }

  @Version('1')
  @Get('external')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all role' })
  @ApiResponse({ status: HttpStatus.OK, type: [RoleEntity] })
  findExternalUserRoles() {
    return this.roleService.findExternalUserRoles();
  }

  @Version('1')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: RoleEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  findOne(@Param('id') id: Uuid): Promise<RoleEntity> {
    return this.roleService.findOne(id);
  }

  @Version('1')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: RoleEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  update(@Param('id') id: Uuid, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    return this.roleService.update(id, updateRoleDto);
  }

  @Version('1')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Role successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.roleService.remove(id);
  }
}
