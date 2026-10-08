'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';

export default function EditBusiness({ params }) {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchBusiness();
  }, [params.id]);

  const fetchBusiness = async () => {
    try {
      const response = await fetch(`/api/businesses/${params.id}`);
      const data = await response.json();
      setBusiness(data);
    } catch (error) {
      setError('Failed to load business');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBusiness({
      ...business,
      [e.target.name]: e.target.value,
    });
  };

  const handleProductsChange = (e) => {
    const productsArray = e.target.value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    setBusiness({
      ...business,
      productsAndServices: productsArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/businesses/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(business),
      });

      if (!response.ok) {
        throw new Error('Failed to update business');
      }

      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center">
        <p className="text-softgray">Business not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gold-200 shadow-luxury p-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push('/admin')}
              className="p-2 rounded-lg border border-gold-200 text-charcoal hover:border-gold-500 hover:bg-gold-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-charcoal mb-2 font-serif">Edit Business</h1>
              <p className="text-softgray">Update business information</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Business Name *</label>
              <input
                type="text"
                name="name"
                required
                value={business.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  required
                  value={business.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">WhatsApp Number *</label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  required
                  value={business.whatsappNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Address *</label>
              <input
                type="text"
                name="address"
                required
                value={business.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={business.email || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={business.website || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Logo URL</label>
              <input
                type="url"
                name="logo"
                value={business.logo || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
              />
              {business.logo && (
                <img
                  src={business.logo}
                  alt="Logo preview"
                  className="mt-2 w-20 h-20 object-contain rounded-lg border border-gold-200"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Description</label>
              <textarea
                name="description"
                value={business.description || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Products & Services
              </label>
              <input
                type="text"
                name="productsAndServices"
                value={business.productsAndServices?.join(', ') || ''}
                onChange={handleProductsChange}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                placeholder="Service 1, Service 2, Product 1 (comma-separated)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Manual Rank</label>
                <input
                  type="number"
                  name="manualRank"
                  value={business.manualRank || ''}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                  placeholder="Leave empty for auto-rank"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={business.isVerified}
                    onChange={(e) => setBusiness({ ...business, isVerified: e.target.checked })}
                    className="w-5 h-5 rounded border-gold-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span className="text-sm font-medium text-charcoal">Verified Business</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="px-6 py-3 border border-gold-200 text-charcoal rounded-xl hover:border-gold-500 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
