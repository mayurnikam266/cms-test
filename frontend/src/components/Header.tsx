'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSiteSettings, getImageUrl, type SiteSettings } from '@/lib/sanity.queries';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    try {
      const settings = await getSiteSettings();
      setSiteSettings(settings);
    } catch (error) {
      console.error('Failed to load site settings:', error);
    }
  };

  const siteName = siteSettings?.siteName || 'Test Agency';
  const logoUrl = siteSettings?.logo ? getImageUrl(siteSettings.logo, 100) : null;

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {logoUrl ? (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-lg group-hover:shadow-orange-500/90 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ring-2 ring-transparent group-hover:ring-orange-400">
                  <img src={logoUrl} alt={siteName} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/90 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ring-2 ring-transparent group-hover:ring-orange-400">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              )}
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-300 rounded-full animate-pulse shadow-lg shadow-yellow-300/60"></div>
            </div>
            <div>
              <div className="text-base sm:text-xl md:text-2xl font-bold text-orange-500 group-hover:text-orange-400 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]">
                {siteName}
              </div>
              <div className="text-[9px] sm:text-xs text-gray-400 font-medium tracking-wide group-hover:text-amber-300 transition-colors duration-300 hidden sm:block">
                {siteSettings?.tagline || 'SOLAR & ELECTRONICS'}
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200 border border-transparent hover:border-amber-400/40">
              Home
            </Link>
            <Link href="/products" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200 border border-transparent hover:border-amber-400/40">
              Products
            </Link>
            <Link href="/gallery" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200 border border-transparent hover:border-amber-400/40">
              Gallery
            </Link>
            <Link href="/about" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200 border border-transparent hover:border-amber-400/40">
              About
            </Link>
            <Link href="/contact" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200 border border-transparent hover:border-amber-400/40">
              Contact
            </Link>
          </nav>

          {/* Right Section: Language, Admin, Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Login/Admin Button */}
            <a
              href={process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://your-project.sanity.studio'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-full shadow-lg hover:shadow-orange-400/70 transition-all duration-300 hover:scale-110 border-2 border-amber-400/40"
              title="Admin Login"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-gray-300 hover:text-amber-400 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200"
              >
                Products
              </Link>
              <Link
                href="/gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200"
              >
                Gallery
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200"
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
