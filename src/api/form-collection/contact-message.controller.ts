import { Uuid } from '@/common/types/common.type';
import { ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactMessageService } from './contact-message.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';
import { ContactMessage } from './entities/contact-message.entity';

@ApiTags('forms')
@Controller({
  path: 'forms',
  version: '1',
})
export class FormCollectionController {
  constructor(private readonly contactMessageService: ContactMessageService) {}

  @Post('contact-messages')
  @ApiPublic({
    statusCode: HttpStatus.CREATED,
    summary: 'signup request for a user',
    description: 'user signup request initiated successfully',
    type: ContactMessage,
  })
  create(@Body() createRoleDto: CreateContactMessageDto): Promise<ContactMessage> {
    return this.contactMessageService.create(createRoleDto);
  }

  @Get('contact-messages')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all role' })
  @ApiResponse({ status: HttpStatus.OK, type: [ContactMessage] })
  findAll(): Promise<ContactMessage[]> {
    return this.contactMessageService.findAll();
  }

  @Get('contact-messages/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ContactMessage })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  findOne(@Param('id') id: Uuid): Promise<ContactMessage> {
    return this.contactMessageService.findOne(id);
  }

  @Patch('contact-messages/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ContactMessage })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  update(@Param('id') id: Uuid, @Body() updateRoleDto: UpdateContactMessageDto): Promise<ContactMessage> {
    return this.contactMessageService.update(id, updateRoleDto);
  }

  @Delete('contact-messages/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Role successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.contactMessageService.remove(id);
  }
}
