import { UserPayload, Uuid } from '@/common/types/common.type';
import { Admin } from '@/decorators/admin.decorator';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region as RegionEntity } from './entities/region.entity';
import { RegionService } from './region.service';

@ApiTags('region')
@ApiBearerAuth()
@Controller('region')
@Admin()
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new region' })
  @ApiResponse({ status: HttpStatus.CREATED, type: RegionEntity })
  create(@Req() req: Request & { user: UserPayload }, @Body() createRegionDto: CreateRegionDto): Promise<RegionEntity> {
    return this.regionService.create(req.user, createRegionDto);
  }

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all region' })
  @ApiResponse({ status: HttpStatus.OK, type: [RegionEntity] })
  findAll(): Promise<RegionEntity[]> {
    return this.regionService.findAll();
  }

  @Version('1')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a region by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: RegionEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Region not found' })
  findOne(@Param('id') id: Uuid): Promise<RegionEntity> {
    return this.regionService.findOneById(id);
  }

  @Version('1')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a region by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: RegionEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Region not found' })
  update(@Req() req: Request & { user: UserPayload }, @Param('id') id: Uuid, @Body() updateRegionDto: UpdateRegionDto): Promise<RegionEntity> {
    return this.regionService.update(req.user, id, updateRegionDto);
  }

  @Version('1')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a region by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Region successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Region not found' })
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.regionService.remove(id);
  }
}
