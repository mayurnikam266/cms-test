import Link from 'next/link';
import { Product, Category } from '@/types';
import { getAllProducts, getAllCategories } from '@/lib/sanity.queries';
import ProductCard from '@/components/ProductCard';

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function ProductsPage() {
  // Fetch all products and categories from Sanity
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Our Products</h1>
        <p className="text-gray-600">Browse our complete collection of solar products</p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="px-6 py-3 rounded-lg font-medium bg-primary-600 text-white shadow-lg transition-all hover:bg-primary-700"
          >
            All Products
          </Link>
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/products?category=${category.slug.current}`}
              className="px-6 py-3 rounded-lg font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-all"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Available</h3>
          <p className="text-gray-600 text-lg">Please check back later or contact us for product inquiries.</p>
          <Link href="/contact" className="btn-primary inline-block mt-6">
            Contact Us
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{products.length}</span> {products.length === 1 ? 'product' : 'products'}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
