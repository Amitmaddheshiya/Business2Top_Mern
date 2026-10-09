'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 10000); // Rotate every 10 seconds
      return () => clearInterval(interval);
    }
  }, [ads]);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads');
      const adsData = await response.json();
      if (adsData && adsData.length > 0) {
        setAds(adsData);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const activeAd = ads[currentAdIndex];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gold-200 shadow-luxury">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 font-serif text-xl sm:text-2xl font-bold text-gold-600 hover:text-gold-700 transition-colors">
            <img src="/logo.png" alt="TrustMark Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
            <span className="hidden sm:inline">TrustMark</span>
          </Link>

          {/* Brand Ad - Center (Desktop) */}
          {activeAd && (
            <a
              href={activeAd.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex flex-1 justify-center items-center gap-3 px-4"
            >
              <img
                src={activeAd.imageUrl}
                alt={activeAd.brandName}
                className="h-10 w-auto object-contain hover:scale-110 transition-transform duration-300"
              />
              {activeAd.offerText && activeAd.offerText.trim() !== '' && (
                <div className="text-center">
                  <p className="text-lg font-bold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-[bounce_1s_infinite]">
                    {activeAd.offerText}
                  </p>
                  {activeAd.subtitle && activeAd.subtitle.trim() !== '' && (
                    <p className="text-xs text-softgray animate-pulse">{activeAd.subtitle}</p>
                  )}
                </div>
              )}
            </a>
          )}

          {/* Mobile Ad - Between Logo and Burger */}
          {activeAd && (
            <a
              href={activeAd.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden flex-1 flex items-center gap-2 mx-2"
            >
              <img
                src={activeAd.imageUrl}
                alt={activeAd.brandName}
                className="h-8 w-auto object-contain hover:scale-110 transition-transform duration-300"
              />
              {activeAd.offerText && activeAd.offerText.trim() !== '' && (
                <div className="text-center">
                  <p className="text-xs font-bold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-[bounce_1s_infinite] truncate">
                    {activeAd.offerText}
                  </p>
                  {activeAd.subtitle && activeAd.subtitle.trim() !== '' && (
                    <p className="text-xs text-softgray animate-pulse truncate">{activeAd.subtitle}</p>
                  )}
                </div>
              )}
            </a>
          )}

          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-charcoal hover:text-gold-600 transition-colors font-medium">
              Home Directory
            </Link>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-gold-200 text-charcoal hover:border-gold-500 hover:bg-gold-50 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gold-200">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 text-charcoal hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home Directory
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
