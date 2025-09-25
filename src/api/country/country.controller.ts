import { Uuid } from '@/common/types/common.type';
import { Controller, Get, HttpCode, HttpStatus, Param, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryService } from './country.service';
import { Country as CountryEntity } from './entities/country.entity';

@ApiTags('country')
@ApiBearerAuth()
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all countrie' })
  @ApiResponse({ status: HttpStatus.OK, type: [CountryEntity] })
  findAll(): Promise<CountryEntity[]> {
    return this.countryService.getActiveCountries();
  }

  @Version('1')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a country by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: CountryEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Country not found' })
  findOne(@Param('id') id: Uuid): Promise<CountryEntity> {
    return this.countryService.findCountryById(id);
  }
}
