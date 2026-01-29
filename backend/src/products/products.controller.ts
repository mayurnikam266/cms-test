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
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductStatus } from './product.entity';

@Controller('api/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAllProducts(
    @Query('categoryId') categoryId?: string,
    @Query('all') all?: string,
    @Query('featured') featured?: string,
  ) {
    const products = await this.productsService.findAll(
      all !== 'true', 
      categoryId, 
      featured === 'true'
    );
    return { data: products };
  }

  @Get('featured')
  async getFeaturedProducts() {
    const products = await this.productsService.findFeatured();
    return { data: products };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.productsService.getStats();
    return { data: stats };
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productsService.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return { data: product };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productsService.create(createProductDto);
      return { success: true, message: 'Product created successfully', data: product };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create product');
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const existing = await this.productsService.findById(id);
    if (!existing) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    try {
      console.log('Updating product with DTO:', JSON.stringify(updateProductDto, null, 2));
      const product = await this.productsService.update(id, updateProductDto);
      return { success: true, message: 'Product updated successfully', data: product };
    } catch (error) {
      console.error('Product update error:', error);
      throw new BadRequestException(error.message || 'Failed to update product');
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const existing = await this.productsService.findById(id);
    if (!existing) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    try {
      await this.productsService.delete(id);
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete product');
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ProductStatus,
  ) {
    const product = await this.productsService.updateStatus(id, status);
    return { message: 'Product status updated', data: product };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/images')
  async addImage(
    @Param('id') id: string,
    @Body() imageData: { url: string; key: string; isFeatured?: boolean; altText?: string },
  ) {
    const image = await this.productsService.addImage(id, imageData);
    return { message: 'Image added to product', data: image };
  }
}
