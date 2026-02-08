'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/sanity.queries';
import { redirectToWhatsApp } from '@/lib/whatsapp';

interface QuoteFormProps {
  product: Product;
}

export default function QuoteForm({ product }: QuoteFormProps) {
  const router = useRouter();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate required fields
    if (!formData.name || !formData.phone || !formData.address || !formData.expectedDeliveryDate) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Create WhatsApp message with all details
      const message = `
*Quote Request*

*Product:* ${product.name}
${product.category ? `*Category:* ${product.category.name}` : ''}
*Price:* ₹${parseFloat(String(product.price)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

*Customer Details:*
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}
Expected Delivery Date: ${formData.expectedDeliveryDate}

${formData.message ? `*Additional Message:*\n${formData.message}` : ''}
      `.trim();

      // Redirect to WhatsApp
      redirectToWhatsApp(message);
      
      setSuccess(true);
      
      // Redirect back to products after 3 seconds
      setTimeout(() => {
        router.push('/products');
      }, 3000);
    } catch (error: any) {
      console.error('Failed to submit quote request:', error);
      setError('Failed to submit quote request. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Quote Request Sent!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your interest. We'll contact you soon with a detailed quote for {product.name}.
        </p>
        <p className="text-sm text-gray-500">Redirecting to products...</p>
      </div>
    );
  }

  return (
    <>
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
              placeholder="Priya Sharma"
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
              placeholder="priya.sharma@gmail.com"
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
              placeholder="+91 98765 43210"
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
              placeholder="123, MG Road, Pune, Maharashtra - 411001"
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
              placeholder="Please provide installation details or any specific requirements..."
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">{product.name}</p>
              {product.category && (
                <p className="text-sm text-gray-600">Category: {product.category.name}</p>
              )}
              {product.description && (
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              )}
              <p className="text-lg font-bold text-primary-600 mt-2">
                ₹{parseFloat(String(product.price)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Send Quote Request'}
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
    </>
  );
}
