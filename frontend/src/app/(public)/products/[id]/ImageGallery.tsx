'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/sanity.queries';

interface ImageGalleryProps {
  images: any[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (images.length === 0) {
    return (
      <div>
        <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4 aspect-square">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Main Image */}
      <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4 aspect-square">
        <Image
          src={getImageUrl(images[selectedImage], 800)}
          alt={productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority={selectedImage === 0}
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index 
                  ? 'border-primary-600 ring-2 ring-primary-200' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={getImageUrl(image, 200)}
                alt={`${productName} ${index + 1}`}
                fill
                sizes="200px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
