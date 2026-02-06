import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement, AnnouncementStatus } from './announcement.entity';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
  ) {}

  async findAll(onlyActive = false): Promise<Announcement[]> {
    const query = this.announcementsRepository.createQueryBuilder('announcement');

    if (onlyActive) {
      query
        .where('announcement.status = :status', { status: AnnouncementStatus.ACTIVE })
        .andWhere('announcement.isActive = :isActive', { isActive: true });
    }

    return query
      .orderBy('announcement.displayOrder', 'ASC')
      .addOrderBy('announcement.createdAt', 'DESC')
      .getMany();
  }

  async findById(id: string): Promise<Announcement | null> {
    const announcement = await this.announcementsRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }

    return announcement;
  }

  async create(createDto: CreateAnnouncementDto): Promise<Announcement> {
    const announcement = this.announcementsRepository.create(createDto);
    return this.announcementsRepository.save(announcement);
  }

  async update(id: string, updateDto: UpdateAnnouncementDto): Promise<Announcement> {
    const announcement = await this.findById(id);

    Object.assign(announcement, updateDto);

    return this.announcementsRepository.save(announcement);
  }

  async delete(id: string): Promise<void> {
    const announcement = await this.findById(id);
    await this.announcementsRepository.remove(announcement);
  }

  async count(): Promise<number> {
    return this.announcementsRepository.count({
      where: {
        status: AnnouncementStatus.ACTIVE,
        isActive: true,
      },
    });
  }

  async hasAnnouncements(): Promise<boolean> {
    const count = await this.count();
    return count > 0;
  }
}
