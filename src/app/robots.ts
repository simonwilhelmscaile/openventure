import { MetadataRoute } from 'next';
import { getVentureMetadata } from '@/lib/content/loader';

export default function robots(): MetadataRoute.Robots {
  const venture = getVentureMetadata();
  const baseUrl = `https://${venture.domain}`;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
