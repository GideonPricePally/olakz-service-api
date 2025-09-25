import { UserPayload, Uuid } from '@/common/types/common.type';
import { AuthUser } from '@/decorators/auth.decorator';
import { Session } from '@/decorators/session.decorator';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction as TransactionEntity } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: HttpStatus.CREATED, type: TransactionEntity })
  create(@Session() user: UserPayload, @Body() createTransactionDto: CreateTransactionDto): Promise<TransactionEntity> {
    return this.transactionService.create(user, createTransactionDto);
  }

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get all transaction' })
  @ApiResponse({ status: HttpStatus.OK, type: [TransactionEntity] })
  findAll(@Session() user: UserPayload): Promise<TransactionEntity[]> {
    return this.transactionService.findAll(user);
  }

  @Version('1')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: TransactionEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found' })
  findOne(@Session() user: UserPayload, @Param('id') id: Uuid): Promise<TransactionEntity> {
    return this.transactionService.findOne(user, { id });
  }

  @Version('1')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a transaction by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: TransactionEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found' })
  update(@Session() user: UserPayload, @Param('id') id: Uuid, @Body() updateTransactionDto: UpdateTransactionDto): Promise<TransactionEntity> {
    return this.transactionService.update(user, { id }, updateTransactionDto);
  }

  @Version('1')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a transaction by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Transaction successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found' })
  remove(@Session() user: UserPayload, @Param('id') id: Uuid): Promise<void> {
    return this.transactionService.remove(user, id);
  }
}
