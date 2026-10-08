'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';

export default function OwnerEditBusiness({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    whatsappNumber: '',
    address: '',
    email: '',
    website: '',
    logo: '',
    description: '',
    productsAndServices: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    const ownerId = localStorage.getItem('ownerId');
    const isOwnerLoggedIn = localStorage.getItem('isOwnerLoggedIn');

    if (!ownerId || isOwnerLoggedIn !== 'true') {
      router.push('/owner-login');
      return;
    }

    fetchBusiness();
  }, [params.id]);

  const fetchBusiness = async () => {
    try {
      const response = await fetch(`/api/businesses/${params.id}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }

      setFormData({
        name: data.name || '',
        contactNumber: data.contactNumber || '',
        whatsappNumber: data.whatsappNumber || '',
        address: data.address || '',
        email: data.email || '',
        website: data.website || '',
        logo: data.logo || '',
        description: data.description || '',
        productsAndServices: data.productsAndServices ? data.productsAndServices.join(', ') : '',
      });
      setLogoPreview(data.logo || '');
    } catch (error) {
      setError('Failed to fetch business details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'logo') {
      setLogoPreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const productsArray = formData.productsAndServices
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    try {
      const response = await fetch(`/api/businesses/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productsAndServices: productsArray,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update business');
      }

      router.push('/owner-dashboard');
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

  return (
    <div className="min-h-screen bg-ivory-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gold-200 shadow-luxury p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/owner-dashboard')}
                className="p-2 hover:bg-gold-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-charcoal" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-charcoal mb-2 font-serif">Edit Business</h1>
                <p className="text-softgray">Update your business details</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Preview */}
            {logoPreview && (
              <div className="flex justify-center mb-6">
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-32 h-32 object-contain rounded-lg border border-gold-200"
                  onError={() => setLogoPreview('')}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Business Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  required
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Logo URL</label>
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Address *</label>
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Products & Services (comma separated)
              </label>
              <input
                type="text"
                name="productsAndServices"
                value={formData.productsAndServices}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                placeholder="e.g., Web Development, SEO, Marketing"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/owner-dashboard')}
                className="flex items-center gap-2 px-6 py-3 border border-gold-200 text-charcoal rounded-xl hover:border-gold-500 hover:bg-gold-50 transition-colors font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
