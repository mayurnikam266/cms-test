'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { productService } from '@/lib/products';
import { getImageUrl } from '@/lib/api';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      const data = await productService.getById(params.id as string);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/products" className="text-primary-600 hover:underline mb-6 inline-block">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="bg-gray-100 rounded-xl overflow-hidden mb-4 aspect-square">
            {product.images.length > 0 ? (
              <img
                src={getImageUrl(product.images[selectedImage]?.url)}
                alt={product.images[selectedImage]?.altText || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={getImageUrl(image.url)}
                    alt={image.altText || `${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
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

          {product.stock > 0 ? (
            <div className="bg-solar-100 text-solar-800 px-4 py-2 rounded-lg inline-block mb-6">
              ✓ In Stock ({product.stock} available)
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

          {product.specifications && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Specifications</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {product.specifications}
                </pre>
              </div>
            </div>
          )}

          {product.sku && (
            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href={`/products/${product.id}/quote`}
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
