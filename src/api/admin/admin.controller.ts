import { Uuid } from '@/common/types/common.type';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Admin })
  create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.create(createAdminDto);
  }

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all admin' })
  @ApiResponse({ status: HttpStatus.OK, type: [Admin] })
  findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Version('1')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an admin by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: Admin })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Admin not found' })
  findOne(@Param('id') id: Uuid): Promise<Admin> {
    return this.adminService.findOne(id);
  }

  @Version('1')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an admin by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: Admin })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Admin not found' })
  update(@Param('id') id: Uuid, @Body() updateAdminDto: UpdateAdminDto): Promise<Admin> {
    return this.adminService.update(id, updateAdminDto);
  }

  @Version('1')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an admin by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Admin successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Admin not found' })
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.adminService.remove(id);
  }
}
