import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTaxRateDto } from './dto/create-tax-rate.dto';
import { UpdateTaxRateDto } from './dto/update-tax-rate.dto';
import { TaxRateService } from './tax-rate.service';

@Controller('tax-rate')
export class TaxRateController {
  constructor(private readonly taxRateService: TaxRateService) {}

  @Post()
  create(@Body() createTaxRateDto: CreateTaxRateDto) {
    return this.taxRateService.create(createTaxRateDto);
  }

  @Get()
  findAll() {
    return this.taxRateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxRateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaxRateDto: UpdateTaxRateDto) {
    return this.taxRateService.update(+id, updateTaxRateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxRateService.remove(+id);
  }
}
