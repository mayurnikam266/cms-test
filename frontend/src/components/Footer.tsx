'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getSiteSettings, getImageUrl, type SiteSettings } from '@/lib/sanity.queries';

export default function Footer() {
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

  const siteName = siteSettings?.siteName || 'Shree Ganesha Solar Agency';
  const tagline = siteSettings?.tagline || 'Solar & Electronics';
  const logoUrl = siteSettings?.logo ? getImageUrl(siteSettings.logo, 80) : null;

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {logoUrl ? (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-md">
                  <Image src={logoUrl} alt={siteName} fill sizes="40px" className="object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">TA</span>
                </div>
              )}
              <div>
                <div className="text-xl font-bold">{siteName}</div>
                <div className="text-xs text-gray-500">{tagline}</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Leading provider of high-efficiency solar panels and electronic solutions for a sustainable future.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/products?category=solar-panels" className="hover:text-white">Solar Panels</Link></li>
              <li><Link href="/products?category=inverters" className="hover:text-white">Inverters</Link></li>
              <li><Link href="/products?category=batteries" className="hover:text-white">Batteries</Link></li>
              <li><Link href="/products?category=electronics" className="hover:text-white">Electronics</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {siteSettings?.contactEmail && <li>Email: {siteSettings.contactEmail}</li>}
              {siteSettings?.contactPhone && <li>Phone: {siteSettings.contactPhone}</li>}
              {siteSettings?.address && <li>Address: {siteSettings.address}</li>}
              {(siteSettings?.city || siteSettings?.state || siteSettings?.pincode) && (
                <li>
                  {[siteSettings?.city, siteSettings?.state, siteSettings?.pincode].filter(Boolean).join(', ')}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
