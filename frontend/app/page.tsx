'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Notification from '@/components/Notification';

const CUSTOMER_IDS = [
  '23f9031b-3a4d-426a-9621-a80a9c401efb',
  '2b0ef8b4-8504-45f0-af36-baa81a8b0a90',
  'db166d5d-6353-44d0-8d26-b384f095f9f9',
  '7c9ec8ed-49b4-40f3-9a63-39fb1c833879',
];

interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const handleFetch = async (customerId: string) => {
    try {
      setLoading(customerId);
      const res = await fetch(`http://localhost:5000/api/listings/${customerId}`);
      const data = await res.json();
      
      if (data.error) {
        setNotification({
          message: `Error: ${data.error}`,
          type: 'error'
        });
      } else {
        setNotification({
          message: `Successfully stored ${data.inserted} new listings for customer ${customerId}`,
          type: 'success'
        });
      }
    } catch (error: any) {
      setNotification({
        message: `Failed to fetch listings: ${error.message}`,
        type: 'error'
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">🛍️ Etsy Listings</h1>
          <p className="text-lg text-gray-600">Select a customer to manage their listings</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {CUSTOMER_IDS.map((id, index) => (
            <div key={id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer {index + 1}</h3>
                <div className="group relative">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <p className="break-all">ID: {id}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  onClick={() => router.push(`/listings/${id}`)}
                >
                  View Listings
                </button>
                <button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleFetch(id)}
                  disabled={loading === id}
                >
                  {loading === id ? 'Storing...' : 'Fetch + Store'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </main>
  );
}
