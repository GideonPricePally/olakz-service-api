import { Uuid } from '@/common/types/common.type';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag as TagEntity } from './entities/tag.entity';
import { TagService } from './tag.service';

@ApiTags('tag')
@ApiBearerAuth()
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: HttpStatus.CREATED, type: TagEntity })
  create(@Body() createTagDto: CreateTagDto): Promise<TagEntity> {
    return this.tagService.create(createTagDto);
  }

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tag' })
  @ApiResponse({ status: HttpStatus.OK, type: [TagEntity] })
  findAll(): Promise<TagEntity[]> {
    return this.tagService.findAll();
  }

  @Version('1')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a tag by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: TagEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tag not found' })
  findOne(@Param('id') id: Uuid): Promise<TagEntity> {
    return this.tagService.findOne(id);
  }

  @Version('1')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a tag by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: TagEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tag not found' })
  update(@Param('id') id: Uuid, @Body() updateTagDto: UpdateTagDto): Promise<TagEntity> {
    return this.tagService.update(id, updateTagDto);
  }

  @Version('1')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a tag by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Tag successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tag not found' })
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.tagService.remove(id);
  }
}
