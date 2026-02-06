'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Category, Product } from '@/types';
import { productService } from '@/lib/products';
import { categoryService } from '@/lib/categories';
import { uploadService } from '@/lib/upload';
import AuthHelpBanner from '@/components/admin/AuthHelpBanner';
import ClearCacheButton from '@/components/admin/ClearCacheButton';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    specifications: '',
    status: 'draft',
    stock: '0',
    sku: '',
    featured: false,
  });

  useEffect(() => {
    loadCategories();
    loadProduct();
  }, [productId]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      console.log('Loaded categories:', data);
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setError('Failed to load categories. Please refresh the page.');
    }
  };

  const loadProduct = async () => {
    try {
      const data = await productService.getById(productId);
      setProduct(data);
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        categoryId: data.categoryId || '',
        specifications: data.specifications || '',
        status: data.status,
        stock: data.stock.toString(),
        sku: data.sku || '',
        featured: data.featured || false,
      });
      
      // Set existing image as preview
      if (data.images && data.images.length > 0) {
        setImagePreview(data.images[0].url);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      setError('Failed to load product');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      setUploading(true);
      const url = await uploadService.uploadImageUrl(file, formData.name);
      setUploadedImageUrl(url);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Clean form data - remove empty strings and convert to proper types
      const updateData: any = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        status: formData.status,
        featured: formData.featured,
      };
      
      // Only include categoryId if it's selected and valid
      if (formData.categoryId && formData.categoryId.trim() !== '') {
        updateData.categoryId = formData.categoryId;
      }
      
      // Only include sku if it's provided
      if (formData.sku && formData.sku.trim() !== '') {
        updateData.sku = formData.sku;
      }
      
      // Only include specifications if provided
      if (formData.specifications && formData.specifications.trim() !== '') {
        updateData.specifications = formData.specifications;
      }
      
      console.log('Updating product with data:', updateData);
      
      const updatedProduct = await productService.update(productId, updateData);

      // Link newly uploaded image to product if exists
      if (uploadedImageUrl) {
        try {
          await productService.addImage(productId, uploadedImageUrl);
          alert('Product and image updated successfully!');
        } catch (imgError) {
          console.error('Failed to add image to product:', imgError);
          alert('Product updated but failed to add new image. You can try uploading again.');
        }
      } else {
        alert('Product updated successfully!');
      }

      router.push('/admin/products');
    } catch (error: any) {
      console.error('Failed to update product:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update product';
      
      if (error.response?.status === 403) {
        setError('Access denied. Please clear your browser cache and login again. See FIX_LOGIN_ISSUE.md');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update product information</p>
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
                {(typeof error === 'string' && (error.includes('403') || error.toLowerCase().includes('forbidden'))) ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-red-700">
                      <strong>Common cause:</strong> Your login session may have expired or cached credentials are invalid.
                    </p>
                    <p className="text-xs text-red-700">
                      <strong>Quick fix:</strong> Click the button below to clear your cache and log in again.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
            {(typeof error === 'string' && (error.includes('403') || error.toLowerCase().includes('forbidden'))) && (
              <div className="ml-3">
                <ClearCacheButton />
              </div>
            )}
          </div>
        </div>
      )}

      <AuthHelpBanner />

      <form onSubmit={handleSubmit} className="card max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="label">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="label">Price *</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Stock *</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Category *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="input"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">SKU</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="input"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Specifications</label>
            <textarea
              value={formData.specifications}
              onChange={(e) =>
                setFormData({ ...formData, specifications: e.target.value })
              }
              className="input"
              rows={4}
              placeholder="Power: 400W&#10;Efficiency: 21%&#10;Warranty: 25 years"
            />
          </div>

          <div>
            <label className="label">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-900">
              Featured Product
              <span className="block text-xs text-gray-500 font-normal">Show this product in featured section on homepage</span>
            </label>
          </div>

          <div>
            <label className="label">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="input"
            />
            {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                {uploadedImageUrl && (
                  <p className="text-xs text-green-600 mt-1">New image uploaded</p>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Upload a new image to replace the existing one. Images are automatically optimized.
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Product'}
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
  );
}
