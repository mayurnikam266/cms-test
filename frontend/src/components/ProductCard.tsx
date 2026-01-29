import { Product } from '@/types';
import Link from 'next/link';
import { getImageUrl } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const featuredImage = product.images.find((img) => img.isFeatured) || product.images[0];

  return (
    <Link href={`/products/${product.id}`}>
      <div className="card hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col group border border-gray-200 hover:border-primary-300">
        <div className="relative h-72 bg-gray-50 rounded-t-lg overflow-hidden">
          {featuredImage ? (
            <img
              src={getImageUrl(featuredImage.url)}
              alt={featuredImage.altText || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.stock === 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Out of Stock
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Low Stock
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col p-5">
          <div className="text-xs text-primary-600 font-semibold mb-2 uppercase tracking-wide">
            {product.category?.name || 'Uncategorized'}
          </div>
          
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div>
              <span className="text-2xl font-bold text-primary-600">
                ₹{parseFloat(product.price).toFixed(2)}
              </span>
              {product.stock > 0 && (
                <p className="text-xs text-green-600 font-medium mt-1">
                  ✓ In Stock ({product.stock})
                </p>
              )}
            </div>
            <div className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-primary-700 transition-colors">
              View Details
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
