import { IsArray, IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  name: string;

  @IsString()
  currency_code: string;

  @IsBoolean()
  @IsOptional()
  gift_cards_taxable?: boolean;

  @IsBoolean()
  @IsOptional()
  automatic_taxes?: boolean;

  @IsArray()
  @IsString({ each: true })
  countries: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  payment_providers?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fulfillment_providers?: string[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsBoolean()
  @IsOptional()
  includes_tax?: boolean;
}
