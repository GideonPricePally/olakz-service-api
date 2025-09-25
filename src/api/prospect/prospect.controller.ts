import { Uuid } from '@/common/types/common.type';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { Prospect as ProspectEntity } from './entities/prospect.entity';
import { ProspectService } from './prospect.service';

@ApiTags('prospect')
@ApiBearerAuth()
@Controller('prospect')
export class ProspectController {
  constructor(private readonly prospectService: ProspectService) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new prospect' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ProspectEntity })
  create(@Body() createProspectDto: CreateProspectDto): Promise<ProspectEntity> {
    return this.prospectService?.save(createProspectDto);
  }

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all prospect' })
  @ApiResponse({ status: HttpStatus.OK, type: [ProspectEntity] })
  findAll(): Promise<ProspectEntity[]> {
    return this.prospectService.findAll();
  }

  @Version('1')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a prospect by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ProspectEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Prospect not found' })
  findOne(@Param('id') id: Uuid): Promise<ProspectEntity> {
    return this.prospectService.findOne(id);
  }

  @Version('1')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a prospect by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ProspectEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Prospect not found' })
  update(@Param('id') id: Uuid, @Body() updateProspectDto: UpdateProspectDto): Promise<ProspectEntity> {
    return this.prospectService.update(id, updateProspectDto);
  }

  @Version('1')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a prospect by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Prospect successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Prospect not found' })
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.prospectService.remove(id);
  }
}
