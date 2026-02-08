import Link from 'next/link';
import Image from 'next/image';
import { Product, getProductBySlug, getAllProducts, getImageUrl } from '@/lib/sanity.queries';
import ImageGallery from './ImageGallery';

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getAllProducts();
  
  return products.map((product) => ({
    id: product.slug.current,
  }));
}

// Revalidate every 60 seconds
export const revalidate = 60;

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="py-20">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/products" className="btn-primary inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.gallery || [];
  if (product.featuredImage && !images.some(img => img._id === product.featuredImage._id)) {
    images.unshift(product.featuredImage);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/products" className="text-primary-600 hover:underline mb-6 inline-block">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images - Use Client Component for Gallery */}
        <ImageGallery images={images} productName={product.name} />

        {/* Product Info */}
        <div>
          <div className="text-sm text-primary-600 font-medium mb-2">
            {product.category?.name || 'Uncategorized'}
          </div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <div className="text-4xl font-bold text-primary-600 mb-6">
            ₹{parseFloat(String(product.price)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

          {product.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

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
              href="/contact"
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
