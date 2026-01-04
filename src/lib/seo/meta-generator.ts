import type { Metadata } from 'next';
import { loadVentureConfig, getVentureMetadata } from '@/lib/content/loader';
import type { Article } from '@/lib/content/types';

interface MetaOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
}

/**
 * Get the base URL for the site
 */
export function getBaseUrl(): string {
  const venture = getVentureMetadata();
  const domain = venture.domain || 'openventure.vercel.app';

  // Handle domains that might already have protocol
  if (domain.startsWith('http')) {
    return domain;
  }

  return `https://${domain}`;
}

/**
 * Generate meta tags for a page
 */
export function generatePageMeta(options: MetaOptions): Metadata {
  const venture = getVentureMetadata();
  const config = loadVentureConfig();
  const baseUrl = getBaseUrl();

  const defaultTitle = `${venture.name} - ${venture.tagline}`;
  const title = options.title || defaultTitle;

  const defaultDescription = config?.business?.value_proposition || venture.tagline;
  const description = options.description || defaultDescription;

  const url = options.path ? `${baseUrl}${options.path}` : baseUrl;
  const image = options.image || `${baseUrl}/og-image.png`;

  // Combine venture keywords with page-specific keywords
  const baseKeywords = config?.blog?.seo?.secondary_keywords || [];
  const primaryKeyword = config?.blog?.seo?.primary_keyword;
  const keywords = [
    ...(primaryKeyword ? [primaryKeyword] : []),
    ...baseKeywords,
    ...(options.keywords || []),
  ];

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: options.author || venture.name }],
    creator: venture.name,
    publisher: venture.name,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
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
    openGraph: {
      title,
      description,
      url,
      siteName: venture.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: options.type || 'website',
      ...(options.publishedTime && { publishedTime: options.publishedTime }),
      ...(options.modifiedTime && { modifiedTime: options.modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: `@${venture.name.toLowerCase().replace(/\s/g, '')}`,
    },
  };

  return metadata;
}

/**
 * Generate meta tags for the homepage
 */
export function generateHomeMeta(): Metadata {
  const venture = getVentureMetadata();
  const config = loadVentureConfig();

  return generatePageMeta({
    title: `${venture.name} - ${venture.tagline}`,
    description: config?.business?.value_proposition || venture.tagline,
    path: '/',
    type: 'website',
  });
}

/**
 * Generate meta tags for the blog listing page
 */
export function generateBlogMeta(): Metadata {
  const venture = getVentureMetadata();

  return generatePageMeta({
    title: `Blog | ${venture.name}`,
    description: `Read the latest insights, guides, and articles from ${venture.name}. Expert content on ${venture.tagline.toLowerCase()}.`,
    path: '/blog',
    type: 'website',
  });
}

/**
 * Generate meta tags for a blog article
 */
export function generateArticleMeta(article: Article): Metadata {
  const venture = getVentureMetadata();
  const config = loadVentureConfig();
  const baseUrl = getBaseUrl();

  const title = `${article.Headline} | ${venture.name} Blog`;
  const description = article.Subtitle || article.Teaser || article.TLDR;

  // Use article slug for image (placeholder until image generation)
  const image = `${baseUrl}/blog/${article.slug}/og-image.png`;

  // Parse publication date
  const publishedTime = article.publication_date
    ? new Date(article.publication_date).toISOString()
    : undefined;

  // Author info
  const authorName = config?.blog?.author?.name || venture.name;

  return generatePageMeta({
    title,
    description,
    path: `/blog/${article.slug}`,
    image,
    type: 'article',
    publishedTime,
    modifiedTime: publishedTime,
    author: authorName,
    keywords: [article.category || ''].filter(Boolean),
  });
}

/**
 * Generate meta tags for static pages (About, Privacy, Terms, etc.)
 */
export function generateStaticPageMeta(
  pageName: string,
  customDescription?: string
): Metadata {
  const venture = getVentureMetadata();

  const pageDescriptions: Record<string, string> = {
    about: `Learn more about ${venture.name} and our mission to help entrepreneurs launch faster.`,
    privacy: `Privacy Policy for ${venture.name}. Learn how we protect your data and privacy.`,
    terms: `Terms of Service for ${venture.name}. Read our terms and conditions.`,
    contact: `Contact ${venture.name}. Get in touch with our team.`,
    careers: `Join the ${venture.name} team. View our open positions and career opportunities.`,
  };

  const pageTitles: Record<string, string> = {
    about: 'About Us',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    contact: 'Contact Us',
    careers: 'Careers',
  };

  const pageKey = pageName.toLowerCase();
  const title = `${pageTitles[pageKey] || pageName} | ${venture.name}`;
  const description = customDescription || pageDescriptions[pageKey] || `${pageName} - ${venture.name}`;

  return generatePageMeta({
    title,
    description,
    path: `/${pageKey}`,
    type: 'website',
  });
}
