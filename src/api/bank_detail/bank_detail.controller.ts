import { UserPayload, Uuid } from '@/common/types/common.type';
import { AuthUser } from '@/decorators/auth.decorator';
import { Session } from '@/decorators/session.decorator';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Version } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BankDetailService } from './bank_detail.service';
import { CreateBankDetailDto } from './dto/create-bank_detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank_detail.dto';
import { BankDetail as BankDetailEntity } from './entities/bank_detail.entity';

@Controller('bank-detail')
export class BankDetailController {
  constructor(private readonly bankDetailService: BankDetailService) {}

  @Version('1')
  @AuthUser()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new bank detail' })
  @ApiResponse({ status: HttpStatus.CREATED, type: BankDetailEntity })
  registerBankDetail(@Session() user: UserPayload, @Body() createBankDetailDto: CreateBankDetailDto): Promise<BankDetailEntity> {
    return this.bankDetailService.registerBankDetail(user, createBankDetailDto);
  }

  @Version('1')
  @AuthUser()
  @Get()
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get all bank detail' })
  @ApiResponse({ status: HttpStatus.OK, type: [BankDetailEntity] })
  findAll(@Session() user: UserPayload): Promise<BankDetailEntity[]> {
    return this.bankDetailService.findAll(user);
  }

  @Version('1')
  @AuthUser()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get a bank detail by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: BankDetailEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Bank detail not found' })
  findOne(@Session() user: UserPayload, @Param('id') id: Uuid): Promise<BankDetailEntity> {
    return this.bankDetailService.findOne(user, id);
  }

  @Version('1')
  @AuthUser()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a bank detail by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: BankDetailEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Bank detail not found' })
  update(@Session() user: UserPayload, @Param('id') id: Uuid, @Body() updateBankDetailDto: UpdateBankDetailDto): Promise<BankDetailEntity> {
    return this.bankDetailService.update(user, id, updateBankDetailDto);
  }

  @Version('1')
  @AuthUser()
  @Patch('default/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a bank detail by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: BankDetailEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Bank detail not found' })
  updateDefaultAccount(@Session() user: UserPayload, @Param('id') id: Uuid): Promise<BankDetailEntity> {
    return this.bankDetailService.setWalletDefaultAcccount(user, id);
  }

  @Version('1')
  @AuthUser()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a bank detail by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Bank detail successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Bank detail not found' })
  remove(@Session() user: UserPayload, @Param('id') id: Uuid): Promise<void> {
    return this.bankDetailService.remove(user, id);
  }
}
