import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'products');
  private readonly announcementsDir = path.join(process.cwd(), 'uploads', 'announcements');

  async uploadImage(file: Express.Multer.File, productNameOrFolder?: string): Promise<{ url: string; key: string }> {
    try {
      // Validate file
      if (!this.validateImageFile(file.mimetype, file.size)) {
        throw new Error('Invalid image file. Allowed types: JPG, PNG, WEBP. Max size: 10MB');
      }

      // Determine if this is for announcements or products
      const isAnnouncement = productNameOrFolder === 'announcements';
      const uploadDir = isAnnouncement ? this.announcementsDir : this.uploadDir;

      // Ensure upload directory exists
      await this.ensureUploadDir(uploadDir);

      // Generate unique file name with product name or announcement for better organization
      const fileExt = path.extname(file.originalname).toLowerCase();
      const slug = productNameOrFolder && !isAnnouncement
        ? `${productNameOrFolder.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${uuidv4().slice(0, 8)}`
        : `${isAnnouncement ? 'announcement' : 'product'}-${uuidv4().slice(0, 8)}`;
      const fileName = `${slug}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);

      // Optimize image with sharp - reduce size without losing quality
      // Support multiple formats and compress intelligently
      const image = sharp(file.buffer);
      const metadata = await image.metadata();

      // Validate image metadata
      if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image file: Unable to read image dimensions');
      }

      // Apply different compression strategies based on type
      if (isAnnouncement) {
        // Announcements: Allow larger size but still optimize (1920px max)
        if (metadata.width > 1920 || metadata.height > 1920) {
          image.resize(1920, 1920, { 
            fit: 'inside', 
            withoutEnlargement: true,
            kernel: sharp.kernel.lanczos3 
          });
        }
      } else {
        // Products: More aggressive compression (1200px max)
        if (metadata.width > 1200 || metadata.height > 1200) {
          image.resize(1200, 1200, { 
            fit: 'inside', 
            withoutEnlargement: true,
            kernel: sharp.kernel.lanczos3 
          });
        }
      }

      // Compress with format-specific optimization with high quality
      const compressionQuality = isAnnouncement ? 90 : 85; // Higher quality for announcements
      
      if (fileExt === '.png') {
        await image
          .png({ compressionLevel: 9, quality: compressionQuality })
          .toFile(filePath);
      } else if (fileExt === '.webp') {
        await image
          .webp({ quality: compressionQuality, effort: 6 })
          .toFile(filePath);
      } else {
        // Default to JPEG for other formats
        await image
          .jpeg({ quality: compressionQuality, progressive: true, mozjpeg: true })
          .toFile(filePath);
      }

      // Return URL path and key
      const urlPath = isAnnouncement 
        ? `/uploads/announcements/${fileName}`
        : `/uploads/products/${fileName}`;
        
      return {
        url: urlPath,
        key: fileName
      };
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  // Backward compatibility: Return just the URL string for existing product upload code
  async uploadImageUrl(file: Express.Multer.File, productName?: string): Promise<string> {
    const result = await this.uploadImage(file, productName);
    return result.url;
  }

  async deleteImage(filePath: string): Promise<void> {
    try {
      const fileName = path.basename(filePath);
      // Determine which directory based on path
      const isAnnouncement = filePath.includes('announcements');
      const uploadDir = isAnnouncement ? this.announcementsDir : this.uploadDir;
      const fullPath = path.join(uploadDir, fileName);
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

  async ensureUploadDir(directory?: string): Promise<void> {
    const dir = directory || this.uploadDir;
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}
