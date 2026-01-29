import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto } from './contact.dto';
import { ContactStatus } from './contact.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Post()
  async createContact(@Body() createContactDto: CreateContactDto) {
    try {
      const contact = await this.contactsService.create(createContactDto);
      return { 
        success: true, 
        message: 'Contact form submitted successfully. We will get back to you soon!',
        data: contact 
      };
    } catch (error) {
      console.error('Contact creation error:', error);
      throw new BadRequestException(error.message || 'Failed to submit contact form');
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAllContacts(@Query('status') status?: ContactStatus) {
    const contacts = await this.contactsService.findAll(status);
    return { data: contacts };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('stats')
  async getStats() {
    const stats = await this.contactsService.getStats();
    return { data: stats };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  async getContact(@Param('id') id: string) {
    const contact = await this.contactsService.findById(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return { data: contact };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  async updateContactStatus(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    const existing = await this.contactsService.findById(id);
    if (!existing) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    try {
      const contact = await this.contactsService.updateStatus(id, updateContactDto);
      return { success: true, message: 'Contact status updated', data: contact };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to update contact');
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteContact(@Param('id') id: string) {
    const existing = await this.contactsService.findById(id);
    if (!existing) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    try {
      await this.contactsService.delete(id);
      return { success: true, message: 'Contact deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete contact');
    }
  }
}
