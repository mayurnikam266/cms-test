'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { contactService } from '@/lib/contacts';

export default function ContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await contactService.create(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error: any) {
      console.error('Failed to submit contact form:', error);
      setError(error.response?.data?.message || 'Failed to submit contact form. Please try again.');
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for contacting us. We'll get back to you as soon as possible.
          </p>
          <p className="text-sm text-gray-500">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-base text-gray-600">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Information Boxes */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* India Office Address */}
            <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-primary-500 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-3 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">India Office</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Plot No. 45, Sector 18<br />
                  Electronics City, Phase 2<br />
                  Bangalore, Karnataka 560100<br />
                  India
                </p>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-green-500 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-3 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Phone Number</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="block font-semibold text-gray-900 mb-1">India Office</span>
                  <a href="tel:+919876543210" className="text-primary-600 hover:text-primary-700">+91 98765 43210</a><br />
                  <a href="tel:+918012345678" className="text-primary-600 hover:text-primary-700">+91 80123 45678</a><br />
                  <span className="block font-semibold text-gray-900 mt-2 mb-1">Toll Free</span>
                  <a href="tel:1800123456" className="text-primary-600 hover:text-primary-700">1800-123-456</a>
                </p>
              </div>
            </div>

            {/* Email Us */}
            <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-3 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="block font-semibold text-gray-900 mb-1">General Inquiries</span>
                  <a href="mailto:info@test-agency.in" className="text-primary-600 hover:text-primary-700">info@test-agency.in</a><br />
                  <span className="block font-semibold text-gray-900 mt-2 mb-1">Sales & Quotes</span>
                  <a href="mailto:sales@test-agency.in" className="text-primary-600 hover:text-primary-700">sales@test-agency.in</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mb-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4 text-center">
          <h3 className="text-base font-bold text-gray-900 mb-2">Business Hours (IST)</h3>
          <p className="text-sm text-gray-700">
            Monday - Saturday: 9:00 AM - 7:00 PM<br />
            Sunday: 10:00 AM - 5:00 PM
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 rounded">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Contact Form - Compact */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label text-sm">Your Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input text-sm"
                  required
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="label text-sm">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input text-sm"
                  required
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="label text-sm">Phone Number (Optional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input text-sm"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="label text-sm">Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="input text-sm"
                rows={4}
                required
                placeholder="Tell us what you need help with..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary text-sm py-2"
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
