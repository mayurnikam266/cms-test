'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { announcementService } from '@/lib/announcements';
import { uploadService } from '@/lib/upload';
import { compressAnnouncementImage, validateImage } from '@/lib/imageCompression';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    imageKey: '',
    status: 'active' as 'active' | 'inactive',
    displayOrder: 0,
    isActive: true,
  });
  const [previewUrl, setPreviewUrl] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    const validation = validateImage(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      // Show compression status
      setCompressing(true);
      setCompressionInfo('');
      
      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      
      // Compress image
      const compressedFile = await compressAnnouncementImage(file);
      const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
      const savings = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
      
      setCompressionInfo(
        `Original: ${originalSize}MB → Compressed: ${compressedSize}MB (${savings}% smaller)`
      );
      
      setCompressing(false);
      setUploading(true);
      
      const result = await uploadService.uploadImage(compressedFile, 'announcements');

      setFormData({
        ...formData,
        imageUrl: result.url,
        imageKey: result.key,
      });
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setCompressing(false);
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      alert('Please upload an image');
      return;
    }

    try {
      setLoading(true);
      await announcementService.create(formData);
      router.push('/admin/announcements');
    } catch (error) {
      console.error('Failed to create announcement:', error);
      alert('Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Announcement</h1>
        <p className="text-gray-600 mt-2">Create a new announcement for the image gallery</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Announcement Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="Enter announcement title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="input"
              placeholder="Enter announcement description (optional)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
              }
              className="input"
              placeholder="0"
            />
            <p className="text-sm text-gray-500 mt-1">
              Lower numbers appear first (0 = highest priority)
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
              }
              className="input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>
        </div>

        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Image *</h2>

          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading || compressing}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <p className="text-sm text-gray-500 mt-2">
              Recommended: 1920x1080px or similar ratio. Images will be automatically compressed for optimal quality and size.
            </p>
          </div>

          {compressing && (
            <div className="text-center py-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-blue-700 mt-2 font-medium">Compressing image...</p>
            </div>
          )}

          {compressionInfo && !compressing && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-semibold">✓ Compression successful:</span> {compressionInfo}
              </p>
            </div>
          )}

          {uploading && (
            <div className="text-center py-4 bg-primary-50 rounded-lg border border-primary-200 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-sm text-primary-700 mt-2 font-medium">Uploading to server...</p>
            </div>
          )}

          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || uploading || compressing || !formData.imageUrl}
            className="btn-primary"
          >
            {loading ? 'Creating...' : 'Create Announcement'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
