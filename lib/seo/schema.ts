import { Product, Category, Collection } from '@/lib/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://radiancehardware.com';

export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`;
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Radiance Architectural Hardware',
    legalName: 'Radiance Hardware Manufacturers Private Limited',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Premier manufacturer and exporter of handcrafted solid brass, bronze, and iron architectural door and cabinet hardware.',
    foundingDate: '1994',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Building No. 4/2, Anoopshahr Road, Front of Radio Colony, Jamalpur',
      addressLocality: 'Aligarh',
      addressRegion: 'Uttar Pradesh',
      postalCode: '202001',
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-120-456-7890',
        contactType: 'export sales',
        email: 'export@radiancehardware.com',
        areaServed: ['US', 'GB', 'CA', 'AU', 'AE', 'DE', 'FR'],
        availableLanguage: ['English', 'Hindi'],
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/radiance-architectural-hardware',
      'https://www.instagram.com/radiancehardware',
    ],
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ManufacturingBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'Radiance Architectural Hardware Foundry',
    image: `${SITE_URL}/images/factory-foundry.jpg`,
    url: SITE_URL,
    telephone: '+91-120-456-7890',
    email: 'export@radiancehardware.com',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Building No. 4/2, Anoopshahr Road, Front of Radio Colony, Jamalpur',
      addressLocality: 'Aligarh',
      addressRegion: 'Uttar Pradesh',
      postalCode: '202001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.8974,
      longitude: 78.088,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:30',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Radiance Architectural Hardware',
    description: 'Export catalog and wholesale RFQ portal for architectural brass hardware.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateWebPageSchema(title: string, description: string, path: string) {
  const url = getCanonicalUrl(path);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}/#webpage`,
    url: url,
    name: title,
    description: description,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    inLanguage: 'en-US',
  };
}

export interface BreadcrumbItemSchema {
  name: string;
  url?: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItemSchema[]) {
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    ...items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 2,
      name: item.name,
      ...(item.url ? { item: getCanonicalUrl(item.url) } : {}),
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

export function generateProductSchema(product: Product) {
  const productUrl = getCanonicalUrl(`/product/${product.slug}`);
  const images = product.images.length > 0 ? product.images : [`${SITE_URL}/images/placeholder.jpg`];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}/#product`,
    name: product.name,
    description: product.description,
    sku: product.sku,
    mpn: product.sku,
    image: images,
    url: productUrl,
    category: `${product.categoryName} > ${product.subcategoryName}`,
    brand: {
      '@type': 'Brand',
      name: 'Radiance Architectural Hardware',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Radiance Hardware Manufacturers Private Limited',
    },
    material: product.material,
    color: product.finishes.join(', '),
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      price: '0.00',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        priceType: 'https://schema.org/ListPrice',
        description: 'Wholesale Factory Pricing available upon RFQ submission',
      },
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Radiance Hardware Manufacturers',
      },
    },
  };
}

export function generateCollectionSchema(
  name: string,
  description: string,
  path: string,
  products?: Product[]
) {
  const collectionUrl = getCanonicalUrl(path);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${collectionUrl}/#collection`,
    name,
    description,
    url: collectionUrl,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    ...(products && products.length > 0
      ? {
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: products.length,
            itemListElement: products.slice(0, 12).map((p, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              url: getCanonicalUrl(`/product/${p.slug}`),
              name: p.name,
            })),
          },
        }
      : {}),
  };
}

export function generateContactPageSchema() {
  const url = getCanonicalUrl('/contact');
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${url}/#contactpage`,
    url: url,
    name: 'Contact Wholesale Division & Export Desk | Radiance Hardware',
    description: 'Direct communication desk for hardware specifiers, architects, and international bulk importers.',
    mainEntity: {
      '@type': 'ContactPoint',
      telephone: '+91-120-456-7890',
      contactType: 'Export Desk',
      email: 'export@radiancehardware.com',
      areaServed: 'Worldwide',
    },
  };
}

export function generateFAQPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
