import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './product.entity';
import { Image } from './image.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) {}

  async findAll(onlyActive = true, categoryId?: string, onlyFeatured = false): Promise<Product[]> {
    const query = this.productsRepository.createQueryBuilder('product');

    if (onlyActive) {
      query.where('product.status = :status', { status: ProductStatus.ACTIVE });
    }

    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (onlyFeatured) {
      query.andWhere('product.featured = :featured', { featured: true });
    }

    return query
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .orderBy('product.createdAt', 'DESC')
      .getMany();
  }

  async findFeatured(): Promise<Product[]> {
    return this.productsRepository.find({
      where: { 
        status: ProductStatus.ACTIVE,
        featured: true 
      },
      relations: ['category', 'images'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'images'],
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productsRepository.update(id, updateProductDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }

  async updateStatus(id: string, status: ProductStatus): Promise<Product> {
    await this.productsRepository.update(id, { status });
    return this.findById(id);
  }

  async addImage(
    productId: string, 
    imageData: { url: string; key: string; isFeatured?: boolean; altText?: string }
  ): Promise<Image> {
    const image = this.imagesRepository.create({
      product: { id: productId },
      key: imageData.key,
      url: imageData.url,
      altText: imageData.altText,
      isFeatured: imageData.isFeatured || false,
    });
    return this.imagesRepository.save(image);
  }

  async removeImage(imageId: string): Promise<void> {
    await this.imagesRepository.delete(imageId);
  }

  async getStats() {
    const total = await this.productsRepository.count();
    const active = await this.productsRepository.count({
      where: { status: ProductStatus.ACTIVE },
    });
    const categories = await this.productsRepository.query(`
      SELECT c.id, c.name, COUNT(p.id) as count
      FROM categories c
      LEFT JOIN products p ON p.categoryId = c.id
      GROUP BY c.id, c.name
    `);

    return {
      total,
      active,
      categories,
    };
  }
}
