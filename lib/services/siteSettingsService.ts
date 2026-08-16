import prisma, { withDbTimeout } from '@/lib/prisma';

export interface SiteSettingsData {
  companyName?: string;
  logo?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  googleMapUrl?: string;
  socialLinks?: Record<string, string>;
  seoDefaults?: Record<string, string>;
  footerContent?: Record<string, string>;
}

const DEFAULT_SETTINGS = {
  id: 'default',
  companyName: 'SB PATTERN WORKS',
  logo: '/images/logo.png',
  email: 'Sales@sbpatternworks.com',
  phone: '+91 (120) 456-7890',
  whatsapp: '+91 (120) 456-7890',
  address: 'E-41 CDF CHHERAT, INDUSTRIAL AREA CDF, ALIGARH, UTTAR PRADESH 202001, India',
  googleMapUrl: 'https://maps.google.com',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/sb-pattern-works',
    instagram: 'https://instagram.com/sbpatternworks',
  },
  seoDefaults: {
    metaTitle: 'SB PATTERN WORKS | Architectural Hardware & Foundry',
    metaDescription: 'SB PATTERN WORKS - Premier luxury manufacturer & exporter of solid brass, bronze, copper & custom metal architectural hardware in Aligarh, India.',
  },
  footerContent: {
    copyright: '© 2026 SB PATTERN WORKS. All Rights Reserved.',
  },
};

export async function getSiteSettings() {
  try {
    const settings = await withDbTimeout(
      prisma.siteSettings.findUnique({
        where: { id: 'default' },
      })
    );

    if (settings) {
      return settings;
    }
  } catch (error) {
    console.warn('Database error or timeout in getSiteSettings, using defaults:', error);
  }

  return DEFAULT_SETTINGS;
}

export async function updateSiteSettings(data: SiteSettingsData) {
  return prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {
      ...data,
      socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks) : undefined,
      seoDefaults: data.seoDefaults ? JSON.stringify(data.seoDefaults) : undefined,
      footerContent: data.footerContent ? JSON.stringify(data.footerContent) : undefined,
    },
    create: {
      id: 'default',
      companyName: data.companyName || DEFAULT_SETTINGS.companyName,
      logo: data.logo || DEFAULT_SETTINGS.logo,
      email: data.email || DEFAULT_SETTINGS.email,
      phone: data.phone || DEFAULT_SETTINGS.phone,
      whatsapp: data.whatsapp || DEFAULT_SETTINGS.whatsapp,
      address: data.address || DEFAULT_SETTINGS.address,
      googleMapUrl: data.googleMapUrl || DEFAULT_SETTINGS.googleMapUrl,
      socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks) : JSON.stringify(DEFAULT_SETTINGS.socialLinks),
      seoDefaults: data.seoDefaults ? JSON.stringify(data.seoDefaults) : JSON.stringify(DEFAULT_SETTINGS.seoDefaults),
      footerContent: data.footerContent ? JSON.stringify(data.footerContent) : JSON.stringify(DEFAULT_SETTINGS.footerContent),
    },
  });
}
