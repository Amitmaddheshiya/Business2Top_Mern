'use client';

	import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddBusiness() {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const ownerId = localStorage.getItem('ownerId');
    const isOwnerLoggedIn = localStorage.getItem('isOwnerLoggedIn');
    
    if (!ownerId || isOwnerLoggedIn !== 'true') {
      router.push('/owner-login');
      return;
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const ownerId = localStorage.getItem('ownerId');
    console.log('OwnerId from localStorage:', ownerId);

    if (!ownerId) {
      setError('Please login as a business owner first');
      router.push('/owner-login');
      return;
    }

    // Parse comma-separated products/services into array
    const productsArray = formData.productsAndServices
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          productsAndServices: productsArray,
          ownerId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('API Error:', data);
        throw new Error(data.error || 'Failed to create business');
      }

      router.push('/owner-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-gold-200 shadow-luxury p-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2 font-serif">Register Your Business</h1>
          <p className="text-softgray mb-8">Join our premium business directory and reach more customers</p>

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
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                placeholder="Enter your business name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  required
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">WhatsApp Number *</label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  required
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Address *</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                placeholder="Full business address"
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
                placeholder="business@example.com"
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
                placeholder="https://yourbusiness.com"
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
                placeholder="https://yourbusiness.com/logo.png"
              />
              <p className="text-xs text-softgray mt-1">Enter the URL of your business logo image</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white resize-none"
                placeholder="Tell customers about your business..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Products & Services
              </label>
              <input
                type="text"
                name="productsAndServices"
                value={formData.productsAndServices}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
                placeholder="Service 1, Service 2, Product 1 (comma-separated)"
              />
              <p className="text-xs text-softgray mt-1">Separate multiple items with commas</p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Submitting...' : 'Register Business'}
              </button>
              <Link
                href="/"
                className="px-6 py-3 border border-gold-200 text-charcoal rounded-xl hover:border-gold-500 transition-colors font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
