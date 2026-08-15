import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://radiancehardware.com';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Radiance | Architectural Brass Hardware Manufacturer & Exporter',
    template: '%s | Radiance Architectural Hardware',
  },
  description:
    'Radiance is an established Indian brass foundry and exporter manufacturing solid brass, bronze, and iron architectural door handles, mortise knobs, cabinet pulls, and window fittings for global specifiers.',
  keywords: [
    'Radiance Hardware',
    'Architectural Hardware Manufacturer India',
    'Brass Door Handles Exporter',
    'Aligarh Brass Foundry',
    'Mortise Door Knobs Wholesale',
    'Solid Brass Cabinet Pulls',
    'Ironmongery Manufacturer Exporter',
    'B2B Hardware RFQ Portal',
  ],
  authors: [{ name: 'Radiance Hardware Manufacturers Private Limited', url: SITE_URL }],
  creator: 'Radiance Hardware',
  publisher: 'Radiance Hardware Manufacturers Private Limited',
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
    siteName: 'Radiance Architectural Hardware',
    title: 'Radiance | Architectural Brass Hardware Manufacturer & Exporter',
    description:
      'Direct factory manufacturer exporting solid brass, bronze, and hand-forged ironmongery to global architects, specifiers, and hardware stockists.',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Radiance Architectural Brass Hardware Foundry & Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radiance | Architectural Brass Hardware Manufacturer & Exporter',
    description:
      'Direct factory manufacturer exporting solid brass, bronze, and hand-forged ironmongery to global architects, specifiers, and hardware stockists.',
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
    <html lang="en" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <body className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#222222] font-sans antialiased selection:bg-[#B08D57] selection:text-[#FAF9F6]">
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
