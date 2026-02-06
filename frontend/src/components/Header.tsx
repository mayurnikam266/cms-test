'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSiteSettings, getImageUrl, type SiteSettings } from '@/lib/sanity.queries';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

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
        <div className="flex justify-between items-center py-3.5">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              {logoUrl ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg group-hover:shadow-orange-500/90 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ring-2 ring-transparent group-hover:ring-orange-400">
                  <img src={logoUrl} alt={siteName} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/90 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ring-2 ring-transparent group-hover:ring-orange-400">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              )}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-pulse shadow-lg shadow-yellow-300/60"></div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500 group-hover:text-orange-400 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]">
                {siteName}
              </div>
              <div className="text-xs text-gray-400 font-medium tracking-wide group-hover:text-amber-300 transition-colors duration-300">
                {siteSettings?.tagline || 'SOLAR & ELECTRONICS'}
              </div>
            </div>
          </Link>
          
          {/* Navigation Links */}
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

          {/* Right Section: Language Selector & Admin Button */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="hidden lg:block">
              <LanguageSelector />
            </div>
            
            {/* Admin CMS Button - Opens Sanity Studio */}
            <a
              href={process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://your-project.sanity.studio'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-lg shadow-lg hover:shadow-orange-400/70 transition-all duration-300 hover:scale-105 border border-amber-400/40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Admin
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
