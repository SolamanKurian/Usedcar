'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const scrollToParkAndSale = () => {
    if (pathname === '/') {
      // If we're on the landing page, scroll to the section
      const element = document.getElementById('park-and-sale');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to landing page with hash
      window.location.href = '/#park-and-sale';
    }
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
                                   <div className="flex flex-col">
                       <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                         PreCar
                       </h1>
                       <p className="text-xs text-gray-400 -mt-1">for all kind of vehicles</p>
                     </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                  : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/about') 
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                  : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
              }`}
            >
              About Us
            </Link>
            <Link 
              href="/all-products" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/all-products') 
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                  : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
              }`}
            >
              Explore Shop
            </Link>
            <button 
              onClick={scrollToParkAndSale}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === '/' 
                  ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50' 
                  : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
              }`}
            >
              Sell Car
            </button>
            <Link 
              href="/contact" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/contact') 
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                  : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-yellow-400 p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/about') 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/all-products" 
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/all-products') 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore Shop
              </Link>
              <button 
                onClick={() => {
                  scrollToParkAndSale();
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50 transition-all duration-200 text-left"
              >
                Sell Car
              </button>
              <Link 
                href="/contact" 
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/contact') 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 