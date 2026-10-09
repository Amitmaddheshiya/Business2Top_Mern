'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { Search, Star, Globe, MessageCircle, CheckCircle, Check, Crown, Info } from 'lucide-react';
import Link from 'next/link';

const BusinessCard = memo(({ business, index, onRate, onShowDetails }) => {
  // Calculate display rank: use manualRank if set by admin, otherwise use autoRank
  const effectiveRank = business.manualRank || business.autoRank;
  const displayRank = Math.ceil(effectiveRank / 10);
  const isTop10 = effectiveRank <= 10;

  // Crown display: top 10 auto gets crown, admin can also manually set crown on any profile
  const showCrown = business.hasCrown === true || (business.hasCrown === false && isTop10);

  // Determine card theme based on badge combinations
  const isRank1 = displayRank === 1;
  const isElite = business.isVerified;
  const hasAllBadges = isRank1 && showCrown && isElite;
  const hasRankAndCrown = isRank1 && showCrown && !isElite;
  const hasRankOnly = isRank1 && !showCrown && !isElite;

  let cardTheme = 'bg-white rounded-2xl border border-gold-200 shadow-luxury';
  let headerTheme = 'bg-gradient-to-r from-gold-50 to-ivory-50 border-b border-gold-100';
  let footerTheme = 'bg-gold-50 border-t border-gold-100';
  let animatedBorder = false;
  let borderColor = 'border-gray-400';

  if (hasAllBadges) {
    // #1 + crown + elite - silver theme with dark blue border
    borderColor = 'border-blue-600';
    cardTheme = 'bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300 rounded-2xl border-2 shadow-lg shadow-gray-500/20';
    headerTheme = 'bg-gradient-to-r from-gray-200 to-slate-300 border-b-2';
    footerTheme = 'bg-gradient-to-r from-gray-200 to-slate-300 border-t-2';
    animatedBorder = true;
  } else if (hasRankAndCrown) {
    // #1 + crown - silver theme with dark golden border
    borderColor = 'border-amber-600';
    cardTheme = 'bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300 rounded-2xl border-2 shadow-lg shadow-gray-500/20';
    headerTheme = 'bg-gradient-to-r from-gray-200 to-slate-300 border-b-2';
    footerTheme = 'bg-gradient-to-r from-gray-200 to-slate-300 border-t-2';
  } else if (hasRankOnly) {
    // #1 only - silver theme with silver border
    borderColor = 'border-gray-400';
    cardTheme = 'bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300 rounded-2xl border-2 shadow-lg shadow-gray-500/20';
    headerTheme = 'bg-gradient-to-r from-gray-200 to-slate-300 border-b-2';
    footerTheme = 'bg-gradient-to-r from-gray-200 to-slate-300 border-t-2';
  }

  cardTheme = cardTheme.replace('border-2', `border-2 ${borderColor}`);
  headerTheme = headerTheme.replace('border-b-2', `border-b-2 ${borderColor}`);
  footerTheme = footerTheme.replace('border-t-2', `border-t-2 ${borderColor}`);

  return (
    <div className={`${cardTheme} overflow-hidden hover:shadow-2xl hover:shadow-gold-200/50 transition-all duration-300 transform hover:-translate-y-1 relative flex flex-col h-full ${animatedBorder ? 'border-animated' : ''}`}>
      {/* Rank Badge - Top Left (grouped by 10s: #1 for 1-10, #2 for 11-20, etc.) */}
      {business.autoRank && (
        <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 rounded-br-lg rounded-tl-xl z-10">
          <span className="font-bold text-xs sm:text-sm">#{displayRank}</span>
        </div>
      )}

      {/* Crown Badge - Top Right (top 10 auto + admin override) */}
      {showCrown && (
        <div className="absolute top-0 right-0 bg-black text-white px-2 py-1 rounded-bl-lg rounded-tr-xl z-10">
          <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
        </div>
      )}

      {/* Card Header with Logo and Badges */}
      <div className={`${headerTheme} p-4 sm:p-6`}>
        <div className="flex flex-col items-center gap-3">
          {business.logo && (
            <div className="flex-shrink-0">
              <img
                src={business.logo}
                alt={business.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl border-2 border-gold-200 bg-white p-2 shadow-sm"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
          <div className="text-center w-full">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="text-base sm:text-xl font-bold text-charcoal font-serif truncate">{business.name}</h3>
              {business.isVerified && (
                <div className="flex items-center gap-1 bg-blue-600 px-2 py-1 rounded-lg shadow-md shadow-blue-500/20 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-white" />
                  <span className="text-xs font-semibold text-white">Elite</span>
                </div>
              )}
            </div>
            {business.uniqueId && (
              <p className="text-xs text-softgray mb-2">ID: {business.uniqueId}</p>
            )}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 bg-white px-2 sm:px-3 py-1 rounded-lg border border-gold-200 shadow-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold-500 fill-gold-500" />
                <span className="font-bold text-gold-600 text-sm sm:text-base">{business.averageRating.toFixed(1)}</span>
                <span className="text-xs text-softgray">({business.totalVotes})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-1 overflow-hidden">
        {/* Description */}
        {business.description && (
          <p className="text-softgray text-xs sm:text-sm leading-relaxed line-clamp-2">{business.description}</p>
        )}

        {/* Products & Services */}
        {business.productsAndServices && business.productsAndServices.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-charcoal mb-2 uppercase tracking-wide">Services</p>
            <div className="flex flex-wrap gap-2">
              {business.productsAndServices.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gold-50 text-gold-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gold-200 font-medium"
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
          <div className="space-y-1.5 text-xs sm:text-sm">
            {business.email && (
              <p className="flex items-center gap-2 text-softgray">
                <span className="w-12 sm:w-16 font-medium text-charcoal">Email:</span>
                <span className="text-charcoal">{business.email}</span>
              </p>
            )}
            <p className="flex items-start gap-2 text-softgray">
              <span className="w-12 sm:w-16 font-medium text-charcoal mt-0.5">Address:</span>
              <span className="text-charcoal">{business.address}</span>
            </p>
          </div>
        </div>

        {/* Rating Section */}
        <div className="pt-3 sm:pt-4 border-t border-gold-100">
          <p className="text-xs font-semibold text-charcoal mb-2 uppercase tracking-wide">Rate this business</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onRate(business._id, star)}
                className="hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-4 h-4 sm:w-6 sm:h-6 ${
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
      <div className={`px-4 sm:px-6 py-3 sm:py-4 ${footerTheme}`}>
        <div className="flex gap-2">
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-charcoal text-white rounded-xl hover:bg-gold-600 transition-all duration-200 font-medium text-xs sm:text-sm"
            >
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Visit Website</span>
              <span className="sm:hidden">Website</span>
            </a>
          )}
          <button
            onClick={() => onShowDetails(business)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-all duration-200 font-medium text-xs sm:text-sm"
          >
            <Info className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">More Details</span>
            <span className="sm:hidden">Details</span>
          </button>
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
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

      // Show success popup
      setShowRatingSuccess(true);
      setTimeout(() => setShowRatingSuccess(false), 3000);

      fetchBusinesses();
    } catch (error) {
      console.error('Error rating business:', error);
    }
  }, []);

  const handleShowDetails = useCallback((business) => {
    setSelectedBusiness(business);
    setShowModal(true);
  }, []);

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Rating Success Popup */}
      {showRatingSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-green-500/30 animate-bounce">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-white" />
            <span className="font-medium">Thank you for your rating!</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal font-serif text-center sm:text-left">TrustMark</h1>
          <Link
            href="/owner-login"
            className="px-4 py-2 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto text-center"
          >
            Business Owner Login
          </Link>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gold-200 shadow-luxury p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSortFilter('highest')}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl border transition-all text-xs sm:text-sm flex-1 sm:flex-none ${
                  sortFilter === 'highest'
                    ? 'bg-gold-500 text-white border-gold-500'
                    : 'bg-white border-gold-200 text-charcoal hover:border-gold-500'
                }`}
              >
                Highest Rated
              </button>
              <button
                onClick={() => setSortFilter('trending')}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl border transition-all text-xs sm:text-sm flex-1 sm:flex-none ${
                  sortFilter === 'trending'
                    ? 'bg-gold-500 text-white border-gold-500'
                    : 'bg-white border-gold-200 text-charcoal hover:border-gold-500'
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setSortFilter('recent')}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl border transition-all text-xs sm:text-sm flex-1 sm:flex-none ${
                  sortFilter === 'recent'
                    ? 'bg-gold-500 text-white border-gold-500'
                    : 'bg-white border-gold-200 text-charcoal hover:border-gold-500'
                }`}
              >
                Recent
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {businesses.map((business, index) => (
              <BusinessCard
                key={business._id}
                business={business}
                index={index}
                onRate={handleRate}
                onShowDetails={handleShowDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Business Details Modal */}
      {showModal && selectedBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gold-200 p-4 sm:p-6 flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-charcoal font-serif">{selectedBusiness.name}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg border border-gold-200 text-charcoal hover:border-gold-500 hover:bg-gold-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {selectedBusiness.logo && (
                <div className="flex justify-center">
                  <img
                    src={selectedBusiness.logo}
                    alt={selectedBusiness.name}
                    className="w-32 h-32 object-contain rounded-xl border-2 border-gold-200 bg-white p-4 shadow-sm"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
              {selectedBusiness.description && (
                <div>
                  <p className="text-xs font-semibold text-charcoal mb-2 uppercase tracking-wide">Description</p>
                  <p className="text-softgray text-sm leading-relaxed">{selectedBusiness.description}</p>
                </div>
              )}
              {selectedBusiness.productsAndServices && selectedBusiness.productsAndServices.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-charcoal mb-2 uppercase tracking-wide">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBusiness.productsAndServices.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gold-50 text-gold-700 px-3 py-1.5 rounded-lg border border-gold-200 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-charcoal uppercase tracking-wide">Contact Information</p>
                <div className="space-y-2 text-sm">
                  {selectedBusiness.email && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-charcoal w-20">Email:</span>
                      <span className="text-charcoal">{selectedBusiness.email}</span>
                    </p>
                  )}
                  <p className="flex items-start gap-2">
                    <span className="font-medium text-charcoal w-20 mt-0.5">Address:</span>
                    <span className="text-charcoal">{selectedBusiness.address}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gold-100">
                <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-lg border border-gold-200 shadow-sm">
                  <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
                  <span className="font-bold text-gold-600 text-lg">{selectedBusiness.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-softgray">({selectedBusiness.totalVotes} votes)</span>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gold-50 border-t border-gold-100 p-4 sm:p-6">
              <div className="flex gap-2">
                {selectedBusiness.website && (
                  <a
                    href={selectedBusiness.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-charcoal text-white rounded-xl hover:bg-gold-600 transition-colors font-medium"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
