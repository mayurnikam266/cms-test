'use client';

import { useEffect, useState } from 'react';
import { contactService, Contact } from '@/lib/contacts';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    loadContacts();
  }, [filter]);

  const loadContacts = async () => {
    try {
      const data = await contactService.getAll(filter || undefined);
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await contactService.updateStatus(id, status);
      loadContacts();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await contactService.delete(id);
      setContacts(contacts.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete contact');
    }
  };

  if (loading) {
    return <div>Loading contacts...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded ${!filter ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded ${filter === 'new' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            New
          </button>
          <button
            onClick={() => setFilter('reviewed')}
            className={`px-4 py-2 rounded ${filter === 'reviewed' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Reviewed
          </button>
          <button
            onClick={() => setFilter('responded')}
            className={`px-4 py-2 rounded ${filter === 'responded' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Responded
          </button>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No contacts found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{contact.name}</h3>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                  {contact.phone && (
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusUpdate(contact.id, e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="responded">Responded</option>
                  </select>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
              <p className="text-xs text-gray-500 mt-4">
                {new Date(contact.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
