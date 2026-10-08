'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Plus } from 'lucide-react';
import Link from 'next/link';

export default function OwnerDashboard() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ownerId = localStorage.getItem('ownerId');
    const isOwnerLoggedIn = localStorage.getItem('isOwnerLoggedIn');

    if (!ownerId || isOwnerLoggedIn !== 'true') {
      router.push('/owner-login');
      return;
    }

    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const ownerId = localStorage.getItem('ownerId');
      const response = await fetch('/api/businesses');
      const data = await response.json();
      if (Array.isArray(data)) {
        const ownerBusinesses = data.filter(b => b.ownerId === ownerId);
        setBusinesses(ownerBusinesses);
      } else {
        setBusinesses([]);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ownerEmail');
    localStorage.removeItem('ownerId');
    localStorage.removeItem('businessId');
    localStorage.removeItem('isOwnerLoggedIn');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gold-200 shadow-luxury p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-charcoal mb-2 font-serif">Owner Dashboard</h1>
              <p className="text-softgray">Manage all businesses</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/add-business"
                className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Business
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-gold-200 text-charcoal rounded-xl hover:border-gold-500 hover:bg-gold-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {businesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-softgray mb-6">No businesses found</p>
              <Link
                href="/add-business"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Your First Business
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Business</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Rating</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Votes</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Verified</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((business) => (
                    <tr
                      key={business._id}
                      className="border-b border-gold-100 hover:bg-ivory-50 cursor-pointer"
                      onClick={() => router.push(`/admin/business/${business._id}/edit`)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {business.logo && (
                            <img
                              src={business.logo}
                              alt={business.name}
                              className="w-12 h-12 object-contain rounded-lg border border-gold-200"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                          <div>
                            <p className="font-medium text-charcoal">{business.name}</p>
                            <p className="text-sm text-softgray">{business.contactNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-softgray">{business.email || '-'}</td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gold-600">
                          {business.averageRating.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-softgray">{business.totalVotes}</td>
                      <td className="py-4 px-4">
                        {business.isVerified ? (
                          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Verified</span>
                        ) : (
                          <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">Not Verified</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {business.manualRank ? (
                          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">#{business.manualRank}</span>
                        ) : (
                          <span className="text-softgray text-sm">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gold-600 hover:text-gold-700 font-medium text-sm">Edit</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
