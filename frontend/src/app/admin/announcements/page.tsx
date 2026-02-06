'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { announcementService, Announcement } from '@/lib/announcements';
import { getImageUrl } from '@/lib/api';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await announcementService.getAll();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await announcementService.delete(id);
      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      alert('Failed to delete announcement');
    }
  };

  const handleStatusToggle = async (announcement: Announcement) => {
    try {
      const newStatus = announcement.status === 'active' ? 'inactive' : 'active';
      const updated = await announcementService.update(announcement.id, {
        status: newStatus,
      });
      setAnnouncements(announcements.map((a) => (a.id === announcement.id ? updated : a)));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update announcement status');
    }
  };

  if (loading) {
    return <div>Loading announcements...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-gray-600 mt-2">Manage announcements and image gallery</p>
        </div>
        <Link href="/admin/announcements/new" className="btn-primary">
          + Add Announcement
        </Link>
      </div>

      {announcements.length === 0 ? (
        <div className="card text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-600 mb-4">No announcements yet</p>
          <p className="text-sm text-gray-500 mb-6">
            Gallery will be visible on the website once you add your first announcement
          </p>
          <Link href="/admin/announcements/new" className="btn-primary">
            Create Your First Announcement
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="card overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={getImageUrl(announcement.imageUrl)}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      announcement.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {announcement.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
                {announcement.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {announcement.description}
                  </p>
                )}
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <span>Order: {announcement.displayOrder}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/announcements/${announcement.id}`}
                    className="flex-1 btn-secondary text-center text-sm py-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleStatusToggle(announcement)}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    {announcement.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
