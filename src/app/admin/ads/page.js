'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';

export default function ManageAds() {
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAd, setNewAd] = useState({
    brandName: '',
    imageUrl: '',
    linkUrl: '',
    offerText: '',
    subtitle: '',
    videoUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads');
      const data = await response.json();
      setAds(data);
    } catch (error) {
      setError('Failed to load ads');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAd),
      });

      if (!response.ok) {
        throw new Error('Failed to create ad');
      }

      setNewAd({ brandName: '', imageUrl: '', linkUrl: '', offerText: '', subtitle: '', videoUrl: '' });
      setShowForm(false);
      fetchAds();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (adId) => {
    if (!confirm('Are you sure you want to delete this ad?')) {
      return;
    }

    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ad');
      }

      fetchAds();
    } catch (err) {
      alert('Failed to delete ad');
    }
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="p-2 rounded-lg border border-gold-200 text-charcoal hover:border-gold-500 hover:bg-gold-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-charcoal font-serif">Manage Brand Ads</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add New Ad
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
            {error}
          </div>
        )}

        {/* Add Ad Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gold-200 shadow-luxury p-6 mb-8">
            <h2 className="text-xl font-bold text-charcoal mb-6">Add New Brand Ad</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Brand Name</label>
                <input
                  type="text"
                  required
                  value={newAd.brandName}
                  onChange={(e) => setNewAd({ ...newAd, brandName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none"
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Image URL</label>
                <input
                  type="url"
                  required
                  value={newAd.imageUrl}
                  onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none"
                  placeholder="Enter image URL (e.g., https://example.com/logo.png)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Link URL</label>
                <input
                  type="url"
                  required
                  value={newAd.linkUrl}
                  onChange={(e) => setNewAd({ ...newAd, linkUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none"
                  placeholder="Enter destination URL (e.g., https://brand.com)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Offer Text (Optional)</label>
                <input
                  type="text"
                  value={newAd.offerText}
                  onChange={(e) => setNewAd({ ...newAd, offerText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none"
                  placeholder="e.g., BIG OFFER, Buy 1 Get 2"
                />
                <p className="text-xs text-softgray mt-1">This will be shown as animated colorful text in navbar</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Subtitle (Optional)</label>
                <input
                  type="text"
                  value={newAd.subtitle}
                  onChange={(e) => setNewAd({ ...newAd, subtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none"
                  placeholder="e.g., Limited time offer"
                />
                <p className="text-xs text-softgray mt-1">Smaller animated text below offer text</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Video URL (Optional)</label>
                <input
                  type="url"
                  value={newAd.videoUrl}
                  onChange={(e) => setNewAd({ ...newAd, videoUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none"
                  placeholder="e.g., https://youtube.com/watch?v=xxx"
                />
                <p className="text-xs text-softgray mt-1">YouTube or video link (will be shown if image is not provided)</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? 'Creating...' : 'Create Ad'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gold-200 text-charcoal rounded-xl hover:border-gold-500 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Ads List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad._id} className="bg-white rounded-2xl border border-gold-200 shadow-luxury overflow-hidden">
              <div className="p-4 bg-gold-50 border-b border-gold-100">
                <h3 className="font-bold text-charcoal">{ad.brandName}</h3>
              </div>
              <div className="p-4">
                {ad.offerText && (
                  <p className="text-sm font-bold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-2">
                    {ad.offerText}
                  </p>
                )}
                {ad.subtitle && (
                  <p className="text-xs text-softgray mb-2">{ad.subtitle}</p>
                )}
                <img
                  src={ad.imageUrl}
                  alt={ad.brandName}
                  className="w-full h-32 object-contain rounded-lg border border-gold-200 mb-4"
                  onError={(e) => e.target.src = '/placeholder.png'}
                />
                {ad.videoUrl && (
                  <p className="text-xs text-softgray mb-2 truncate">📹 {ad.videoUrl}</p>
                )}
                <p className="text-xs text-softgray mb-2 truncate">{ad.linkUrl}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${ad.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {ad.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {ads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-softgray text-lg">No ads found. Click "Add New Ad" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
