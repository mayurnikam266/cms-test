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
import { QuotesService } from './quotes.service';
import { CreateQuoteDto, UpdateQuoteDto } from './quote.dto';
import { QuoteStatus } from './quote.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/quotes')
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Post()
  async createQuote(@Body() createQuoteDto: CreateQuoteDto) {
    try {
      const quote = await this.quotesService.create(createQuoteDto);
      return { 
        success: true, 
        message: 'Quote request submitted successfully. We will contact you soon with a quote!',
        data: quote 
      };
    } catch (error) {
      console.error('Quote creation error:', error);
      throw new BadRequestException(error.message || 'Failed to submit quote request');
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAllQuotes(@Query('status') status?: QuoteStatus) {
    const quotes = await this.quotesService.findAll(status);
    return { data: quotes };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('stats')
  async getStats() {
    const stats = await this.quotesService.getStats();
    return { data: stats };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  async getQuote(@Param('id') id: string) {
    const quote = await this.quotesService.findById(id);
    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }
    return { data: quote };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  async updateQuoteStatus(
    @Param('id') id: string,
    @Body() updateQuoteDto: UpdateQuoteDto,
  ) {
    const existing = await this.quotesService.findById(id);
    if (!existing) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }
    try {
      const quote = await this.quotesService.updateStatus(id, updateQuoteDto);
      return { success: true, message: 'Quote status updated', data: quote };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to update quote');
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteQuote(@Param('id') id: string) {
    const existing = await this.quotesService.findById(id);
    if (!existing) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }
    try {
      await this.quotesService.delete(id);
      return { success: true, message: 'Quote deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete quote');
    }
  }
}
