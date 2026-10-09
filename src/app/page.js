'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { Search, Star, Globe, MessageCircle, CheckCircle, Check, Crown } from 'lucide-react';
import Link from 'next/link';

const BusinessCard = memo(({ business, index, onRate }) => {
  const isTop10 = index < 10 || business.manualRank !== null;

  const getWhatsAppLink = (whatsappNumber, businessName) => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(`Hello! I found ${businessName} on TrustMark and would like to inquire about your services.`);
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gold-200 shadow-luxury overflow-hidden hover:shadow-2xl hover:shadow-gold-200/50 transition-all duration-300 transform hover:-translate-y-1 relative">
      {/* #1 Badge - Top Left */}
      {business.manualRank === 1 && (
        <div className="absolute top-0 left-0 bg-black text-white px-3 py-1.5 rounded-br-xl rounded-tl-2xl z-10">
          <span className="font-bold text-lg">#1</span>
        </div>
      )}

      {/* Crown Badge - Top Right (no background) */}
      {business.hasCrown && (
        <div className="absolute top-2 right-2 z-10">
          <Crown className="w-8 h-8 text-yellow-500 fill-yellow-500 drop-shadow-lg" />
        </div>
      )}

      {/* Elite Badge with Tick - Top Right (below crown) */}
      {business.isVerified && (
        <div className="absolute top-12 right-2 z-10">
          <div className="flex items-center gap-1 bg-blue-600 px-2 py-1 rounded-lg shadow-md shadow-blue-500/20">
            <Check className="w-3 h-3 text-white fill-white" />
            <span className="text-xs font-semibold text-white">Elite</span>
          </div>
        </div>
      )}

      {/* Card Header with Logo and Badges */}
      <div className="bg-gradient-to-r from-gold-50 to-ivory-50 p-6 border-b border-gold-100">
        <div className="flex items-start gap-4">
          {business.logo && (
            <div className="flex-shrink-0">
              <img
                src={business.logo}
                alt={business.name}
                className="w-16 h-16 object-contain rounded-xl border-2 border-gold-200 bg-white p-2 shadow-sm"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-xl font-bold text-charcoal font-serif">{business.name}</h3>
              <div className="flex gap-1 flex-shrink-0">
                {business.isVerified && (
                  <div className="flex items-center gap-1 bg-blue-600 px-2 py-1 rounded-lg shadow-md shadow-blue-500/20">
                    <CheckCircle className="w-3 h-3 text-white" />
                    <span className="text-xs font-semibold text-white">Elite</span>
                  </div>
                )}
                {business.manualRank !== null && business.manualRank !== 1 && (
                  <span className="bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md shadow-gold-500/20">
                    #{business.manualRank}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-gold-200 shadow-sm">
                <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
                <span className="font-bold text-gold-600">{business.averageRating.toFixed(1)}</span>
                <span className="text-xs text-softgray">({business.totalVotes})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4">
        {/* Description */}
        {business.description && (
          <p className="text-softgray text-sm leading-relaxed line-clamp-2">{business.description}</p>
        )}

        {/* Products & Services */}
        {business.productsAndServices && business.productsAndServices.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-charcoal mb-2 uppercase tracking-wide">Services</p>
            <div className="flex flex-wrap gap-2">
              {business.productsAndServices.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gold-50 text-gold-700 px-3 py-1.5 rounded-lg border border-gold-200 font-medium"
                >
                  {tag}
                </span>
              ))}
              {business.productsAndServices.length > 4 && (
                <span className="text-xs text-softgray px-2 py-1.5">+{business.productsAndServices.length - 4} more</span>
              )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-charcoal uppercase tracking-wide">Contact</p>
          <div className="space-y-1.5 text-sm">
            <p className="flex items-center gap-2 text-softgray">
              <span className="w-16 font-medium text-charcoal">Phone:</span>
              <span className="font-medium text-charcoal">{business.contactNumber}</span>
            </p>
            {business.email && (
              <p className="flex items-center gap-2 text-softgray">
                <span className="w-16 font-medium text-charcoal">Email:</span>
                <span className="text-charcoal">{business.email}</span>
              </p>
            )}
            <p className="flex items-start gap-2 text-softgray">
              <span className="w-16 font-medium text-charcoal mt-0.5">Address:</span>
              <span className="text-charcoal">{business.address}</span>
            </p>
          </div>
        </div>

        {/* Rating Section */}
        <div className="pt-4 border-t border-gold-100">
          <p className="text-xs font-semibold text-charcoal mb-2 uppercase tracking-wide">Rate this business</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onRate(business._id, star)}
                className="hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-6 h-6 ${
                    business.isRated
                      ? 'text-gold-500 fill-gold-500'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gold-50 border-t border-gold-100">
        <div className="flex gap-2">
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-charcoal text-white rounded-xl hover:bg-gold-600 transition-all duration-200 font-medium text-sm"
            >
              <Globe className="w-4 h-4" />
              Visit Website
            </a>
          )}
          {business.whatsappNumber && (
            <a
              href={`https://wa.me/${business.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

BusinessCard.displayName = 'BusinessCard';

export default function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortFilter, setSortFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (sortFilter) {
        params.append('sort', sortFilter);
      }
      
      const url = `/api/businesses${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data)) {
        const ratedBusinesses = JSON.parse(localStorage.getItem('ratedBusinesses') || '[]');
        const businessesWithRating = data.map(business => ({
          ...business,
          isRated: ratedBusinesses.includes(business._id)
        }));
        setBusinesses(businessesWithRating);
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
  }, [searchTerm, sortFilter]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleRate = useCallback(async (businessId, rating) => {
    try {
      const ratedBusinesses = JSON.parse(localStorage.getItem('ratedBusinesses') || '[]');
      
      if (ratedBusinesses.includes(businessId)) {
        alert('You have already rated this business');
        return;
      }

      await fetch(`/api/businesses/${businessId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      
      // Update local storage
      ratedBusinesses.push(businessId);
      localStorage.setItem('ratedBusinesses', JSON.stringify(ratedBusinesses));
      
      fetchBusinesses();
    } catch (error) {
      console.error('Error rating business:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-ivory-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-charcoal font-serif">TrustMark</h1>
          <Link
            href="/owner-login"
            className="px-4 py-2 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors font-medium"
          >
            Business Owner Login
          </Link>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gold-200 shadow-luxury p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search businesses or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => setSortFilter('highest')}
                className={`px-4 py-3 rounded-xl border transition-all ${
                  sortFilter === 'highest'
                    ? 'bg-gold-500 text-white border-gold-500'
                    : 'bg-white border-gold-200 text-charcoal hover:border-gold-500'
                }`}
              >
                Highest Rated
              </button>
              <button
                onClick={() => setSortFilter('trending')}
                className={`px-4 py-3 rounded-xl border transition-all ${
                  sortFilter === 'trending'
                    ? 'bg-gold-500 text-white border-gold-500'
                    : 'bg-white border-gold-200 text-charcoal hover:border-gold-500'
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setSortFilter('recent')}
                className={`px-4 py-3 rounded-xl border transition-all ${
                  sortFilter === 'recent'
                    ? 'bg-gold-500 text-white border-gold-500'
                    : 'bg-white border-gold-200 text-charcoal hover:border-gold-500'
                }`}
              >
                Recently Joined
              </button>
              {sortFilter && (
                <button
                  onClick={() => setSortFilter('')}
                  className="px-4 py-3 rounded-xl border border-gold-200 bg-white text-charcoal hover:border-gold-500 transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Business Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent"></div>
            <p className="mt-4 text-softgray">Loading businesses...</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-softgray text-lg">No businesses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business, index) => (
              <BusinessCard
                key={business._id}
                business={business}
                index={index}
                onRate={handleRate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
