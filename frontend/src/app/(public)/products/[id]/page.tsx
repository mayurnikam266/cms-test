'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product, getProductBySlug, getImageUrl } from '@/lib/sanity.queries';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const loadProduct = async () => {
    try {
      const data = await getProductBySlug(params.id as string);
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products" className="text-primary-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const images = product.gallery || [];
  if (product.featuredImage && !images.includes(product.featuredImage)) {
    images.unshift(product.featuredImage);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/products" className="text-primary-600 hover:underline mb-6 inline-block">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4 aspect-square">
            {images.length > 0 ? (
              <Image
                src={getImageUrl(images[selectedImage], 800)}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={getImageUrl(image, 200)}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="text-sm text-primary-600 font-medium mb-2">
            {product.category?.name || 'Uncategorized'}
          </div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <div className="text-4xl font-bold text-primary-600 mb-6">
            ₹{parseFloat(String(product.price)).toFixed(2)}
          </div>

          {product.inStock ? (
            <div className="bg-solar-100 text-solar-800 px-4 py-2 rounded-lg inline-block mb-6">
              ✓ In Stock
            </div>
          ) : (
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg inline-block mb-6">
              Out of Stock
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {product.specifications && product.specifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Specifications</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dl className="grid grid-cols-1 gap-2">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                      <dt className="font-medium text-gray-700">{spec.label}:</dt>
                      <dd className="text-gray-600">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href={`/products/${product.slug.current}/quote`}
              className="btn-primary inline-block text-center flex-1 px-8 py-4 text-lg"
            >
              Get a Quote
            </Link>
            <Link
              href="/contact"
              className="btn-secondary inline-block text-center flex-1 px-8 py-4 text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
