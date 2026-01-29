'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/lib/products';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await productService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="text-gray-600 text-sm mb-1">Total Products</div>
          <div className="text-4xl font-bold text-primary-600">{stats?.total || 0}</div>
        </div>
        <div className="card">
          <div className="text-gray-600 text-sm mb-1">Active Products</div>
          <div className="text-4xl font-bold text-solar-600">{stats?.active || 0}</div>
        </div>
        <div className="card">
          <div className="text-gray-600 text-sm mb-1">Categories</div>
          <div className="text-4xl font-bold text-gray-700">
            {stats?.categories?.length || 0}
          </div>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Products by Category</h2>
        <div className="space-y-3">
          {stats?.categories?.map((cat: any) => (
            <div key={cat.id} className="flex items-center justify-between">
              <span className="text-gray-700">{cat.name}</span>
              <span className="font-semibold text-primary-600">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/products/new" className="card hover:shadow-xl transition">
          <div className="text-4xl mb-3">➕</div>
          <h3 className="text-lg font-semibold mb-2">Add New Product</h3>
          <p className="text-sm text-gray-600">Create a new product listing</p>
        </Link>

        <Link href="/admin/categories" className="card hover:shadow-xl transition">
          <div className="text-4xl mb-3">📁</div>
          <h3 className="text-lg font-semibold mb-2">Manage Categories</h3>
          <p className="text-sm text-gray-600">Add or edit product categories</p>
        </Link>
      </div>
    </div>
  );
}
