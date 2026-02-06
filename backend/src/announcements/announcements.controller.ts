import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './announcement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  async findAll(@Query('active') active?: string) {
    const onlyActive = active === 'true';
    return this.announcementsService.findAll(onlyActive);
  }

  @Get('has-announcements')
  async hasAnnouncements() {
    const hasAnnouncements = await this.announcementsService.hasAnnouncements();
    return { hasAnnouncements };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.announcementsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() createDto: CreateAnnouncementDto) {
    return this.announcementsService.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id') id: string) {
    await this.announcementsService.delete(id);
    return { message: 'Announcement deleted successfully' };
  }
}
