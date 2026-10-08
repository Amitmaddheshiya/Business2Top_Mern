'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Check, X, LogOut } from 'lucide-react';
import { isAuthenticated, logout } from '@/lib/auth';

export default function Admin() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('/api/businesses');
      const data = await response.json();
      if (Array.isArray(data)) {
        setBusinesses(data);
      } else {
        console.error('API returned non-array data:', data);
        setBusinesses([]);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (businessId, currentStatus) => {
    try {
      const business = businesses.find((b) => b._id === businessId);
      await fetch(`/api/businesses/${businessId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...business,
          isVerified: !currentStatus,
        }),
      });
      fetchBusinesses();
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  const handleUpdateRank = async (businessId, newRank) => {
    try {
      const business = businesses.find((b) => b._id === businessId);
      await fetch(`/api/businesses/${businessId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...business,
          manualRank: newRank ? parseInt(newRank) : null,
        }),
      });
      fetchBusinesses();
    } catch (error) {
      console.error('Error updating rank:', error);
    }
  };

  const handleDelete = async (businessId) => {
    if (!confirm('Are you sure you want to delete this business?')) return;

    try {
      await fetch(`/api/businesses/${businessId}`, {
        method: 'DELETE',
      });
      fetchBusinesses();
    } catch (error) {
      console.error('Error deleting business:', error);
    }
  };

  const handleLogout = () => {
    logout();
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
              <h1 className="text-3xl font-bold text-charcoal mb-2 font-serif">Admin Dashboard</h1>
              <p className="text-softgray">Manage all business listings</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-gold-200 text-charcoal rounded-xl hover:border-gold-500 hover:bg-gold-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {businesses.length === 0 ? (
            <p className="text-center text-softgray py-12">No businesses registered yet</p>
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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Manual Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((business) => (
                    <tr key={business._id} className="border-b border-gold-100 hover:bg-ivory-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-charcoal">{business.name}</p>
                          <p className="text-sm text-softgray">{business.contactNumber}</p>
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
                        <button
                          onClick={() => handleToggleVerification(business._id, business.isVerified)}
                          className={`p-2 rounded-lg transition-colors ${
                            business.isVerified
                              ? 'bg-gold-100 text-gold-600 hover:bg-gold-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {business.isVerified ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          min="1"
                          value={business.manualRank || ''}
                          onChange={(e) => handleUpdateRank(business._id, e.target.value)}
                          placeholder="Set rank"
                          className="w-20 px-3 py-2 rounded-lg border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all text-center"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleDelete(business._id)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
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
