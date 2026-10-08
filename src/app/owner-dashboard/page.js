'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, LogOut, Plus } from 'lucide-react';
import Link from 'next/link';

export default function OwnerDashboard() {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ownerId = localStorage.getItem('ownerId');
    const isOwnerLoggedIn = localStorage.getItem('isOwnerLoggedIn');
    const businessId = localStorage.getItem('businessId');

    if (!ownerId || isOwnerLoggedIn !== 'true') {
      router.push('/owner-login');
      return;
    }

    if (businessId) {
      fetchBusiness(businessId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchBusiness = async (businessId) => {
    try {
      const response = await fetch(`/api/businesses/${businessId}`);
      const data = await response.json();
      setBusiness(data);
    } catch (error) {
      console.error('Error fetching business:', error);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gold-200 shadow-luxury p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-charcoal mb-2 font-serif">Owner Dashboard</h1>
              <p className="text-softgray">Manage your business</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-gold-200 text-charcoal rounded-xl hover:border-gold-500 hover:bg-gold-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {!business ? (
            <div className="text-center py-12">
              <p className="text-softgray mb-6">You haven't created your business yet</p>
              <Link
                href="/add-business"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Your Business
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4 mb-6">
                {business.logo && (
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="w-24 h-24 object-contain rounded-lg border border-gold-200"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-charcoal mb-2">{business.name}</h2>
                  <div className="flex gap-2">
                    {business.isVerified && (
                      <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Verified</span>
                    )}
                    {business.manualRank && (
                      <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">#{business.manualRank}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gold-50 rounded-xl p-4">
                  <p className="text-sm text-softgray mb-1">Rating</p>
                  <p className="text-2xl font-bold text-gold-600">{business.averageRating.toFixed(1)} / 5</p>
                </div>
                <div className="bg-gold-50 rounded-xl p-4">
                  <p className="text-sm text-softgray mb-1">Total Votes</p>
                  <p className="text-2xl font-bold text-gold-600">{business.totalVotes}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-softgray mb-1">Contact Number</p>
                  <p className="text-charcoal">{business.contactNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-softgray mb-1">WhatsApp Number</p>
                  <p className="text-charcoal">{business.whatsappNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-softgray mb-1">Address</p>
                  <p className="text-charcoal">{business.address}</p>
                </div>
                {business.email && (
                  <div>
                    <p className="text-sm text-softgray mb-1">Email</p>
                    <p className="text-charcoal">{business.email}</p>
                  </div>
                )}
                {business.website && (
                  <div>
                    <p className="text-sm text-softgray mb-1">Website</p>
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700">
                      {business.website}
                    </a>
                  </div>
                )}
                {business.description && (
                  <div>
                    <p className="text-sm text-softgray mb-1">Description</p>
                    <p className="text-charcoal">{business.description}</p>
                  </div>
                )}
                {business.productsAndServices && business.productsAndServices.length > 0 && (
                  <div>
                    <p className="text-sm text-softgray mb-1">Products & Services</p>
                    <div className="flex flex-wrap gap-2">
                      {business.productsAndServices.map((tag, idx) => (
                        <span key={idx} className="bg-ivory-100 text-charcoal px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={`/admin/business/${business._id}/edit`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit Business
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
