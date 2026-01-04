import { loadVentureConfig, getVentureMetadata } from '@/lib/content/loader';
import type { Article, FAQItem } from '@/lib/content/types';
import { getBaseUrl } from './meta-generator';

/**
 * Schema.org types
 */
interface SchemaOrganization {
  '@type': 'Organization';
  '@id': string;
  name: string;
  url: string;
  logo?: {
    '@type': 'ImageObject';
    url: string;
    width: number;
    height: number;
  };
  sameAs?: string[];
}

interface SchemaWebSite {
  '@type': 'WebSite';
  '@id': string;
  url: string;
  name: string;
  description: string;
  publisher: { '@id': string };
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

interface SchemaBreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

interface SchemaBreadcrumbList {
  '@type': 'BreadcrumbList';
  itemListElement: SchemaBreadcrumbItem[];
}

interface SchemaArticle {
  '@type': 'Article';
  '@id': string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: { '@id': string };
  mainEntityOfPage: { '@id': string };
  wordCount: number;
  image?: {
    '@type': 'ImageObject';
    url: string;
    width: number;
    height: number;
  };
  articleSection?: string;
}

interface SchemaFAQPage {
  '@type': 'FAQPage';
  mainEntity: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }[];
}

interface SchemaGraph {
  '@context': 'https://schema.org';
  '@graph': (
    | SchemaOrganization
    | SchemaWebSite
    | SchemaBreadcrumbList
    | SchemaArticle
    | SchemaFAQPage
  )[];
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(): SchemaOrganization {
  const venture = getVentureMetadata();
  const baseUrl = getBaseUrl();

  return {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: venture.name,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      width: 512,
      height: 512,
    },
  };
}

/**
 * Generate WebSite schema
 */
export function generateWebSiteSchema(): SchemaWebSite {
  const venture = getVentureMetadata();
  const config = loadVentureConfig();
  const baseUrl = getBaseUrl();

  return {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: venture.name,
    description: config?.business?.value_proposition || venture.tagline,
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: { name: string; path?: string }[]
): SchemaBreadcrumbList {
  const baseUrl = getBaseUrl();

  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path && index < items.length - 1
        ? { item: `${baseUrl}${item.path}` }
        : {}),
    })),
  };
}

/**
 * Generate Article schema
 */
export function generateArticleSchema(article: Article): SchemaArticle {
  const venture = getVentureMetadata();
  const config = loadVentureConfig();
  const baseUrl = getBaseUrl();

  const articleUrl = `${baseUrl}/blog/${article.slug}`;
  const authorName = config?.blog?.author?.name || venture.name;
  const publishedDate = article.publication_date
    ? new Date(article.publication_date).toISOString()
    : new Date().toISOString();

  return {
    '@type': 'Article',
    '@id': `${articleUrl}#article`,
    headline: article.Headline,
    description: article.Subtitle || article.TLDR,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    mainEntityOfPage: {
      '@id': articleUrl,
    },
    wordCount: article.word_count,
    image: {
      '@type': 'ImageObject',
      url: `${baseUrl}/blog/${article.slug}/hero.jpg`,
      width: 1200,
      height: 630,
    },
    articleSection: article.category,
  };
}

/**
 * Generate FAQPage schema from FAQ items
 */
export function generateFAQSchema(faqItems: FAQItem[]): SchemaFAQPage {
  return {
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Generate complete schema graph for homepage
 */
export function generateHomePageSchema(): SchemaGraph {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebSiteSchema(),
      generateBreadcrumbSchema([{ name: 'Home', path: '/' }]),
    ],
  };
}

/**
 * Generate complete schema graph for blog listing
 */
export function generateBlogPageSchema(): SchemaGraph {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebSiteSchema(),
      generateBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Blog' },
      ]),
    ],
  };
}

/**
 * Generate complete schema graph for an article page
 */
export function generateArticlePageSchema(article: Article): SchemaGraph {
  const schemas: SchemaGraph['@graph'] = [
    generateOrganizationSchema(),
    generateWebSiteSchema(),
    generateBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: article.Headline },
    ]),
    generateArticleSchema(article),
  ];

  // Add FAQ schema if article has FAQ items
  if (article.faq_items && article.faq_items.length > 0) {
    schemas.push(generateFAQSchema(article.faq_items));
  }

  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}

/**
 * Convert schema object to JSON-LD script tag content
 */
export function schemaToJsonLd(schema: SchemaGraph): string {
  return JSON.stringify(schema);
}
