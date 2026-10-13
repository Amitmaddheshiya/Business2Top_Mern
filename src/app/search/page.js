'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, CheckCircle, Crown } from 'lucide-react';
import { formatNumber } from '@/lib/formatNumber';

export default function SearchPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('/api/businesses');
      const data = await response.json();
      if (Array.isArray(data)) {
        setBusinesses(data);
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

  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (business.uniqueId && business.uniqueId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (business.description && business.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProfileClick = (business) => {
    setSelectedBusiness(business);
    setShowModal(true);
  };

  const cleanName = (name) => {
    return name
      .replace(/office of the/gi, '')
      .replace(/office of/gi, '')
      .trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-4 font-serif">Search Profiles</h1>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all text-lg"
            />
          </div>
        </div>

        {/* Results Count */}
        <p className="text-softgray mb-6">
          {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'profile' : 'profiles'} found
        </p>

        {/* Grid Layout */}
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-softgray text-lg">No profiles found matching your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredBusinesses.map((business) => {
              const effectiveRank = business.manualRank || business.autoRank;
              const displayRank = Math.ceil(effectiveRank / 10);
              const isTop10 = effectiveRank <= 10;
              const showCrown = business.hasCrown === true || (business.hasCrown === false && isTop10);

              return (
                <div
                  key={business._id}
                  onClick={() => handleProfileClick(business)}
                  className="bg-white rounded-2xl border border-gold-200 shadow-luxury overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-gold-200/50 transition-all duration-300 transform hover:-translate-y-1 relative"
                >
                  {/* Rank Badge */}
                  {business.autoRank && (
                    <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 rounded-br-lg rounded-tl-xl z-10">
                      <span className="font-bold text-xs">#{displayRank}</span>
                    </div>
                  )}

                  {/* Crown Badge */}
                  {showCrown && (
                    <div className="absolute top-0 right-0 bg-black text-white px-2 py-1 rounded-bl-lg rounded-tr-xl z-10">
                      <Crown className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    </div>
                  )}

                  {/* Profile Image */}
                  <div className="aspect-square relative">
                    {business.logo ? (
                      <img
                        src={business.logo}
                        alt={business.name}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gold-100 to-ivory-100 flex items-center justify-center">
                        <span className="text-4xl font-bold text-gold-600">
                          {cleanName(business.name).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-charcoal text-sm truncate mb-1">
                      {cleanName(business.name)}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-softgray">{formatNumber(business.totalVotes)} votes</span>
                      {business.isVerified && (
                        <CheckCircle className="w-3 h-3 text-blue-600" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile Detail Modal */}
      {showModal && selectedBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative h-64 bg-gradient-to-r from-gold-100 to-ivory-100">
              {selectedBusiness.logo && (
                <img
                  src={selectedBusiness.logo}
                  alt={selectedBusiness.name}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal font-serif mb-2">
                    {cleanName(selectedBusiness.name)}
                  </h2>
                  {selectedBusiness.isVerified && (
                    <div className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded-lg inline-flex">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span className="text-sm font-semibold text-white">Elite</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gold-600">{formatNumber(selectedBusiness.totalVotes)}</p>
                  <p className="text-sm text-softgray">Votes</p>
                </div>
              </div>

              {selectedBusiness.description && (
                <div className="mb-4">
                  <h3 className="font-semibold text-charcoal mb-2">About</h3>
                  <p className="text-gray-600">{selectedBusiness.description}</p>
                </div>
              )}

              {selectedBusiness.address && (
                <div className="mb-4">
                  <h3 className="font-semibold text-charcoal mb-2">Address</h3>
                  <p className="text-gray-600">{selectedBusiness.address}</p>
                </div>
              )}

              {selectedBusiness.contactNumber && (
                <div className="mb-4">
                  <h3 className="font-semibold text-charcoal mb-2">Contact</h3>
                  <p className="text-gray-600">{selectedBusiness.contactNumber}</p>
                </div>
              )}

              {selectedBusiness.email && (
                <div className="mb-4">
                  <h3 className="font-semibold text-charcoal mb-2">Email</h3>
                  <p className="text-gray-600">{selectedBusiness.email}</p>
                </div>
              )}

              {selectedBusiness.website && (
                <div className="mb-4">
                  <h3 className="font-semibold text-charcoal mb-2">Website</h3>
                  <a
                    href={selectedBusiness.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-600 hover:text-gold-700"
                  >
                    {selectedBusiness.website}
                  </a>
                </div>
              )}

              {selectedBusiness.productsAndServices && selectedBusiness.productsAndServices.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-charcoal mb-2">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBusiness.productsAndServices.map((service, idx) => (
                      <span
                        key={idx}
                        className="bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
