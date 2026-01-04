import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/content/articles';
import { getVentureMetadata } from '@/lib/content/loader';

export default function sitemap(): MetadataRoute.Sitemap {
  const venture = getVentureMetadata();
  const baseUrl = `https://${venture.domain}`;
  const articles = getAllArticles();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Blog article pages
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.publication_date
      ? new Date(article.publication_date)
      : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages];
}
