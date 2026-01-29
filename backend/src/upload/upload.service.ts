import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'products');

  async uploadImage(file: Express.Multer.File, productName?: string): Promise<string> {
    try {
      // Validate file
      if (!this.validateImageFile(file.mimetype, file.size)) {
        throw new Error('Invalid image file. Allowed types: JPG, PNG, WEBP. Max size: 10MB');
      }

      // Ensure upload directory exists
      await this.ensureUploadDir();

      const fileExt = path.extname(file.originalname);
      // Tag image with product name for better organization
      const slug = productName 
        ? `${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${uuidv4().slice(0, 8)}`
        : uuidv4();
      const fileName = `${slug}${fileExt}`;
      const filePath = path.join(this.uploadDir, fileName);

      // Optimize image with sharp - reduce size without losing quality
      // Support multiple formats and compress intelligently
      const image = sharp(file.buffer);
      const metadata = await image.metadata();

      // Validate image metadata
      if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image file: Unable to read image dimensions');
      }

      // Resize large images while maintaining aspect ratio
      if (metadata.width > 1200 || metadata.height > 1200) {
        image.resize(1200, 1200, { 
          fit: 'inside', 
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3 
        });
      }

      // Apply format-specific compression
      if (fileExt === '.png') {
        await image
          .png({ compressionLevel: 9, quality: 90 })
          .toFile(filePath);
      } else if (fileExt === '.webp') {
        await image
          .webp({ quality: 90, effort: 6 })
          .toFile(filePath);
      } else {
        // Default to JPEG for other formats
        await image
          .jpeg({ quality: 90, progressive: true, mozjpeg: true })
          .toFile(filePath);
      }

      // Return URL path
      return `/uploads/products/${fileName}`;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const fileName = path.basename(filePath);
      const fullPath = path.join(this.uploadDir, fileName);
      await fs.unlink(fullPath);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }

  validateImageFile(mimeType: string, fileSize: number): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    return allowedTypes.includes(mimeType) && fileSize <= maxSize;
  }

  async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }
}
