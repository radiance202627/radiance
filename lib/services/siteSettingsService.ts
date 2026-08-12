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
  companyName: 'B2B Architectural Hardware',
  logo: '/images/logo.png',
  email: 'info@architecturalhardware.com',
  phone: '+1 (800) 555-0199',
  whatsapp: '+1 (800) 555-0199',
  address: '100 Architectural Way, Hardware District, NY 10001',
  googleMapUrl: 'https://maps.google.com',
  socialLinks: {
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
  },
  seoDefaults: {
    metaTitle: 'B2B Architectural Hardware Catalogue & Supply',
    metaDescription: 'Manufactured solid brass, bronze, and stainless steel architectural ironmongery for heritage & modern projects.',
  },
  footerContent: {
    copyright: '© 2026 B2B Architectural Hardware. All Rights Reserved.',
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
