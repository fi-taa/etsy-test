'use client';

import { useEffect, useState } from 'react';
import { fetchListings } from '../utils/fetchListings';
import { useRouter } from 'next/navigation';

interface Listing {
  listingId: string;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
}

export default function ListingBrowser({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const loadListings = async () => {
      const data = await fetchListings({ customerId, search, offset, limit });
      setListings(data.listings);
      setTotal(data.total);
    };
    loadListings();
  }, [customerId, search, offset]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </button>

        <div className="mb-8">
            
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOffset(0);
            }}
            className="w-full p-3 rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm shadow-sm hover:border-gray-300 transition-all duration-200 placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        <div className="grid gap-6">
          {listings.map((listing, index) => (
            <div
              key={`${listing.listingId}-${index}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {listing.image && (
                  <div className="md:w-1/3">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{listing.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{listing.description}</p>
                  {listing.tags && listing.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {listing.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
            disabled={offset === 0}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
            aria-label="Previous page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-1">
            {(() => {
              const totalPages = Math.ceil(total / limit);
              const currentPage = Math.floor(offset / limit) + 1;
              const pages = [];
              
              // Always show first page
              pages.push(1);
              
              // Calculate range around current page
              let start = Math.max(2, currentPage - 1);
              let end = Math.min(totalPages - 1, currentPage + 1);
              
              // Add ellipsis after first page if needed
              if (start > 2) {
                pages.push('...');
              }
              
              // Add pages around current page
              for (let i = start; i <= end; i++) {
                pages.push(i);
              }
              
              // Add ellipsis before last page if needed
              if (end < totalPages - 1) {
                pages.push('...');
              }
              
              // Always show last page if there's more than one page
              if (totalPages > 1) {
                pages.push(totalPages);
              }
              
              return pages.map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setOffset((Number(page) - 1) * limit)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              ));
            })()}
          </div>

          <button
            onClick={() => setOffset((prev) => prev + limit)}
            disabled={offset + limit >= total}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
            aria-label="Next page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
