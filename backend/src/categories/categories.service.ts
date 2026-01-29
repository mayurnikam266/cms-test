import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(onlyActive = true): Promise<Category[]> {
    const query = this.categoriesRepository.createQueryBuilder('category');
    
    if (onlyActive) {
      query.where('category.isActive = :isActive', { isActive: true });
    }

    return query.orderBy('category.name', 'ASC').getMany();
  }

  async findById(id: string): Promise<Category | null> {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.categoriesRepository.update(id, updateCategoryDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.categoriesRepository.delete(id);
  }

  async toggle(id: string): Promise<Category> {
    const category = await this.findById(id);
    category.isActive = !category.isActive;
    return this.categoriesRepository.save(category);
  }
}
