import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { QuoteProvider } from '@/context/QuoteContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toast } from '@/components/ui/Toast';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Radience | Luxury B2B Architectural Hardware Manufacturer & Exporter',
    template: '%s | Radience Luxury Hardware B2B',
  },
  description: 'Radience - Ultra-premium door, window, cabinet, decorative and architectural hardware for luxury interior designers, architects, distributors, and global buyers.',
  keywords: [
    'Radience Luxury Hardware',
    'Bespoke Architectural Hardware',
    'Luxury Brass Door Handles',
    'Custom Cabinet Pulls',
    'Architectural Ironmongery Exporter',
    'Request For Quote Hardware',
  ],
  authors: [{ name: 'Radience Luxury Hardware Exporters' }],
  openGraph: {
    title: 'Radience | Luxury B2B Architectural Hardware Catalog',
    description: 'Explore bespoke architectural and decorative hardware for luxury estates, hotels, and high-end residential developments.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable} scroll-smooth`}>
      <body className="flex flex-col min-h-screen bg-brand-slate text-brand-text font-sans antialiased selection:bg-brand-brass selection:text-white">
        <QuoteProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toast />
        </QuoteProvider>
      </body>
    </html>
  );
}
