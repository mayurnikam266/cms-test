import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Test Agency - Solar Panels & Electronics',
  description: 'Leading provider of high-efficiency solar panels and electronic solutions',
  keywords: 'solar panels, electronics, renewable energy, test agency',
};

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
