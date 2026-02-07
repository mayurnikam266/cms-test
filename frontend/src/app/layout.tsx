import type { Metadata } from 'next';
import './globals.css';
import { getSiteSettings } from '@/lib/sanity.queries';

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const siteName = siteSettings?.siteName || 'Test Agency';
  const tagline = siteSettings?.tagline || 'Solar Panels & Electronics';
  
  return {
    title: `${siteName} - ${tagline}`,
    description: `Leading provider of high-efficiency solar panels and electronic solutions - ${siteName}`,
    keywords: `solar panels, electronics, renewable energy, ${siteName.toLowerCase()}`,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
