'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OwnerLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/owner/login' : '/api/owner/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed');
      }

      if (isLogin) {
        localStorage.setItem('ownerEmail', data.email);
        localStorage.setItem('ownerId', data.ownerId);
        localStorage.setItem('businessId', data.businessId || '');
        localStorage.setItem('isOwnerLoggedIn', 'true');

        if (data.businessId) {
          router.push('/owner-dashboard');
        } else {
          router.push('/add-business');
        }
      } else {
        setIsLogin(true);
        setError('Registration successful! Please login.');
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gold-200 shadow-luxury p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-charcoal mb-2 font-serif text-center">
          {isLogin ? 'Business Owner Login' : 'Business Owner Registration'}
        </h1>
        <p className="text-softgray mb-6 text-center">
          {isLogin ? 'Login to manage your business' : 'Create your business account'}
        </p>

        {error && !success && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
              placeholder="business@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all bg-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-gold-600 hover:text-gold-700 font-medium"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gold-200 text-center">
          <Link href="/user-login" className="text-softgray hover:text-charcoal text-sm">
            Regular User? Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
