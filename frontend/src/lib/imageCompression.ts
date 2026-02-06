import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
}

export const defaultCompressionOptions: CompressionOptions = {
  maxSizeMB: 1, // Maximum file size in MB
  maxWidthOrHeight: 1920, // Maximum width or height
  useWebWorker: true, // Use web worker for better performance
  quality: 0.85, // Quality between 0 and 1 (0.85 = 85% quality)
};

/**
 * Compress an image file with high quality but smaller size
 * @param file - The image file to compress
 * @param options - Compression options (optional)
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = defaultCompressionOptions
): Promise<File> {
  try {
    console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    
    const compressedFile = await imageCompression(file, {
      maxSizeMB: options.maxSizeMB || 1,
      maxWidthOrHeight: options.maxWidthOrHeight || 1920,
      useWebWorker: options.useWebWorker !== false,
      initialQuality: options.quality || 0.85,
    });
    
    console.log('Compressed file size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('Compression ratio:', ((1 - compressedFile.size / file.size) * 100).toFixed(1) + '%');
    
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Compress image for announcements (optimized for large hero images)
 */
export async function compressAnnouncementImage(file: File): Promise<File> {
  return compressImage(file, {
    maxSizeMB: 1.5, // Allow slightly larger for hero images
    maxWidthOrHeight: 1920, // Full HD width
    useWebWorker: true,
    quality: 0.85, // High quality
  });
}

/**
 * Compress image for thumbnails
 */
export async function compressThumbnail(file: File): Promise<File> {
  return compressImage(file, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 500,
    useWebWorker: true,
    quality: 0.80,
  });
}

/**
 * Get image dimensions from file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    
    img.src = objectUrl;
  });
}

/**
 * Validate image file
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }
  
  // Check file size (max 10MB before compression)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be smaller than 10MB' };
  }
  
  // Check file type (accept common formats)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Only JPEG, PNG, and WebP images are allowed' 
    };
  }
  
  return { valid: true };
}
