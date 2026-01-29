import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact, ContactStatus } from './contact.entity';
import { CreateContactDto, UpdateContactDto } from './contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  async findAll(status?: ContactStatus): Promise<Contact[]> {
    const queryBuilder = this.contactsRepository.createQueryBuilder('contact');

    if (status) {
      queryBuilder.where('contact.status = :status', { status });
    }

    return queryBuilder.orderBy('contact.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Contact> {
    return this.contactsRepository.findOne({ where: { id } });
  }

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactsRepository.create(createContactDto);
    return this.contactsRepository.save(contact);
  }

  async updateStatus(id: string, updateContactDto: UpdateContactDto): Promise<Contact> {
    await this.contactsRepository.update(id, updateContactDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.contactsRepository.delete(id);
  }

  async getStats(): Promise<any> {
    const total = await this.contactsRepository.count();
    const newCount = await this.contactsRepository.count({ where: { status: ContactStatus.NEW } });
    const reviewed = await this.contactsRepository.count({ where: { status: ContactStatus.REVIEWED } });
    const responded = await this.contactsRepository.count({ where: { status: ContactStatus.RESPONDED } });

    return { total, new: newCount, reviewed, responded };
  }
}
