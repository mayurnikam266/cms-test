'use client';

import { useEffect, useState } from 'react';
import { quoteService, Quote } from '@/lib/contacts';
import { getImageUrl } from '@/lib/api';

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    loadQuotes();
  }, [filter]);

  const loadQuotes = async () => {
    try {
      const data = await quoteService.getAll(filter || undefined);
      setQuotes(data);
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await quoteService.updateStatus(id, status);
      loadQuotes();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote request?')) return;

    try {
      await quoteService.delete(id);
      setQuotes(quotes.filter((q) => q.id !== id));
    } catch (error) {
      console.error('Failed to delete quote:', error);
      alert('Failed to delete quote');
    }
  };

  if (loading) {
    return <div>Loading quotes...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quote Requests</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded text-sm ${!filter ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded text-sm ${filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('reviewed')}
            className={`px-4 py-2 rounded text-sm ${filter === 'reviewed' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Reviewed
          </button>
          <button
            onClick={() => setFilter('quoted')}
            className={`px-4 py-2 rounded text-sm ${filter === 'quoted' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Quoted
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded text-sm ${filter === 'rejected' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Rejected
          </button>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No quote requests found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{quote.name}</div>
                    <div className="text-sm text-gray-600">{quote.email}</div>
                    <div className="text-sm text-gray-600">{quote.phone}</div>
                    <div className="text-xs text-gray-500 mt-1">{quote.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {quote.product?.images?.[0] && (
                        <img
                          src={getImageUrl(quote.product.images[0].url)}
                          alt={quote.productName}
                          className="w-12 h-12 rounded object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="font-medium">{quote.productName}</div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">Quote Price:</span> ₹{parseFloat(quote.productPrice?.toString() || '0').toFixed(2)}
                        </div>
                        {quote.product?.price && parseFloat(quote.product.price) !== parseFloat(quote.productPrice?.toString() || '0') && (
                          <div className="text-xs text-orange-600">
                            Current Price: ₹{parseFloat(quote.product.price).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(quote.expectedDeliveryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={quote.status}
                      onChange={(e) => handleStatusUpdate(quote.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded border ${
                        quote.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : quote.status === 'quoted'
                          ? 'bg-green-100 text-green-800'
                          : quote.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="quoted">Quoted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => {
                        const details = [
                          `Customer: ${quote.name}`,
                          `Email: ${quote.email}`,
                          `Phone: ${quote.phone}`,
                          `Address: ${quote.address}`,
                          ``,
                          `Product: ${quote.product?.name || 'N/A'}`,
                          `Quoted Price: ₹${parseFloat(quote.productPrice?.toString() || '0').toFixed(2)}`,
                          quote.product?.price && parseFloat(quote.product.price) !== parseFloat(quote.productPrice?.toString() || '0') 
                            ? `Current Price: ₹${parseFloat(quote.product.price).toFixed(2)} (Price changed!)` 
                            : '',
                          ``,
                          `Expected Delivery: ${new Date(quote.expectedDeliveryDate).toLocaleDateString()}`,
                          `Request Date: ${new Date(quote.createdAt).toLocaleString()}`,
                          ``,
                          `Message: ${quote.message || 'No message provided'}`
                        ].filter(line => line !== '').join('\\n');
                        alert(details);
                      }}
                      className="text-primary-600 hover:underline mr-3"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(quote.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
