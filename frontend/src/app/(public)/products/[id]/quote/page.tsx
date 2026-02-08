import Link from 'next/link';
import { Product, getProductBySlug, getAllProducts } from '@/lib/sanity.queries';
import QuoteForm from './QuoteForm';

// Generate static params for all product quote pages
export async function generateStaticParams() {
  const products = await getAllProducts();
  
  return products.map((product) => ({
    id: product.slug.current,
  }));
}

// Revalidate every 60 seconds
export const revalidate = 60;

interface QuotePageProps {
  params: {
    id: string;
  };
}

export default async function QuotePage({ params }: QuotePageProps) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href={`/products/${product.slug.current}`} className="text-primary-600 hover:underline mb-6 inline-block">
          ← Back to Product
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get a Quote</h1>
          <p className="text-lg text-gray-600">
            Request a quote for <span className="font-semibold text-primary-600">{product.name}</span>
          </p>
        </div>

        <QuoteForm product={product} />
      </div>
    </div>
  );
}
