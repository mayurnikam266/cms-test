import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { Category, Product } from '@/types';

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?featured=true`, {
      cache: 'no-store',
    });
    if (!res.ok) return { data: [] };
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { data: [] };
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
      cache: 'no-store',
    });
    if (!res.ok) return { data: [] };
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return { data: [] };
  }
}

export default async function HomePage() {
  // Fetch categories and products
  const categoriesData = await getCategories();
  const productsData = await getProducts();
  
  const categories = categoriesData.data || [];
  const products = productsData.data || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-solar-50 to-primary-50 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Power Your Future with <span className="text-primary-600">Solar Energy</span>
              </h1>
              <p className="text-sm text-gray-600 mb-3">
                Leading provider of high-efficiency solar panels and electronic solutions.
              </p>
              <div className="flex gap-2">
                <Link href="/products" className="btn-primary px-4 py-1.5 text-sm">
                  Browse Products
                </Link>
                <Link href="/contact" className="btn-secondary px-4 py-1.5 text-sm">
                  Get a Quote
                </Link>
              </div>
            </div>

            {/* Right Images */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                {/* Solar Panel Image */}
                <div className="relative overflow-hidden rounded-lg shadow-md group aspect-square">
                  <Image 
                    src="/images/solar-panel.jpg" 
                    alt="Solar Panels" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-semibold">Solar Panels</p>
                  </div>
                </div>
                {/* Electronics */}
                <div className="relative overflow-hidden rounded-lg shadow-md group aspect-video">
                  <Image 
                    src="/images/electronics.jpg" 
                    alt="Electronics" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-semibold">Electronics</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 pt-4">
                {/* Energy Solutions */}
                <div className="relative overflow-hidden rounded-lg shadow-md group aspect-video">
                  <Image 
                    src="/images/energy.jpg" 
                    alt="Energy Solutions" 
                    fill
                    className="object-contain"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-semibold">Energy Solutions</p>
                  </div>
                </div>
                {/* Energy Storage */}
                <div className="relative overflow-hidden rounded-lg shadow-md group aspect-square">
                  <Image 
                    src="/images/battery.jpg" 
                    alt="Energy Storage" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-semibold">Energy Storage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Sidebar */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Categories */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Shop by Category
                </h2>
                <div className="space-y-2">
                  {categories.map((category: Category) => (
                    <Link 
                      key={category.id}
                      href={`/products?category=${category.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Products */}
            <div className="flex-1">
              <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Featured Products</h2>
                <p className="text-gray-700 text-sm">Discover our best-selling solar products</p>
              </div>
              
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products available yet.</p>
                  <p className="text-gray-400 mt-2">Check back soon for new arrivals!</p>
                </div>
              )}
              
              {products.length > 0 && (
                <div className="text-center mt-12">
                  <Link href="/products" className="btn-primary text-lg px-8 py-3">
                    View All Products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Test Agency Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2">
              TRUSTED & AFFORDABLE
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Test Agency?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Test Agency stands out for its trusted expertise, high-quality solar and electronic products, 
              affordable solutions, and 24×7 customer support. With ethical practices, transparent dealings, 
              customized project planning, and the ability to handle bulk orders across wide regions, we ensure 
              long-lasting, efficient, and reliable solutions for every customer.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-primary-100">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                High-Performance Products
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Quality solar and electronic products backed by warranty for long-term efficiency and reliability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-solar-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-solar-100">
              <div className="w-14 h-14 bg-gradient-to-br from-solar-500 to-solar-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Expert Consultation
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Customized solutions designed to match your unique energy and technology needs with professional guidance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-green-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Professional Installation
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Seamless setup with strict quality assurance at every step by our certified technicians.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Smart Savings & Support
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Save money and the planet with reliable 24×7 customer care and after-sales support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Go Solar?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Contact our experts for a free consultation and custom quote
          </p>
          <Link href="/contact" className="bg-white text-primary-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition inline-block">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
