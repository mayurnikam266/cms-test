'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Product } from '@/types';
import { productService } from '@/lib/products';
import { quoteService } from '@/lib/contacts';

export default function QuotePage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    expectedDeliveryDate: '',
    message: '',
  });

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const data = await productService.getById(productId);
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
      setError('Product not found');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!product) {
      setError('Product not found');
      setLoading(false);
      return;
    }

    try {
      const response = await quoteService.create({
        ...formData,
        productId,
        productName: product.name,
        productPrice: parseFloat(String(product.price)),
      });
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/products');
      }, 3000);
    } catch (error: any) {
      console.error('Failed to submit quote request:', error);
      setError(error.response?.data?.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quote Request Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your interest. We'll contact you soon with a detailed quote for {product?.name}.
          </p>
          <p className="text-sm text-gray-500">Redirecting to products...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get a Quote</h1>
          <p className="text-lg text-gray-600">
            Request a quote for <span className="font-semibold text-primary-600">{product.name}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Your Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="label">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                required
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="label">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
                required
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="label">Delivery Address *</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input"
                rows={3}
                required
                placeholder="Enter your complete delivery address"
              />
            </div>

            <div>
              <label className="label">Expected Delivery Date *</label>
              <input
                type="date"
                value={formData.expectedDeliveryDate}
                onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                className="input"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="label">Additional Message (Optional)</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="input"
                rows={4}
                placeholder="Any special requirements or questions?"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
              <p className="text-gray-700">{product.name}</p>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              <p className="text-lg font-bold text-primary-600 mt-2">₹{parseFloat(String(product.price)).toFixed(2)}</p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Request Quote'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
