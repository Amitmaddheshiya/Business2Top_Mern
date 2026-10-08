import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Business2Top - Luxury Business Directory',
  description: 'Premium business directory and rating platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-ivory-50 min-h-screen">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gold-200 shadow-luxury">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="font-serif text-2xl font-bold text-gold-600 hover:text-gold-700 transition-colors">
                Business2Top
              </Link>
              <div className="flex space-x-8">
                <Link href="/" className="text-charcoal hover:text-gold-600 transition-colors font-medium">
                  Home Directory
                </Link>
                <Link href="/add-business" className="text-charcoal hover:text-gold-600 transition-colors font-medium">
                  + Add Business
                </Link>
                <Link href="/admin" className="text-charcoal hover:text-gold-600 transition-colors font-medium">
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
