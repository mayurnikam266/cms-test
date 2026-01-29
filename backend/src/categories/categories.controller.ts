import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories() {
    const categories = await this.categoriesService.findAll();
    return { data: categories };
  }

  @Get(':id')
  async getCategory(@Param('id') id: string) {
    const category = await this.categoriesService.findById(id);
    return { data: category };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);
    return { message: 'Category created', data: category };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return { message: 'Category updated', data: category };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    await this.categoriesService.delete(id);
    return { message: 'Category deleted' };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id/toggle')
  async toggleCategory(@Param('id') id: string) {
    const category = await this.categoriesService.toggle(id);
    return { message: 'Category toggled', data: category };
  }
}
