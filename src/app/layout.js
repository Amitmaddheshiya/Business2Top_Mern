import './globals.css';
import Link from 'next/link';
import Navbar from './Navbar';

export const metadata = {
  title: 'TrustMark - Luxury Business Directory',
  description: 'Premium business directory and rating platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-ivory-50 min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
