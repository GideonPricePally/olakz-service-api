import { Controller, Get, HttpCode, HttpStatus, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { Currency as CurrencyEntity } from './entities/currency.entity';

@ApiTags('currency')
@ApiBearerAuth()
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Version('1')
  @Get('default')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get default currency' })
  @ApiResponse({ status: HttpStatus.OK, type: CurrencyEntity })
  getDefaultCurrency(): Promise<CurrencyEntity> {
    return this.currencyService.getDefaultCurrency();
  }
}
