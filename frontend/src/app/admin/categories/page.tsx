'use client';

import { useEffect, useState } from 'react';
import { Category } from '@/types';
import { categoryService } from '@/lib/categories';
import ClearCacheButton from '@/components/admin/ClearCacheButton';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await categoryService.update(editingId, formData);
      } else {
        await categoryService.create(formData);
      }

      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditingId(null);
      loadCategories();
    } catch (error: any) {
      console.error('Failed to save category:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save category';
      
      if (error.response?.status === 403) {
        setError('Access denied. Your session may have expired. Please clear cache and login again.');
      } else {
        setError(errorMsg);
        alert(errorMsg);
      }
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryService.delete(id);
      loadCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  const handleToggle = async (category: Category) => {
    try {
      await categoryService.toggle(category.id);
      loadCategories();
    } catch (error) {
      console.error('Failed to toggle category:', error);
    }
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', description: '' });
            setError('');
          }}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
                {(typeof error === 'string' && (error.includes('403') || error.toLowerCase().includes('session'))) ? (
                  <div className="mt-2">
                    <p className="text-xs text-red-700">
                      Click the button to clear your cache and log in again.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
            {(typeof error === 'string' && (error.includes('403') || error.toLowerCase().includes('session'))) && (
              <div className="ml-3">
                <ClearCacheButton />
              </div>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-8 max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input"
                rows={3}
              />
            </div>
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-green-200">
                <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z\" />
                </svg>
              </div>
              <button
                onClick={() => handleToggle(category)}
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  category.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {category.isActive ? 'Active' : 'Inactive'}
              </button>
            </div>
            <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="text-sm text-primary-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
