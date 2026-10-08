'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { Search, Star, ExternalLink, MessageCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const BusinessCard = memo(({ business, index, onRate }) => {
  const isTop10 = index < 10 || business.manualRank !== null;

  const getWhatsAppLink = (whatsappNumber, businessName) => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(`Hello! I found ${businessName} on Business2Top and would like to inquire about your services.`);
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  return (
    <div
      className={`bg-white rounded-2xl border p-6 transition-all hover:shadow-gold-glow ${
        isTop10
          ? 'border-gold-400 shadow-gold-glow'
          : 'border-gold-200 shadow-luxury'
      }`}
    >
      {/* Logo */}
      {business.logo && (
        <div className="mb-4 flex justify-center">
          <img
            src={business.logo}
            alt={`${business.name} logo`}
            className="w-20 h-20 object-contain rounded-lg"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      )}

      {/* Header with Title and Verification Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-charcoal">{business.name}</h3>
          {business.isVerified && (
            <div className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded-full shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-transform">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-xs font-semibold text-white">Trusted</span>
            </div>
          )}
        </div>
        {business.manualRank !== null && (
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-transform">
            #{business.manualRank}
          </span>
        )}
      </div>

      {/* Rating Display */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gold-50 border border-gold-200 rounded-lg px-3 py-2">
          <span className="text-lg font-bold text-gold-600">
            {business.averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-softgray"> / 5</span>
          <Star className="w-4 h-4 text-gold-500 inline ml-1 fill-gold-500" />
        </div>
        <span className="text-sm text-softgray">({business.totalVotes} votes)</span>
      </div>

      {/* Interactive Star Rating */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(business._id, star)}
            className="hover:scale-110 transition-transform"
          >
            <Star
              className={`w-5 h-5 ${
                business.isRated
                  ? 'text-blue-600 fill-blue-600'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Description */}
      {business.description && (
        <p className="text-softgray text-sm mb-4 line-clamp-2">{business.description}</p>
      )}

      {/* Products & Services Tags */}
      {business.productsAndServices && business.productsAndServices.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {business.productsAndServices.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-ivory-100 text-charcoal px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Contact Info */}
      <div className="space-y-2 mb-4 text-sm text-softgray">
        <p className="flex items-center gap-2">
          <span className="font-medium text-charcoal">Address:</span>
          {business.address}
        </p>
        <p className="flex items-center gap-2">
          <span className="font-medium text-charcoal">Phone:</span>
          {business.contactNumber}
        </p>
        {business.email && (
          <p className="flex items-center gap-2">
            <span className="font-medium text-charcoal">Email:</span>
            {business.email}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {business.website && (
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-charcoal text-white rounded-xl hover:bg-gold-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Website
          </a>
        )}
        <a
          href={getWhatsAppLink(business.whatsappNumber, business.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
});

BusinessCard.displayName = 'BusinessCard';

export default function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortFilter, setSortFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/businesses');
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
  }, []);

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
          <h1 className="text-3xl font-bold text-charcoal font-serif">Business2Top</h1>
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
            <p className="text-softgray text-lg">No businesses found. Be the first to add one!</p>
            <Link
              href="/owner-login"
              className="inline-block mt-4 px-6 py-3 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors"
            >
              Add Your Business
            </Link>
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
