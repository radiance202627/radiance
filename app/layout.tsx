import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { QuoteProvider } from '@/context/QuoteContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toast } from '@/components/ui/Toast';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateWebsiteSchema,
} from '@/lib/seo/schema';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sbpatternworks.com';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SB PATTERN WORKS | Architectural Hardware & Custom Craft Manufacturer',
    template: '%s | SB PATTERN WORKS',
  },
  description:
    'SB PATTERN WORKS is an established Indian brass foundry and exporter manufacturing solid brass, bronze, copper, and custom pattern architectural hardware for global specifiers.',
  keywords: [
    'SB PATTERN WORKS',
    'Architectural Hardware Manufacturer India',
    'Brass Door Handles Exporter',
    'Aligarh Metal Foundry',
    'Custom Craft Manufacturing',
    'OEM Metal Development',
    'Pattern Works Aligarh',
    'B2B Hardware RFQ Portal',
  ],
  authors: [{ name: 'SB PATTERN WORKS Private Limited', url: SITE_URL }],
  creator: 'SB PATTERN WORKS',
  publisher: 'SB PATTERN WORKS Private Limited',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'SB PATTERN WORKS',
    title: 'SB PATTERN WORKS | Architectural Hardware & Custom Craft Manufacturer',
    description:
      'Direct factory manufacturer exporting solid brass, bronze, and custom pattern ironmongery to global architects, specifiers, and hardware stockists.',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'SB PATTERN WORKS Metal Foundry & Hardware Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SB PATTERN WORKS | Architectural Hardware & Custom Craft Manufacturer',
    description:
      'Direct factory manufacturer exporting solid brass, bronze, and custom pattern ironmongery to global architects, specifiers, and hardware stockists.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans antialiased selection:bg-[#9E7B47]/20 selection:text-[#9E7B47]">
        <JsonLd data={[orgSchema, localBusinessSchema, websiteSchema]} />
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
