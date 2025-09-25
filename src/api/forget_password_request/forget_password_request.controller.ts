import { Uuid } from '@/common/types/common.type';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFprDto } from './dto/create-Fpr.dto';
import { UpdateFprDto } from './dto/update-Fpr.dto';
import { FPR as ForgetPasswordRequestEntity } from './entities/fpr.entity';
import { ForgetPasswordRequestService } from './forget_password_request.service';

@ApiTags('forget-password-request')
@ApiBearerAuth()
@Controller('forget-password-request')
export class ForgetPasswordRequestController {
  constructor(private readonly forgetPasswordRequestService: ForgetPasswordRequestService) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new forget password request' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ForgetPasswordRequestEntity })
  create(@Body() createForgetPasswordRequestDto: CreateFprDto): Promise<ForgetPasswordRequestEntity> {
    return this.forgetPasswordRequestService.create(createForgetPasswordRequestDto);
  }

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all forget password request' })
  @ApiResponse({ status: HttpStatus.OK, type: [ForgetPasswordRequestEntity] })
  findAll(): Promise<ForgetPasswordRequestEntity[]> {
    return this.forgetPasswordRequestService.findAll();
  }

  @Version('1')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a forget password request by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ForgetPasswordRequestEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Forget password request not found' })
  findOne(@Param('id') id: Uuid): Promise<ForgetPasswordRequestEntity> {
    return this.forgetPasswordRequestService.findOne(id);
  }

  @Version('1')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a forget password request by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ForgetPasswordRequestEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Forget password request not found' })
  update(@Param('id') id: Uuid, @Body() updateForgetPasswordRequestDto: UpdateFprDto): Promise<ForgetPasswordRequestEntity> {
    return this.forgetPasswordRequestService.update(id, updateForgetPasswordRequestDto);
  }

  @Version('1')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a forget password request by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Forget password request successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Forget password request not found' })
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.forgetPasswordRequestService.remove(id);
  }
}
