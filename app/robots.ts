import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sbpatternworks.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api',
          '/api/',
          '/quote',
          '/request-quote/success',
          '/*?*q=',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
