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
              <div className="flex space-x-8 items-center">
                <Link href="/" className="text-charcoal hover:text-gold-600 transition-colors font-medium">
                  Home Directory
                </Link>
                {/* 3D Animated Badge */}
                <div className="relative group">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full animate-pulse shadow-lg shadow-gold-500/50"></div>
                    <div className="absolute inset-1 bg-gradient-to-br from-gold-300 to-gold-500 rounded-full animate-bounce shadow-inner"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <span className="text-white font-bold text-lg drop-shadow-lg">#1</span>
                      <span className="text-white text-xs font-semibold drop-shadow-md">Trusted</span>
                    </div>
                  </div>
                  <div className="absolute -inset-2 bg-gold-400/20 rounded-full blur-xl animate-ping opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
