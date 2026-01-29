import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote, QuoteStatus } from './quote.entity';
import { CreateQuoteDto, UpdateQuoteDto } from './quote.dto';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private quotesRepository: Repository<Quote>,
  ) {}

  async findAll(status?: QuoteStatus): Promise<Quote[]> {
    const queryBuilder = this.quotesRepository.createQueryBuilder('quote')
      .leftJoinAndSelect('quote.product', 'product')
      .leftJoinAndSelect('product.images', 'images');

    if (status) {
      queryBuilder.where('quote.status = :status', { status });
    }

    return queryBuilder.orderBy('quote.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Quote> {
    return this.quotesRepository.findOne({ where: { id } });
  }

  async create(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    const quote = this.quotesRepository.create(createQuoteDto);
    return this.quotesRepository.save(quote);
  }

  async updateStatus(id: string, updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
    await this.quotesRepository.update(id, updateQuoteDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.quotesRepository.delete(id);
  }

  async getStats(): Promise<any> {
    const total = await this.quotesRepository.count();
    const pending = await this.quotesRepository.count({ where: { status: QuoteStatus.PENDING } });
    const reviewed = await this.quotesRepository.count({ where: { status: QuoteStatus.REVIEWED } });
    const quoted = await this.quotesRepository.count({ where: { status: QuoteStatus.QUOTED } });
    const rejected = await this.quotesRepository.count({ where: { status: QuoteStatus.REJECTED } });

    return { total, pending, reviewed, quoted, rejected };
  }
}
