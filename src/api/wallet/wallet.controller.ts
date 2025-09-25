import { Uuid } from '@/common/types/common.type';
import { Admin } from '@/decorators/admin.decorator';
import { AuthUser } from '@/decorators/auth.decorator';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet as WalletEntity } from './entities/wallet.entity';
import { WalletService } from './wallet.service';

@ApiTags('wallet')
@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @Admin()
  @ApiOperation({ summary: 'Get all wallet' })
  @ApiResponse({ status: HttpStatus.OK, type: [WalletEntity] })
  findAll(): Promise<WalletEntity[]> {
    return this.walletService.findAll();
  }

  @Version('1')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a wallet by ID' })
  @AuthUser()
  @ApiResponse({ status: HttpStatus.OK, type: WalletEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Wallet not found' })
  findOne(@Param('id') id: Uuid): Promise<WalletEntity> {
    return this.walletService.findOne(id);
  }

  @Version('1')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Admin()
  @ApiOperation({ summary: 'Update a wallet by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: WalletEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Wallet not found' })
  update(@Param('id') id: Uuid, @Body() updateWalletDto: UpdateWalletDto): Promise<WalletEntity> {
    return this.walletService.update(id, updateWalletDto);
  }

  @Version('1')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Admin()
  @ApiOperation({ summary: 'Delete a wallet by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Wallet successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Wallet not found' })
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.walletService.remove(id);
  }
}
