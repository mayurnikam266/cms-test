import { 
  Controller, 
  Post, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException,
  Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/upload')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('productName') productName?: string
  ) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      if (!this.uploadService.validateImageFile(file.mimetype, file.size)) {
        throw new BadRequestException('Invalid file type or size. Allowed: JPG, PNG, WEBP (max 10MB)');
      }

      const url = await this.uploadService.uploadImage(file, productName);
      return { 
        success: true,
        url,
        message: 'Image uploaded and optimized successfully'
      };
    } catch (error) {
      console.error('Upload controller error:', error);
      throw new BadRequestException(error.message || 'Failed to upload image');
    }
  }
}
